package za.co.lepetse.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.security.Principal;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/workspace")
public class AdminWorkspaceController {
    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper;
    private static final List<String> VIEWS=List.of("all","new","reviewing","attention","approved");
    public AdminWorkspaceController(JdbcTemplate jdbc,ObjectMapper mapper){this.jdbc=jdbc;this.mapper=mapper;}
    public record ViewSetting(@NotNull @Size(max=150) String q,
            @NotNull @Pattern(regexp="|business|government|schools") String buyer,
            @NotNull @Pattern(regexp="|submitted|in_review|approved|quoted|closed|cancelled") String status) {}
    public record Preferences(@NotNull @Pattern(regexp="all|new|reviewing|attention|approved") String activeView,
            @NotNull @Size(max=5) Map<@Pattern(regexp="all|new|reviewing|attention|approved") String,@NotNull @Valid ViewSetting> views) {}
    private Preferences normalise(Preferences preferences){
        var views=new LinkedHashMap<String,ViewSetting>();
        for(String key:VIEWS){
            var v=preferences.views().getOrDefault(key,new ViewSetting("","",""));
            String status=key.equals("new")?"submitted":key.equals("reviewing")?"in_review":key.equals("attention")&&!Set.of("","submitted","in_review").contains(v.status())?"":v.status();
            views.put(key,new ViewSetting(v.q().trim(),v.buyer(),status));
        }
        return new Preferences(preferences.activeView(),views);
    }
    @GetMapping @Transactional(readOnly=true)
    public Preferences get(Principal principal){
        var rows=jdbc.queryForList("select p.preferences from admin_workspace_preference p join admin_user u on u.id=p.admin_user_id where u.username=?",principal.getName());
        if(rows.isEmpty())return normalise(new Preferences("all",Map.of()));
        try{return normalise(mapper.readValue(rows.getFirst().get("preferences").toString(),Preferences.class));}
        catch(Exception e){throw new IllegalStateException("Invalid saved workspace settings",e);}
    }
    @PostMapping @Transactional
    public Map<String,Boolean> save(@Valid @RequestBody Preferences preferences,Principal principal){
        final String json;
        try{json=mapper.writeValueAsString(normalise(preferences));}catch(Exception e){throw new IllegalStateException(e);}
        int count=jdbc.update("insert into admin_workspace_preference(admin_user_id,preferences) select id,?::jsonb from admin_user where username=? and enabled on conflict(admin_user_id) do update set preferences=excluded.preferences,updated_at=now()",json,principal.getName());
        if(count==0)throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Your admin account is unavailable.");
        return Map.of("saved",true);
    }
}
