package za.co.lepetse.admin;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.security.Principal;
import java.time.*;
import java.util.*;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class AdminRfqController {
    private static final Set<String> STATUSES=Set.of("submitted","in_review","approved","quoted","closed","cancelled");
    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper;
    private final DeadlineAlerts deadlines;
    public AdminRfqController(JdbcTemplate jdbc,ObjectMapper mapper,DeadlineAlerts deadlines){this.jdbc=jdbc;this.mapper=mapper;this.deadlines=deadlines;}
    @GetMapping({"/admin","/admin/"}) String home(){return "redirect:/admin/index.html";}
    @GetMapping("/api/admin/session") @ResponseBody
    Map<String,Object> session(Authentication authentication,CsrfToken csrf){
        boolean signedIn=authentication!=null&&authentication.isAuthenticated()&&!(authentication instanceof AnonymousAuthenticationToken);
        return Map.of("authenticated",signedIn,"username",signedIn?authentication.getName():"","csrfToken",csrf.getToken(),"csrfParameter",csrf.getParameterName(),"csrfHeader",csrf.getHeaderName());
    }
    private Map<String,Object> json(Object value){try{return mapper.readValue(value.toString(),new TypeReference<LinkedHashMap<String,Object>>(){});}catch(Exception e){throw new IllegalStateException("Invalid stored request",e);}}
    private void dates(Map<String,Object> row){row.replaceAll((key,value)->value instanceof java.sql.Timestamp date?date.toInstant().toString():value instanceof java.sql.Date date?date.toLocalDate().toString():value);}

    @GetMapping("/api/admin/rfqs") @ResponseBody
    @Transactional(readOnly=true,isolation=org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    Map<String,Object> inbox(@RequestParam(defaultValue="0") @Min(0) int page,
            @RequestParam(defaultValue="20") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue="") String status,
            @RequestParam(defaultValue="") String buyer,
            @RequestParam(defaultValue="") @Size(max=150) String q,
            @RequestParam(defaultValue="false") boolean attention,
            @RequestParam(defaultValue="all") String stage){
        if(!status.isEmpty()&&!STATUSES.contains(status))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Choose a valid request status.");
        if(!buyer.isEmpty()&&!Set.of("business","government","schools").contains(buyer))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Choose business, government or schools.");
        if(!Set.of("all","sourcing","approved","drafts").contains(stage))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Choose a valid request stage.");
        Instant now=deadlines.now();
        String needsAttention="(r.status in ('submitted','in_review') and (r.response_deadline<=? or r.admin_response_due_at<=? or exists(select 1 from rfq_delivery d where d.rfq_id=r.id and d.required_date<=?)))";
        String unfinishedDraft="exists(select 1 from rfq_pricing_work w where w.rfq_id=r.id and ((r.status in ('submitted','in_review') and w.sourcing_version>0) or (r.status in ('approved','quoted') and w.quote_draft is not null and not exists(select 1 from quotation qt where qt.rfq_id=r.id and qt.draft_version=w.quote_version and qt.approval_version=w.approval_version and qt.status in ('draft','issued')))))";
        String stageWhere=stage.equals("drafts")?" and "+unfinishedDraft:stage.equals("sourcing")?" and r.status in ('submitted','in_review')":stage.equals("approved")?" and r.status in ('approved','quoted')":"";
        String where=" from rfq r join customer c on c.id=r.customer_id where r.status<>'draft' and (?='' or r.status=?) and (?='' or r.buyer_type=?) and (?='' or strpos(lower(r.reference||' '||coalesce(c.organisation,'')||' '||c.contact_name),lower(?))>0) and (?=false or "+needsAttention+")";
        Object[] urgency={java.sql.Timestamp.from(deadlines.soon(now)),java.sql.Timestamp.from(deadlines.soon(now)),java.sql.Date.valueOf(deadlines.deliverySoon(now))};
        Object[] params={status,status,buyer,buyer,q.trim(),q.trim(),attention,urgency[0],urgency[1],urgency[2]};
        where+=stageWhere;
        long total=jdbc.queryForObject("select count(*)"+where,Long.class,params);
        var args=new ArrayList<>(Arrays.asList(params));args.add(size);args.add((long)page*size);
        var rows=jdbc.queryForList("select r.id,r.reference,r.buyer_type,r.status,r.submitted_at,r.response_deadline,r.admin_response_due_at,c.organisation,c.contact_name,(select min(required_date) from rfq_delivery d where d.rfq_id=r.id) as earliest_delivery_date,(select count(*) from rfq_item i where i.rfq_id=r.id) as item_count,(select count(*) from rfq_attachment a where a.rfq_id=r.id) as attachment_count"+where+" order by r.created_at desc,r.id desc limit ? offset ?",args.toArray());
        rows.forEach(row->{row.put("deadlineAlerts",deadlines.forRequest(row.get("status").toString(),DeadlineAlerts.instant(row.get("response_deadline")),DeadlineAlerts.instant(row.get("admin_response_due_at")),DeadlineAlerts.date(row.get("earliest_delivery_date")),now));dates(row);});
        var counts=new LinkedHashMap<String,Long>();STATUSES.forEach(s->counts.put(s,0L));
        for(var row:jdbc.queryForList("select status,count(*) as total from rfq where status<>'draft' group by status"))counts.put(row.get("status").toString(),((Number)row.get("total")).longValue());
        long attentionCount=jdbc.queryForObject("select count(*) from rfq r where "+needsAttention,Long.class,urgency);
        long savedDraftCount=jdbc.queryForObject("select count(*) from rfq r where "+unfinishedDraft,Long.class);
        return Map.of("savedDraftCount",savedDraftCount,"items",rows,"page",page,"size",size,"total",total,"counts",counts,"attentionCount",attentionCount);
    }
    @GetMapping("/api/admin/rfqs/{id}") @ResponseBody
    @Transactional(readOnly=true,isolation=org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    Map<String,Object> detail(@PathVariable @Min(1) long id){
        var rows=jdbc.queryForList("select id,reference,buyer_type,status,purchase_type,recurring_requested,procurement_reference,response_deadline,admin_response_due_at,alternatives_allowed,notes,submitted_at,submission_source,contact_snapshot from rfq where id=? and status<>'draft'",id);
        if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Request not found.");
        var request=rows.getFirst();
        var earliest=jdbc.queryForObject("select min(required_date) from rfq_delivery where rfq_id=?",java.sql.Date.class,id);
        request.put("deadlineAlerts",deadlines.forRequest(request.get("status").toString(),DeadlineAlerts.instant(request.get("response_deadline")),DeadlineAlerts.instant(request.get("admin_response_due_at")),DeadlineAlerts.date(earliest),deadlines.now()));
        request.put("buyer",json(request.remove("contact_snapshot")));dates(request);
        var opportunity=dbOpportunity(id);if(!opportunity.isEmpty())request.put("opportunity",opportunity.getFirst());
        request.put("items",jdbc.queryForList("select i.id,i.description,i.quantity,i.ordering_unit,i.product_id as catalogue_product_id,p.legacy_id as product_id,p.name as product_name,nullif(btrim((r.requirement_snapshot->'items'->i.display_order)->>'requestedBrand'),'') as requested_brand from rfq_item i join rfq r on r.id=i.rfq_id left join product p on p.id=i.product_id where i.rfq_id=? order by display_order,i.id",id));
        var deliveries=jdbc.queryForList("select street,building,suburb,city,province,postal_code,contact_name,phone,required_date,date_flexibility,address_complete,instructions from rfq_delivery where rfq_id=? order by id",id);deliveries.forEach(this::dates);request.put("deliveries",deliveries);
        request.put("attachments",jdbc.queryForList("select original_filename,content_type,size_bytes,scan_status,created_at from rfq_attachment where rfq_id=? order by id",id));
        request.put("activity",jdbc.queryForList("select actor_username,previous_status,new_status,created_at from rfq_activity where rfq_id=? order by id",id));
        var internalNotes=jdbc.queryForList("select id,author_username,body,created_at from rfq_internal_note where rfq_id=? order by id desc",id);internalNotes.forEach(this::dates);request.put("internalNotes",internalNotes);
        var targetHistory=jdbc.queryForList("select actor_username,previous_due_at,new_due_at,created_at from rfq_response_target_change where rfq_id=? order by id desc",id);targetHistory.forEach(this::dates);request.put("responseTargetHistory",targetHistory);
        return request;
    }
    private List<Map<String,Object>> dbOpportunity(long id){return jdbc.queryForList("select id,reference from work_opportunity where rfq_id=?",id);}
    public record InternalNote(@NotNull UUID submissionKey,@NotBlank @Size(max=4000) String body) {}
    @PostMapping("/api/admin/rfqs/{id}/notes") @ResponseBody
    @Transactional
    ResponseEntity<?> note(@PathVariable @Min(1) long id,@Valid @RequestBody InternalNote note,Principal principal){
        lockRequest(id);
        var existing=jdbc.queryForList("select id,author_username,body from rfq_internal_note where rfq_id=? and submission_key=?",id,note.submissionKey());
        if(!existing.isEmpty()){
            var row=existing.getFirst();
            if(!row.get("body").equals(note.body().trim())||!row.get("author_username").equals(principal.getName()))throw new ResponseStatusException(HttpStatus.CONFLICT,"This note has changed. Submit it with a new request key.");
            return ResponseEntity.ok(Map.of("id",row.get("id")));
        }
        long noteId=jdbc.queryForObject("insert into rfq_internal_note(rfq_id,author_username,body,submission_key) values (?,?,?,?) returning id",Long.class,id,principal.getName(),note.body().trim(),note.submissionKey());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id",noteId));
    }
    public record ResponseTarget(OffsetDateTime dueAt) {}
    @PostMapping("/api/admin/rfqs/{id}/response-target") @ResponseBody
    @Transactional
    Map<String,Object> target(@PathVariable @Min(1) long id,@Valid @RequestBody ResponseTarget target,Principal principal){
        lockRequest(id);
        var current=jdbc.queryForObject("select admin_response_due_at from rfq where id=?",java.sql.Timestamp.class,id);
        Instant due=target.dueAt()==null?null:target.dueAt().toInstant().truncatedTo(java.time.temporal.ChronoUnit.MICROS);
        String status=jdbc.queryForObject("select status from rfq where id=?",String.class,id);
        if(due!=null&&!Set.of("submitted","in_review").contains(status))throw new ResponseStatusException(HttpStatus.CONFLICT,"Set response targets only for new or reviewing requests.");
        if(!Objects.equals(DeadlineAlerts.instant(current),due)){
            jdbc.update("update rfq set admin_response_due_at=? where id=?",due==null?null:java.sql.Timestamp.from(due),id);
            jdbc.update("insert into rfq_response_target_change(rfq_id,actor_username,previous_due_at,new_due_at) values (?,?,?,?)",id,principal.getName(),current,due==null?null:java.sql.Timestamp.from(due));
        }
        return Map.of("saved",true);
    }
    private void lockRequest(long id){
        var rows=jdbc.queryForList("select id from rfq where id=? and status<>'draft' for update",id);
        if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Request not found.");
    }
    @PostMapping("/api/admin/rfqs/{id}/review") @ResponseBody
    @Transactional
    Map<String,Object> reviewing(@PathVariable @Min(1) long id,Principal principal){
        var rows=jdbc.queryForList("select status from rfq where id=? for update",id);
        if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Request not found.");
        String status=rows.getFirst().get("status").toString();
        if(status.equals("in_review"))return Map.of("status",status);
        if(!status.equals("submitted"))throw new ResponseStatusException(HttpStatus.CONFLICT,"Only new requests can be marked as reviewing.");
        jdbc.update("update rfq set status='in_review' where id=?",id);
        jdbc.update("insert into rfq_activity(rfq_id,actor_username,previous_status,new_status) values (?,?,'submitted','in_review')",id,principal.getName());
        return Map.of("status","in_review");
    }
}
