package za.co.lepetse.admin;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.time.*;

@RestController @RequestMapping("/api/admin/opportunity-searches")
public class AdminOpportunitySearches {
 private final JdbcTemplate db;private final OpportunityDiscovery discovery;
 public AdminOpportunitySearches(JdbcTemplate db,OpportunityDiscovery discovery){this.db=db;this.discovery=discovery;}
 @GetMapping List<Map<String,Object>> list(){var rows=db.queryForList("select * from opportunity_search where not archived order by id");rows.forEach(r->{r.replaceAll((k,v)->v instanceof java.sql.Timestamp t?t.toInstant().toString():v instanceof java.sql.Time t?t.toString():v);if(r.get("running_until")!=null&&Instant.parse(r.get("running_until").toString()).isBefore(Instant.now())&&r.get("last_status").equals("running")){r.put("last_status","interrupted");r.put("last_message","Previous search was interrupted. Try Fetch now again.");}});return rows;}
 public record Settings(@NotBlank @Size(max=2000) String keywords,@NotNull @Size(max=2000) String exclusions,@NotNull @Size(max=4000) String criteria,boolean dailyEnabled,@Pattern(regexp="(?:[01][0-9]|2[0-3]):[0-5][0-9]") @NotNull String runTime,@Min(1) int version) {}
 @RequestMapping(value="/{id}",method={RequestMethod.PUT,RequestMethod.POST}) Map<String,Object> settings(@PathVariable long id,@Valid @RequestBody Settings s){
  if(Arrays.stream(s.keywords().split(",")).noneMatch(t->!t.isBlank()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Add at least one search term.");
  int changed=db.update("update opportunity_search set keywords=?,exclusions=?,criteria=?,daily_enabled=?,run_time=?::time,next_run_at=?,version=version+1 where id=? and version=? and not archived and (running_until is null or running_until<now())",s.keywords(),s.exclusions(),s.criteria(),s.dailyEnabled(),s.runTime(),java.sql.Timestamp.from(OpportunityDiscovery.nextRun(s.runTime()+":00")),id,s.version());
  if(changed==0)throw new ResponseStatusException(HttpStatus.CONFLICT,"The search changed or is running. Reload before editing.");return Map.of("saved",true);
 }
 @PostMapping("/{id}/fetch") Map<String,Object> fetch(@PathVariable long id){discovery.start(id);return Map.of("started",true);}
}
