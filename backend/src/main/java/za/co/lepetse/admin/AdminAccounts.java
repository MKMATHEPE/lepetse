package za.co.lepetse.admin;

import java.util.Locale;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Component;

@Component
public class AdminAccounts implements UserDetailsService, ApplicationRunner {
    private final JdbcTemplate jdbc;
    private final Environment environment;
    public AdminAccounts(JdbcTemplate jdbc,Environment environment){this.jdbc=jdbc;this.environment=environment;}
    @Override public UserDetails loadUserByUsername(String username){
        var rows=jdbc.queryForList("select username,password_hash,enabled from admin_user where username=?",username.trim().toLowerCase(Locale.ROOT));
        if(rows.isEmpty())throw new UsernameNotFoundException("Invalid sign-in");
        var user=rows.getFirst();
        return User.withUsername(user.get("username").toString()).password(user.get("password_hash").toString()).roles("ADMIN").disabled(!Boolean.TRUE.equals(user.get("enabled"))).build();
    }
    @Override public void run(ApplicationArguments args){
        String username=environment.getProperty("ADMIN_BOOTSTRAP_USERNAME","").trim().toLowerCase(Locale.ROOT);
        String hash=environment.getProperty("ADMIN_BOOTSTRAP_PASSWORD_HASH","");
        if(username.isEmpty()&&hash.isEmpty())return;
        if(username.isEmpty()||username.length()>150||!hash.matches("\\$2[aby]\\$(1[2-6])\\$[./A-Za-z0-9]{53}"))throw new IllegalStateException("Admin bootstrap needs a username and a BCrypt password hash with cost 12–16. No password was changed.");
        jdbc.update("insert into admin_user(username,password_hash) values (?,?) on conflict (username) do nothing",username,hash);
    }
}
