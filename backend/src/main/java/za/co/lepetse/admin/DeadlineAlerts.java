package za.co.lepetse.admin;

import java.time.*;
import java.util.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
public class DeadlineAlerts {
    public static final ZoneId SOUTH_AFRICA=ZoneId.of("Africa/Johannesburg");
    private final Clock clock;
    public DeadlineAlerts(Clock clock){this.clock=clock;}
    public record Alert(String type,String label,String severity,Instant dueAt) {}
    Instant now(){return clock.instant();}
    Instant soon(Instant now){return now.plus(Duration.ofHours(48));}
    LocalDate deliverySoon(Instant now){return now.atZone(SOUTH_AFRICA).toLocalDate().plusDays(2);}
    public List<Alert> forRequest(String status,Instant closing,Instant response,LocalDate delivery,Instant now){
        if(!Set.of("submitted","in_review").contains(status))return List.of();
        var alerts=new ArrayList<Alert>();
        addTimed(alerts,"response",response,now,"Response overdue","Response due within 48 hours");
        addTimed(alerts,"closing",closing,now,"RFQ closing date passed","RFQ closes within 48 hours");
        if(delivery!=null&&!delivery.isAfter(deliverySoon(now))){
            boolean passed=delivery.isBefore(now.atZone(SOUTH_AFRICA).toLocalDate());
            alerts.add(new Alert("delivery",passed?"Requested delivery date passed":"Delivery requested within 2 days",passed?"overdue":"soon",delivery.atTime(23,59,59).atZone(SOUTH_AFRICA).toInstant()));
        }
        return List.copyOf(alerts);
    }
    private void addTimed(List<Alert> alerts,String type,Instant due,Instant now,String overdue,String soon){
        if(due!=null&&!due.isAfter(soon(now)))alerts.add(new Alert(type,!due.isAfter(now)?overdue:soon,!due.isAfter(now)?"overdue":"soon",due));
    }
    static Instant instant(Object value){return value==null?null:value instanceof java.sql.Timestamp t?t.toInstant():value instanceof OffsetDateTime d?d.toInstant():(Instant)value;}
    static LocalDate date(Object value){return value==null?null:value instanceof java.sql.Date d?d.toLocalDate():(LocalDate)value;}
}
@Configuration
class AdminTimeConfiguration {
    @Bean Clock adminClock(){return Clock.systemUTC();}
}
