package za.co.lepetse.admin;
import com.fasterxml.jackson.databind.*;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.regex.Pattern;

@Service
public class OpportunityDiscovery {
 private final JdbcTemplate db;private final ObjectMapper mapper;private final TreasuryTenderFeed feed;private final TransactionTemplate tx;
 private final ExecutorService worker=Executors.newFixedThreadPool(2);
 private static final ZoneId SAST=ZoneId.of("Africa/Johannesburg");
 public OpportunityDiscovery(JdbcTemplate db,ObjectMapper mapper,TreasuryTenderFeed feed,PlatformTransactionManager tm){this.db=db;this.mapper=mapper;this.feed=feed;this.tx=new TransactionTemplate(tm);}
 @PreDestroy void close(){worker.shutdownNow();}
 @Scheduled(fixedDelay=60000,initialDelay=60000) public void scheduled(){for(var r:db.queryForList("select id from opportunity_search where not archived and daily_enabled and next_run_at<=now() and (running_until is null or running_until<now()) order by id")){try{start(((Number)r.get("id")).longValue());}catch(ResponseStatusException ignored){}}}
 public void start(long id){
  int claimed=db.update("update opportunity_search set running_until=now()+interval '20 minutes',last_started_at=now(),last_status='running',last_message='Fetching official tender notices…' where id=? and not archived and (running_until is null or running_until<now())",id);
  if(claimed==0)throw new ResponseStatusException(HttpStatus.CONFLICT,"This search is already running, or no longer exists.");
  worker.submit(()->run(id));
 }
 private void run(long id){
  var profile=db.queryForMap("select * from opportunity_search where id=?",id);int added=0,updated=0,missing=0,matched=0;
  try{
   LocalDate today=LocalDate.now(SAST),from=today.minusDays(14);if(profile.get("last_success_at") instanceof java.sql.Timestamp last)from=last.toInstant().atZone(SAST).toLocalDate().minusDays(2).isBefore(from)?from:last.toInstant().atZone(SAST).toLocalDate().minusDays(2);
   var batch=feed.fetch(from,today.plusDays(1));
   // Apply oldest first so subsequent revisions win without resetting human decisions.
   var releases=new ArrayList<>(batch.releases());releases.sort(Comparator.comparing(r->r.path("date").asText()));
   for(JsonNode r:releases){int result=ingest(id,profile,r);if(result==1)added++;if(result==2)updated++;if(result>0)matched++;if(result==-1)missing++;}
   String message=added+" new · "+updated+" updated · "+missing+" notices missing essential fields. Checked "+releases.size()+" releases. Eligibility and PDF requirements need review.";
   finish(id,batch.complete()?"success":"partial",message+(batch.complete()?"":" Treasury returned an incomplete scan or the safety limit was reached. Retry Fetch now; coverage is incomplete."),batch.complete());
  }catch(Exception e){org.slf4j.LoggerFactory.getLogger(OpportunityDiscovery.class).warn("Treasury discovery failed: {}",e.toString());finish(id,"failed","Could not complete the Treasury search. Any notices already saved are retained. Try Fetch now again.",false);}
 }
 private void finish(long id,String status,String message,boolean success){db.update("update opportunity_search set running_until=null,last_status=?,last_message=?,last_finished_at=now(),last_success_at=case when ? then now() else last_success_at end,next_run_at=? where id=?",status,message,success,java.sql.Timestamp.from(nextRun(db.queryForObject("select run_time::text from opportunity_search where id=?",String.class,id))),id);}
 static Instant nextRun(String time){var now=ZonedDateTime.now(SAST);var next=now.toLocalDate().atTime(LocalTime.parse(time)).atZone(SAST);return (next.isAfter(now)?next:next.plusDays(1)).toInstant();}
 static boolean terms(String haystack,String csv){return Arrays.stream(csv.split(",")).map(String::trim).filter(s->!s.isEmpty()).anyMatch(s->Pattern.compile("(?<![\\p{L}\\p{N}])"+Pattern.quote(s)+"(?![\\p{L}\\p{N}])",Pattern.CASE_INSENSITIVE).matcher(haystack).find());}
 private String encoded(Object o){try{return mapper.writeValueAsString(o);}catch(Exception e){throw new IllegalStateException(e);}}
 private Map<String,Object> decoded(Object o){try{return mapper.readValue(o.toString(),new com.fasterxml.jackson.core.type.TypeReference<LinkedHashMap<String,Object>>(){});}catch(Exception e){throw new IllegalStateException(e);}}
 int ingest(long search,Map<String,Object> profile,JsonNode release){
  String ocid=release.path("ocid").asText(),buyer=release.path("buyer").path("name").asText(),reference=release.path("tender").path("title").asText();JsonNode t=release.path("tender");
  String description=t.path("description").asText(),text=reference+" "+description;
  if(!ocid.matches("[A-Za-z0-9._-]{1,200}"))return 0;
  boolean matches=terms(text,profile.get("keywords").toString())&&!terms(text,profile.get("exclusions").toString());
  var known=db.queryForList("select opportunity_id,source_date from opportunity_discovery_source where ocid=?",ocid);
  if(!matches&&known.isEmpty())return 0;
  OffsetDateTime closing;try{closing=OffsetDateTime.parse(t.path("tenderPeriod").path("endDate").asText());}catch(Exception e){return matches?-1:0;}
  boolean ended=Set.of("cancelled","complete","unsuccessful","withdrawn").contains(t.path("status").asText().toLowerCase(Locale.ROOT))||!closing.toInstant().isAfter(Instant.now());
  if(known.isEmpty()&&ended)return 0;
  if(buyer.isBlank()||reference.isBlank())return -1;
  String source=TreasuryTenderFeed.BASE+"/release/"+ocid;
  var docs=new LinkedHashSet<String>();for(var doc:t.path("documents")){String url=doc.path("url").asText();if(url.matches("https?://[^\\s]+"))docs.add(url);}
  String documents=String.join("\n",docs);if(documents.length()>8000)documents=documents.substring(0,documents.lastIndexOf('\n',8000)>0?documents.lastIndexOf('\n',8000):0);
  var sourceFields=new LinkedHashMap<String,Object>();sourceFields.put("title",description.isBlank()?reference:description.substring(0,Math.min(200,description.length())));sourceFields.put("scope",description.substring(0,Math.min(8000,description.length())));sourceFields.put("closing",closing.toString());sourceFields.put("documents",documents);sourceFields.put("source",source);sourceFields.put("status",t.path("status").asText());
  String fingerprint=encoded(sourceFields);Instant published;try{published=OffsetDateTime.parse(release.path("date").asText()).toInstant();}catch(Exception e){published=Instant.EPOCH;}final Instant sourceDate=published;
  return tx.execute(status->{
   db.queryForList("select pg_advisory_xact_lock(hashtextextended(?,0))","opportunity-discovery");
   var existing=db.queryForList("select s.*,o.details,o.version from opportunity_discovery_source s join work_opportunity o on o.id=s.opportunity_id where s.ocid=? for update of s,o",ocid);
   long opportunity;int result=0;
   if(existing.isEmpty()){
    var duplicates=db.queryForList("select id from work_opportunity where lower(btrim(buyer))=lower(btrim(?)) and lower(btrim(reference))=lower(btrim(?)) for update",buyer,reference);
    if(!duplicates.isEmpty()){opportunity=((Number)duplicates.getFirst().get("id")).longValue();}
    else{
     var d=new LinkedHashMap<>(sourceFields);d.remove("status");d.put("buyer",buyer);d.put("reference",reference);d.put("recommendation","possible");d.put("buyerType","government");d.put("rationale","Keyword match for "+profile.get("name")+". Not an eligibility assessment.");d.put("requirements","Not verified. Review the official tender documents.\nSearch criteria: "+profile.get("criteria"));for(String key:List.of("briefing","submission","contact","email","phone","instructions"))d.put(key,"");
     opportunity=db.queryForObject("insert into work_opportunity(buyer,reference,details) values (?,?,?::jsonb) returning id",Long.class,buyer,reference,encoded(d));result=1;
    }
    db.update("insert into opportunity_discovery_source(ocid,opportunity_id,source_date,fingerprint) values (?,?,?,?)",ocid,opportunity,java.sql.Timestamp.from(sourceDate),fingerprint);
   }else{
    var old=existing.getFirst();opportunity=((Number)old.get("opportunity_id")).longValue();var previousDate=(java.sql.Timestamp)old.get("source_date");
    if(previousDate==null||!sourceDate.isBefore(previousDate.toInstant())){
     if(!fingerprint.equals(old.get("fingerprint"))){
      var d=decoded(old.get("details"));var previousSource=decoded(old.get("fingerprint"));boolean changedClosing=!Objects.equals(d.get("closing"),sourceFields.get("closing"));for(var field:sourceFields.entrySet())if(!Set.of("title","scope").contains(field.getKey())||Objects.equals(d.get(field.getKey()),previousSource.get(field.getKey())))d.put(field.getKey(),field.getValue());d.remove("status");
      db.update("update work_opportunity set details=?::jsonb,version=version+1,change_notice=?,updated_at=now() where id=?",encoded(d),ended?"Official notice ended or cancelled — review before continuing":changedClosing?"Closing deadline changed":"Official notice updated",opportunity);result=2;
     }
     db.update("update opportunity_discovery_source set source_date=?,fingerprint=?,last_checked_at=now() where ocid=?",java.sql.Timestamp.from(sourceDate),fingerprint,ocid);
    }
   }
   if(matches)db.update("insert into opportunity_search_match(search_id,opportunity_id) values (?,?) on conflict do nothing",search,opportunity);
   return result;
  });
 }
}
