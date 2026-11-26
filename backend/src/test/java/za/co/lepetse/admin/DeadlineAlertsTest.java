package za.co.lepetse.admin;

import java.time.*;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class DeadlineAlertsTest {
    private final Instant now=Instant.parse("2026-11-18T22:30:00Z"); // 00:30 on 19 November in South Africa.
    private final DeadlineAlerts alerts=new DeadlineAlerts(Clock.fixed(now,ZoneOffset.UTC));
    @Test void deadlineBoundaryIsExactlyFortyEightHoursAndPastTargetsAreOverdue(){
        var result=alerts.forRequest("in_review",now.plus(Duration.ofHours(48)),now.minusSeconds(1),null,now);
        assertThat(result).extracting(DeadlineAlerts.Alert::type).containsExactly("response","closing");
        assertThat(result).extracting(DeadlineAlerts.Alert::severity).containsExactly("overdue","soon");
        assertThat(alerts.forRequest("submitted",now.plus(Duration.ofHours(48)).plusSeconds(1),null,null,now)).isEmpty();
    }
    @Test void requestedDeliveryUsesSouthAfricanCalendarDates(){
        assertThat(alerts.deliverySoon(now)).isEqualTo(LocalDate.of(2026,11,21));
        assertThat(alerts.forRequest("submitted",null,null,LocalDate.of(2026,11,18),now).getFirst().severity()).isEqualTo("overdue");
        assertThat(alerts.forRequest("submitted",null,null,LocalDate.of(2026,11,21),now).getFirst().severity()).isEqualTo("soon");
        assertThat(alerts.forRequest("submitted",null,null,LocalDate.of(2026,11,22),now)).isEmpty();
    }
    @Test void finishedRequestsAndMissingDatesDoNotProduceAlerts(){
        for(String status:new String[]{"quoted","closed","cancelled","draft"})assertThat(alerts.forRequest(status,now.minusSeconds(1),now.minusSeconds(1),LocalDate.of(2026,11,18),now)).isEmpty();
        assertThat(alerts.forRequest("submitted",null,null,null,now)).isEmpty();
    }
}
