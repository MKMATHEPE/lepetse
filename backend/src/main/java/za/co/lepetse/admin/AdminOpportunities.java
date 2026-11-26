package za.co.lepetse.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.OffsetDateTime;
import java.security.Principal;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/admin/opportunities")
public class AdminOpportunities {
 private final JdbcTemplate db; private final ObjectMapper mapper;
 public AdminOpportunities(JdbcTemplate db,ObjectMapper mapper){this.db=db;this.mapper=mapper;}
 public record Details(@NotBlank @Size(max=200) String title,@NotBlank @Size(max=200) String buyer,
  @NotBlank @Size(max=120) String reference,@NotNull OffsetDateTime closing,
  @Pattern(regexp="bid|possible|skip") @NotNull String recommendation,
  @Size(max=4000) @NotNull String rationale,@Size(max=8000) @NotNull String scope,
  @Size(max=8000) @NotNull String requirements,@Size(max=2000) @NotNull String briefing,
  @Size(max=2000) @NotNull String submission,@Size(max=8000) @NotNull String documents,
  @Pattern(regexp="https?://[^\\s]+|^$") @NotNull String source,
  @NotNull @Size(max=200) String contact,@Email @NotNull @Size(max=254) String email,
  @NotNull @Size(max=100) String phone,@Pattern(regexp="business|government|schools") @NotNull String buyerType,
  @NotNull @Size(max=8000) String instructions,@Size(max=8000) String importOriginal) {}
 public record Save(@Valid @NotNull Details details,@Min(1) Integer version) {}
 public record Progress(@Pattern(regexp="new|saved|pursuing|submitted|closed|dismissed") @NotNull String progress,@Min(1) int version) {}
 private String json(Object o){try{return mapper.writeValueAsString(o);}catch(Exception e){throw new IllegalStateException(e);}}
 private Details details(Map<String,Object> row){try{return mapper.readValue(row.get("details").toString(),Details.class);}catch(Exception e){throw new IllegalStateException(e);}}
 private Map<String,Object> row(long id,boolean lock){var rows=db.queryForList("select * from work_opportunity where id=?"+(lock?" for update":""),id);if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Opportunity not found.");return rows.getFirst();}
 private Map<String,Object> view(Map<String,Object> row){var out=new LinkedHashMap<>(row);out.put("details",details(row));out.replaceAll((k,v)->v instanceof java.sql.Timestamp t?t.toInstant().toString():v);return out;}
 private void version(Map<String,Object> row,Integer version){if(version==null||((Number)row.get("version")).intValue()!=version)throw new ResponseStatusException(HttpStatus.CONFLICT,"This opportunity changed. Reload before editing.");}
 @GetMapping List<Map<String,Object>> list(){return db.queryForList("select o.*,(select string_agg(s.name,', ' order by s.id) from opportunity_search_match m join opportunity_search s on s.id=m.search_id where m.opportunity_id=o.id and not s.archived) as searches from work_opportunity o where (o.rfq_id is not null or not exists(select 1 from opportunity_search_match m join opportunity_search s on s.id=m.search_id where m.opportunity_id=o.id and s.archived) or exists(select 1 from opportunity_search_match m join opportunity_search s on s.id=m.search_id where m.opportunity_id=o.id and not s.archived)) order by (details->>'closing')::timestamptz,id").stream().map(this::view).toList();}
 @GetMapping("/{id}") Map<String,Object> get(@PathVariable long id){return view(row(id,false));}
 @PostMapping @Transactional Map<String,Object> create(@Valid @RequestBody Save save){
  var d=save.details();db.queryForList("select pg_advisory_xact_lock(hashtextextended(?,0))",d.buyer().trim().toLowerCase(Locale.ROOT)+"|"+d.reference().trim().toLowerCase(Locale.ROOT));
  var existing=db.queryForList("select * from work_opportunity where lower(btrim(buyer))=lower(btrim(?)) and lower(btrim(reference))=lower(btrim(?))",d.buyer(),d.reference());
  if(!existing.isEmpty())throw new ResponseStatusException(HttpStatus.CONFLICT,"This buyer and reference already exist. Open the existing opportunity to update it.");
  long id=db.queryForObject("insert into work_opportunity(buyer,reference,details) values (?,?,?::jsonb) returning id",Long.class,d.buyer().trim(),d.reference().trim(),json(d));return get(id);
 }
 @PutMapping("/{id}") @Transactional Map<String,Object> update(@PathVariable long id,@Valid @RequestBody Save save){
  var r=row(id,true);version(r,save.version());var d=save.details();var old=details(r);
  if(!old.buyer().equals(d.buyer())||!old.reference().equals(d.reference()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Buyer and reference identify this notice and cannot be changed.");
  String notice=!old.closing().toInstant().equals(d.closing().toInstant())?"Closing deadline changed":!old.documents().equals(d.documents())?"Documents updated":"";
  db.update("update work_opportunity set details=?::jsonb,version=version+1,change_notice=?,updated_at=now() where id=?",json(d),notice,id);return get(id);
 }
 @PostMapping("/{id}/progress") @Transactional Map<String,Object> progress(@PathVariable long id,@Valid @RequestBody Progress p){
  var r=row(id,true);version(r,p.version());if(p.progress().equals("pursuing")&&r.get("rfq_id")==null)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Use Pursue to create the linked request.");
  if(p.progress().equals("submitted")&&r.get("rfq_id")==null)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Pursue the opportunity before recording submission.");
  db.update("update work_opportunity set progress=?,version=version+1,updated_at=now() where id=?",p.progress(),id);return get(id);
 }
 @PostMapping("/{id}/pursue") @Transactional Map<String,Object> pursue(@PathVariable long id,Principal principal){
  var r=row(id,true);if(r.get("rfq_id")!=null)return Map.of("rfqId",r.get("rfq_id"));var d=details(r);
  if(d.closing().toInstant().isBefore(java.time.Instant.now()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"This opportunity has closed. Check for an official deadline extension first.");
  if(d.contact().isBlank()||d.email().isBlank())throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Add the buyer contact and email before pursuing.");
  var buyer=new LinkedHashMap<String,Object>();buyer.put("organisation",d.buyer());buyer.put("contact",d.contact());buyer.put("email",d.email());buyer.put("phone",d.phone());buyer.put("buyerType",d.buyerType());buyer.put("purchaseType","once_off");buyer.put("reference",d.reference());buyer.put("channel",d.submission());buyer.put("notes",d.scope()+"\n"+d.instructions());
  long customer=db.queryForObject("insert into customer(organisation,contact_name,email,phone) values (?,?,?,?) returning id",Long.class,d.buyer(),d.contact(),d.email(),d.phone());
  long number=db.queryForObject("select nextval('rfq_reference_number')",Long.class);String reference="RFQ-"+java.time.LocalDate.now(java.time.ZoneId.of("Africa/Johannesburg")).toString().replace("-","")+"-"+String.format(Locale.ROOT,"%06d",number);
  long rfq=db.queryForObject("insert into rfq(reference,customer_id,buyer_type,purchase_type,procurement_reference,response_deadline,status,contact_snapshot,notes,submitted_at,requirement_snapshot) values (?,?,?,'once_off',?,?,'submitted',?::jsonb,?,now(),?::jsonb) returning id",Long.class,reference,customer,d.buyerType(),d.reference(),java.sql.Timestamp.from(d.closing().toInstant()),json(buyer),"Work opportunity: "+d.reference()+"\n"+d.scope()+"\nRequirements: "+d.requirements()+"\nSubmission: "+d.submission()+"\nDocuments: "+d.documents()+"\nSource: "+d.source()+"\n"+d.instructions(),json(Map.of("buyer",buyer,"items",List.of(),"opportunityId",id)));
  db.update("insert into rfq_activity(rfq_id,actor_username,previous_status,new_status) values (?,?,'draft','submitted')",rfq,principal.getName());
  db.update("update work_opportunity set rfq_id=?,progress='pursuing',version=version+1,updated_at=now() where id=?",rfq,id);return Map.of("rfqId",rfq);
 }
}
