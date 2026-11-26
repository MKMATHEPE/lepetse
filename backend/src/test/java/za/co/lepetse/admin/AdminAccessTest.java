package za.co.lepetse.admin;

import java.util.UUID;
import java.time.*;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@EnabledIfEnvironmentVariable(named="LEPETSE_DB_TEST",matches="true")
class AdminAccessTest {
    @Autowired MockMvc http;
    @Autowired JdbcTemplate jdbc;
    @Autowired PasswordEncoder encoder;
    @Autowired ObjectMapper mapper;
    long request(String suffix,String buyer,String status){
        long customer=jdbc.queryForObject("insert into customer(organisation,contact_name,email,phone) values ('Admin test organisation','Private test buyer','buyer@example.invalid','000') returning id",Long.class);
        long id=jdbc.queryForObject("insert into rfq(reference,customer_id,buyer_type,purchase_type,status,contact_snapshot,submitted_at) values (?,?,?,'once_off',?,'{\"organisation\":\"Admin test organisation\",\"contact\":\"Private test buyer\"}',now()) returning id",Long.class,"ADMIN-TEST-"+suffix,customer,buyer,status);
        jdbc.update("insert into rfq_item(rfq_id,description,quantity,ordering_unit) values (?,'Test stationery',4,'Each')",id);
        return id;
    }
    @Test void anonymousUsersCannotReadRequestsOrAdminPages() throws Exception {
        long id=request("PRIVATE","business","submitted");
        http.perform(get("/api/admin/rfqs")).andExpect(status().isUnauthorized()).andExpect(content().string(not(containsString("Private test buyer"))));
        http.perform(get("/api/admin/rfqs/"+id)).andExpect(status().isUnauthorized());
        http.perform(get("/admin/index.html")).andExpect(status().is3xxRedirection()).andExpect(redirectedUrlPattern("**/admin/login.html"));
        http.perform(get("/admin/login.html")).andExpect(status().isOk());
        http.perform(get("/api/admin/session")).andExpect(status().isOk()).andExpect(jsonPath("$.authenticated").value(false)).andExpect(header().string("Cache-Control",containsString("no-store")));
    }
    @Test void realPasswordLoginCreatesSessionAndLogoutInvalidatesIt() throws Exception {
        String username="owner-"+UUID.randomUUID();String password=UUID.randomUUID().toString();
        jdbc.update("insert into admin_user(username,password_hash) values (?,?)",username,encoder.encode(password));
        http.perform(post("/admin/login").with(csrf()).param("username",username).param("password","incorrect"))
                .andExpect(unauthenticated()).andExpect(redirectedUrl("/admin/login.html?error"));
        var result=http.perform(post("/admin/login").with(csrf()).param("username",username).param("password",password))
                .andExpect(authenticated().withUsername(username)).andExpect(redirectedUrl("/admin/index.html")).andReturn();
        var session=(MockHttpSession)result.getRequest().getSession(false);
        http.perform(get("/api/admin/rfqs").session(session)).andExpect(status().isOk()).andExpect(header().string("Cache-Control",containsString("no-store")));
        http.perform(post("/admin/logout").session(session).with(csrf())).andExpect(redirectedUrl("/admin/login.html?logout")).andExpect(unauthenticated());
        assertThat(session.isInvalid()).isTrue();
        http.perform(get("/api/admin/rfqs")).andExpect(status().isUnauthorized());
    }
    @Test void inboxFiltersAndDetailExcludeInternalStorageKeys() throws Exception {
        long id=request("GOV","government","submitted");request("BUSINESS","business","in_review");
        jdbc.update("insert into rfq_attachment(rfq_id,original_filename,storage_key,content_type,size_bytes) values (?,'test.pdf','INTERNAL-PRIVATE-KEY','application/pdf',100)",id);
        http.perform(get("/api/admin/rfqs").with(user("owner").roles("ADMIN")).param("q","ADMIN-TEST").param("buyer","government").param("status","submitted").param("size","1"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1)).andExpect(jsonPath("$.items[0].reference").value("ADMIN-TEST-GOV"));
        http.perform(get("/api/admin/rfqs/"+id).with(user("owner").roles("ADMIN")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.buyer.contact").value("Private test buyer")).andExpect(jsonPath("$.items[0].quantity").value(4)).andExpect(jsonPath("$.attachments[0].scan_status").value("pending"))
                .andExpect(content().string(not(containsString("INTERNAL-PRIVATE-KEY"))));
        http.perform(get("/api/admin/rfqs").with(user("viewer").roles("USER"))).andExpect(status().isForbidden());
    }
    @Test void reviewingRequiresCsrfAndRecordsOneStaffAction() throws Exception {
        long id=request("REVIEW","business","submitted");
        http.perform(post("/api/admin/rfqs/"+id+"/review").with(user("owner").roles("ADMIN"))).andExpect(status().isForbidden());
        assertThat(jdbc.queryForObject("select status from rfq where id=?",String.class,id)).isEqualTo("submitted");
        for(int i=0;i<2;i++)http.perform(post("/api/admin/rfqs/"+id+"/review").with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("in_review"));
        assertThat(jdbc.queryForObject("select count(*) from rfq_activity where rfq_id=?",Integer.class,id)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select actor_username from rfq_activity where rfq_id=?",String.class,id)).isEqualTo("owner");
        jdbc.update("update rfq set status='closed' where id=?",id);
        http.perform(post("/api/admin/rfqs/"+id+"/review").with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isConflict());
    }
    @Test void disabledAccountAndMissingLoginCsrfAreRejected() throws Exception {
        String username="disabled-"+UUID.randomUUID();String password=UUID.randomUUID().toString();
        jdbc.update("insert into admin_user(username,password_hash,enabled) values (?,?,false)",username,encoder.encode(password));
        http.perform(post("/admin/login").with(csrf()).param("username",username).param("password",password)).andExpect(unauthenticated()).andExpect(redirectedUrl("/admin/login.html?error"));
        http.perform(post("/admin/login").param("username",username).param("password",password)).andExpect(status().isForbidden());
    }
    @Test void notesRemainPrivateAndRetriesDoNotDuplicateThem() throws Exception {
        long id=request("NOTE","business","submitted");String key=UUID.randomUUID().toString();
        String body=mapper.writeValueAsString(Map.of("submissionKey",key,"body","Private supplier check — staff only","author_username","forged"));
        http.perform(post("/api/admin/rfqs/"+id+"/notes").contentType("application/json").content(body).with(csrf())).andExpect(status().isUnauthorized());
        http.perform(post("/api/admin/rfqs/"+id+"/notes").with(user("owner").roles("ADMIN")).contentType("application/json").content(body)).andExpect(status().isForbidden());
        http.perform(post("/api/admin/rfqs/"+id+"/notes").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(body)).andExpect(status().isCreated());
        http.perform(post("/api/admin/rfqs/"+id+"/notes").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(body)).andExpect(status().isOk());
        assertThat(jdbc.queryForObject("select count(*) from rfq_internal_note where rfq_id=?",Integer.class,id)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select author_username from rfq_internal_note where rfq_id=?",String.class,id)).isEqualTo("owner");
        http.perform(get("/api/admin/rfqs/"+id).with(user("owner").roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.internalNotes[0].body").value("Private supplier check — staff only"));
        http.perform(get("/api/site-data")).andExpect(status().isOk()).andExpect(content().string(not(containsString("Private supplier check"))));
        http.perform(post("/api/admin/rfqs/"+id+"/notes").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(mapper.writeValueAsString(Map.of("submissionKey",key,"body","Different text")))).andExpect(status().isConflict());
    }
    @Test void invalidNotesCannotBeSaved() throws Exception {
        long id=request("INVALID-NOTE","business","submitted");
        for(String text:new String[]{"   ","x".repeat(4001)})http.perform(post("/api/admin/rfqs/"+id+"/notes").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(mapper.writeValueAsString(Map.of("submissionKey",UUID.randomUUID().toString(),"body",text)))).andExpect(status().isBadRequest());
        assertThat(jdbc.queryForObject("select count(*) from rfq_internal_note where rfq_id=?",Integer.class,id)).isZero();
    }
    @Test void responseTargetsAreAuditedAndAttentionFilterUsesThem() throws Exception {
        long id=request("TARGET","business","submitted");
        Instant due=Instant.now().minusSeconds(60).truncatedTo(java.time.temporal.ChronoUnit.MICROS);
        String body=mapper.writeValueAsString(Map.of("dueAt",due.toString()));
        http.perform(post("/api/admin/rfqs/"+id+"/response-target").with(user("owner").roles("ADMIN")).contentType("application/json").content(body)).andExpect(status().isForbidden());
        for(int i=0;i<2;i++)http.perform(post("/api/admin/rfqs/"+id+"/response-target").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(body)).andExpect(status().isOk());
        assertThat(jdbc.queryForObject("select count(*) from rfq_response_target_change where rfq_id=?",Integer.class,id)).isEqualTo(1);
        http.perform(get("/api/admin/rfqs").with(user("owner").roles("ADMIN")).param("q","ADMIN-TEST-TARGET").param("attention","true")).andExpect(status().isOk()).andExpect(jsonPath("$.total").value(1)).andExpect(jsonPath("$.items[0].deadlineAlerts[0].type").value("response")).andExpect(jsonPath("$.items[0].deadlineAlerts[0].severity").value("overdue"));
        http.perform(post("/api/admin/rfqs/"+id+"/response-target").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content("{\"dueAt\":null}")).andExpect(status().isOk());
        http.perform(get("/api/admin/rfqs").with(user("owner").roles("ADMIN")).param("q","ADMIN-TEST-TARGET").param("attention","true")).andExpect(status().isOk()).andExpect(jsonPath("$.total").value(0));
        assertThat(jdbc.queryForObject("select count(*) from rfq_response_target_change where rfq_id=?",Integer.class,id)).isEqualTo(2);
    }
    @Test void formalClosingAlertsDoNotContinueAfterRequestIsQuoted() throws Exception {
        long id=request("CLOSING","government","submitted");
        jdbc.update("update rfq set response_deadline=? where id=?",java.sql.Timestamp.from(Instant.now().plusSeconds(3600)),id);
        http.perform(get("/api/admin/rfqs/"+id).with(user("owner").roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.deadlineAlerts[0].type").value("closing"));
        jdbc.update("update rfq set status='quoted' where id=?",id);
        http.perform(get("/api/admin/rfqs/"+id).with(user("owner").roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.deadlineAlerts").isEmpty());
        http.perform(post("/api/admin/rfqs/"+id+"/response-target").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content("{\"dueAt\":\"2027-01-01T12:00:00+02:00\"}")).andExpect(status().isConflict());
    }
    @Test void savedViewsPersistOnlyForTheirOwnerAndKeepNewViewMeaningful() throws Exception {
        String first="views-"+UUID.randomUUID(),second="views-"+UUID.randomUUID();
        for(String username:new String[]{first,second})jdbc.update("insert into admin_user(username,password_hash) values (?,?)",username,encoder.encode(UUID.randomUUID().toString()));
        String body=mapper.writeValueAsString(Map.of("activeView","new","views",Map.of("new",Map.of("q","PRIVATE-FILTER-MARKER","buyer","business","status","closed"))));
        http.perform(get("/api/admin/workspace")).andExpect(status().isUnauthorized());
        http.perform(post("/api/admin/workspace").with(user(first).roles("ADMIN")).contentType("application/json").content(body)).andExpect(status().isForbidden());
        http.perform(post("/api/admin/workspace").with(user(first).roles("ADMIN")).with(csrf()).contentType("application/json").content(body)).andExpect(status().isOk());
        http.perform(get("/api/admin/workspace").with(user(first).roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.activeView").value("new")).andExpect(jsonPath("$.views.new.q").value("PRIVATE-FILTER-MARKER")).andExpect(jsonPath("$.views.new.status").value("submitted"));
        http.perform(get("/api/admin/workspace").with(user(second).roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.activeView").value("all")).andExpect(content().string(not(containsString("PRIVATE-FILTER-MARKER"))));
        http.perform(get("/api/site-data")).andExpect(status().isOk()).andExpect(content().string(not(containsString("PRIVATE-FILTER-MARKER"))));
    }
    @Test void malformedSavedViewFiltersAreRejected() throws Exception {
        String body=mapper.writeValueAsString(Map.of("activeView","all","views",Map.of("all",Map.of("q","x".repeat(151),"buyer","business","status",""))));
        http.perform(post("/api/admin/workspace").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(body)).andExpect(status().isBadRequest());
        http.perform(post("/api/admin/workspace").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content("{\"activeView\":\"unknown\",\"views\":{}}")).andExpect(status().isBadRequest());
    }
}
