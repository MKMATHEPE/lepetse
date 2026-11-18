package za.co.lepetse.rfq;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RfqService {
    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper;
    private final RfqFiles storage;
    public RfqService(JdbcTemplate jdbc,ObjectMapper mapper,RfqFiles storage){this.jdbc=jdbc;this.mapper=mapper;this.storage=storage;}
    static ResponseStatusException bad(String message){return new ResponseStatusException(HttpStatus.BAD_REQUEST,message);}
    private String json(Object value){try{return mapper.writeValueAsString(value);}catch(Exception e){throw new IllegalStateException(e);}}
    private String text(String value){return value==null?"":value.trim();}
    public record Receipt(String reference,String status,String receivedAt,int itemCount,int attachmentCount) {}

    @Transactional(rollbackFor=Exception.class)
    public Receipt submit(UUID key,RfqRequest request,List<MultipartFile> files) throws IOException {
        var uploads=storage.validate(files);
        String hash=RfqFiles.digest((json(request)+json(uploads.stream().map(f->List.of(f.name(),f.digest())).toList())).getBytes(StandardCharsets.UTF_8));
        jdbc.queryForList("select pg_advisory_xact_lock(hashtextextended(?,0))",key.toString());
        var existing=jdbc.queryForList("select reference,submission_hash,submitted_at from rfq where submission_key=?",key);
        if(!existing.isEmpty()){
            var row=existing.getFirst();
            if(!hash.equals(row.get("submission_hash")))throw new ResponseStatusException(HttpStatus.CONFLICT,"This submission has changed. Please review it before submitting again.");
            return new Receipt(row.get("reference").toString(),"submitted",row.get("submitted_at").toString(),request.items().size(),uploads.size());
        }
        validateRules(request,uploads.size());
        var buyer=request.buyer();
        // Resolve all product IDs before any writes. Free-text requirements remain valid.
        var productIds=new ArrayList<Long>();
        for(var item:request.items()){
            Long product=null;
            if(!text(item.productId()).isEmpty()){
                var rows=jdbc.queryForList("select id from product where legacy_id=?",item.productId());
                if(rows.isEmpty())throw bad("A selected product is no longer recognised. Remove it or enter it as a manual requirement.");
                product=((Number)rows.getFirst().get("id")).longValue();
            }
            productIds.add(product);
        }
        long customer=jdbc.queryForObject("insert into customer(organisation,contact_name,email,phone) values (?,?,?,?) returning id",Long.class,text(buyer.organisation()),text(buyer.contact()),text(buyer.email()),text(buyer.phone()));
        Instant now=Instant.now();
        long number=jdbc.queryForObject("select nextval('rfq_reference_number')",Long.class);
        String reference="RFQ-"+LocalDate.now(ZoneId.of("Africa/Johannesburg")).toString().replace("-","")+"-"+String.format(Locale.ROOT,"%06d",number);
        long id=jdbc.queryForObject("insert into rfq(reference,customer_id,buyer_type,purchase_type,recurring_requested,recurrence_notes,procurement_reference,response_deadline,alternatives_allowed,status,contact_snapshot,notes,submitted_at,submission_key,submission_hash,submission_source,requirement_snapshot) values (?,?,?,?,?,?,?,?,?,'submitted',?::jsonb,?,?,?,?,?,?::jsonb) returning id",Long.class,
                reference,customer,buyer.buyerType(),buyer.purchaseType().equals("once_off")?"once_off":"repeat",buyer.purchaseType().equals("scheduled_repeat"),buyer.purchaseType().equals("scheduled_repeat")?json(buyer):null,buyer.reference(),buyer.deadline(),List.of("Yes, subject to approval","Accept suitable alternatives").contains(buyer.alternatives()),json(buyer),buyer.notes(),java.sql.Timestamp.from(now),key,hash,request.source(),json(request));
        for(int i=0;i<request.items().size();i++){
            var item=request.items().get(i);
            jdbc.update("insert into rfq_item(rfq_id,product_id,description,quantity,ordering_unit,display_order) values (?,?,?,?,?,?)",id,productIds.get(i),text(item.description()),item.quantity(),text(item.unit()),i);
        }
        for(var site:request.deliveries())jdbc.update("insert into rfq_delivery(rfq_id,street,suburb,city,province,postal_code,contact_name,phone,required_date,date_flexibility,address_complete,instructions,building) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",id,text(site.street()),text(site.suburb()),text(site.town()),site.province(),site.postcode(),text(site.contact()),text(site.phone()),site.requiredDate(),site.flexibility(),!text(site.street()).isEmpty(),site.instructions(),site.building());
        var keys=new ArrayList<String>();
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization(){
            @Override public void afterCompletion(int status){if(status!=STATUS_COMMITTED)keys.forEach(storage::remove);}
        });
        for(var upload:uploads){
            String stored=storage.store(upload);keys.add(stored);
            jdbc.update("insert into rfq_attachment(rfq_id,original_filename,storage_key,content_type,size_bytes,scan_status,sha256) values (?,?,?,?,?,'pending',?)",id,upload.name(),stored,upload.type(),upload.bytes().length,upload.digest());
        }
        return new Receipt(reference,"submitted",now.toString(),request.items().size(),uploads.size());
    }
    private void validateRules(RfqRequest request,int files){
        var b=request.buyer();var today=LocalDate.now(ZoneId.of("Africa/Johannesburg"));
        if(request.items().isEmpty()&&files==0)throw bad("Add at least one item or attach a stationery list.");
        if(request.source().equals("document")&&files==0)throw bad("Attach your stationery list before submitting.");
        if(b.buyerType().equals("government")&&(text(b.reference()).isEmpty()||b.deadline()==null||text(b.channel()).isEmpty()))throw bad("Complete the government RFQ reference, closing deadline and official submission instructions.");
        if(b.buyerType().equals("government")&&b.purchaseType().equals("scheduled_repeat"))throw bad("Scheduled repeat requests are available for businesses only.");
        if(b.purchaseType().equals("scheduled_repeat")){
            if(!List.of("Weekly","Monthly","Custom").contains(text(b.scheduleFrequency()))||b.scheduleStart()==null||b.scheduleStart().isBefore(today)||!List.of("Until cancelled","On a date").contains(text(b.scheduleEndRule())))throw bad("Complete the requested repeat schedule with a current or future start date.");
            if(b.scheduleFrequency().equals("Custom")&&text(b.scheduleCustom()).isEmpty())throw bad("Describe the custom repeat interval.");
            if(b.scheduleEndRule().equals("On a date")&&(b.scheduleEnd()==null||b.scheduleEnd().isBefore(b.scheduleStart())))throw bad("The schedule end date must be on or after its start date.");
        }
        for(var d:request.deliveries()){
            if(d.requiredDate().isBefore(today))throw bad("Choose a current or future requested delivery date.");
            if(request.source().equals("catalogue")&&(text(d.street()).isEmpty()||text(d.suburb()).isEmpty()||text(d.phone()).isEmpty()))throw bad("Complete the physical delivery address and delivery contact number.");
        }
    }
}
