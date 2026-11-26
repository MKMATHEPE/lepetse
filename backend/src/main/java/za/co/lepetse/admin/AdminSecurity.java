package za.co.lepetse.admin;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.*;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class AdminSecurity {
    @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder(12);}
    @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
        var throttle=new LoginThrottle();
        var redirect=new LoginUrlAuthenticationEntryPoint("/admin/login.html");
        return http
            .authorizeHttpRequests(a->a
                .requestMatchers(HttpMethod.GET,"/admin/login.html","/admin/assets/**","/api/admin/session").permitAll()
                .requestMatchers("/admin/login","/admin/logout").permitAll()
                .requestMatchers("/admin/**","/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/**").permitAll()
                .requestMatchers(HttpMethod.HEAD,"/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/api/rfqs").permitAll()
                .anyRequest().denyAll())
            // Anonymous public RFQ intake only; all admin mutations retain CSRF protection.
            .csrf(c->c.ignoringRequestMatchers(new AntPathRequestMatcher("/api/rfqs","POST")))
            .formLogin(f->f.loginPage("/admin/login.html").loginProcessingUrl("/admin/login")
                .successHandler((request,response,authentication)->{throttle.clear(request.getRemoteAddr());response.sendRedirect("/admin/index.html");})
                .failureHandler((request,response,error)->response.sendRedirect("/admin/login.html?error")))
            .logout(l->l.logoutUrl("/admin/logout").logoutSuccessUrl("/admin/login.html?logout").invalidateHttpSession(true).deleteCookies("JSESSIONID"))
            .exceptionHandling(e->e.authenticationEntryPoint((request,response,error)->{
                if(request.getRequestURI().startsWith("/api/admin/"))response.sendError(401);
                else redirect.commence(request,response,error);
            }))
            .requestCache(c->c.disable())
            .addFilterBefore(throttle,UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(new PrivateResponses(),org.springframework.security.web.context.SecurityContextHolderFilter.class)
            .build();
    }
    static class PrivateResponses extends OncePerRequestFilter {
        @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
            if(request.getRequestURI().startsWith("/admin")||request.getRequestURI().startsWith("/api/admin")){
                response.setHeader("Cache-Control","no-store");
                response.setHeader("Referrer-Policy","no-referrer");
                response.setHeader("Content-Security-Policy","default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
            }
            chain.doFilter(request,response);
        }
    }
    static class LoginThrottle extends OncePerRequestFilter {
        record Window(long started,int count) {}
        private final ConcurrentHashMap<String,Window> attempts=new ConcurrentHashMap<>();
        void clear(String ip){attempts.remove(ip);}
        @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
            if(request.getMethod().equals("POST")&&request.getRequestURI().equals("/admin/login")){
                long now=Instant.now().getEpochSecond();
                if(attempts.size()>=1000)attempts.entrySet().removeIf(e->now-e.getValue().started()>900);
                String ip=request.getRemoteAddr();
                if(attempts.size()>=1000&&!attempts.containsKey(ip)){response.sendError(429);return;}
                var window=attempts.compute(ip,(k,v)->v==null||now-v.started()>900?new Window(now,1):new Window(v.started(),v.count()+1));
                if(window.count()>10){response.setHeader("Retry-After","900");response.sendRedirect("/admin/login.html?limited");return;}
            }
            chain.doFilter(request,response);
        }
    }
}
