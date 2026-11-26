package za.co.lepetse.rfq;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties="lepetse.rfq.storage-directory=${java.io.tmpdir}/lepetse-rfq-integration-files")
@AutoConfigureMockMvc
@Transactional
@EnabledIfEnvironmentVariable(named="LEPETSE_DB_TEST",matches="true")
class RfqSubmissionTest {
    @Autowired MockMvc http;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper mapper;
    @MockitoSpyBean RfqFiles storage;
    Map<String,Object> request(String type){
        var buyer=new LinkedHashMap<String,Object>();
        buyer.put("organisation","Test organisation");buyer.put("contact","Test buyer");buyer.put("email","buyer@example.invalid");buyer.put("phone","0000000000");
        buyer.put("buyerType",type);buyer.put("purchaseType","once_off");buyer.put("alternatives","Please confirm with me");
        if(type.equals("government")){buyer.put("reference","TEST-RFQ");buyer.put("deadline",OffsetDateTime.now().plusDays(3).toString());buyer.put("channel","Reply using the stated procurement channel");}
        return new LinkedHashMap<>(Map.of("source","catalogue","buyer",buyer,"items",List.of(Map.of("productId","waltons-801215","description","A4 paper, 80 gsm","quantity",2,"unit","Ream of 500 sheets")),"deliveries",List.of(Map.of("street","1 Test Road","suburb","Test suburb","town","Pretoria","province","Gauteng","postcode","0002","contact","Test contact","phone","0000000000","requiredDate",LocalDate.now().plusDays(7).toString(),"flexibility","flexible"))));
    }
    MockMultipartFile body(Map<String,Object> request) throws Exception {return new MockMultipartFile("request","request.json","application/json",mapper.writeValueAsBytes(request));}
    @Test void businessSubmissionPersistsAllRowsAndRetryReturnsSameReference() throws Exception {
        var data=request("business");String key=UUID.randomUUID().toString();
        var response=http.perform(multipart("/api/rfqs").file(body(data)).header("Idempotency-Key",key)).andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("submitted")).andReturn();
        String reference=mapper.readTree(response.getResponse().getContentAsString()).get("reference").asText();
        assertThat(reference).startsWith("RFQ-");
        http.perform(multipart("/api/rfqs").file(body(data)).header("Idempotency-Key",key)).andExpect(status().isCreated()).andExpect(jsonPath("$.reference").value(reference));
        assertThat(jdbc.queryForObject("select count(*) from rfq where submission_key=?",Integer.class,UUID.fromString(key))).isEqualTo(1);
        assertThat(jdbc.queryForObject("select quantity from rfq_item i join rfq r on r.id=i.rfq_id where r.reference=?",Integer.class,reference)).isEqualTo(2);
        assertThat(jdbc.queryForObject("select city from rfq_delivery d join rfq r on r.id=d.rfq_id where r.reference=?",String.class,reference)).isEqualTo("Pretoria");
        data.put("items",List.of(Map.of("description","Changed requirement","quantity",3,"unit","Each")));
        http.perform(multipart("/api/rfqs").file(body(data)).header("Idempotency-Key",key)).andExpect(status().isConflict());
    }
    @Test void requestedBrandRemainsTheCustomerRequirement() throws Exception {
        var data=request("business");
        data.put("items",List.of(Map.of("productId","waltons-801215","description","A4 paper","quantity",2,"unit","Ream","requestedBrand","Client requested brand")));
        String key=UUID.randomUUID().toString();
        http.perform(multipart("/api/rfqs").file(body(data)).header("Idempotency-Key",key)).andExpect(status().isCreated());
        Long id=jdbc.queryForObject("select id from rfq where submission_key=?",Long.class,UUID.fromString(key));
        http.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/admin/rfqs/"+id).with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user("owner").roles("ADMIN")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.items[0].requested_brand").value("Client requested brand"));
    }
    @Test void governmentRequirementsAreRequiredAndDocumentsArePrivatePendingChecks() throws Exception {
        var data=request("government");String key=UUID.randomUUID().toString();
        var file=new MockMultipartFile("files","rfq.pdf","application/pdf","%PDF-1.7\nTest fixture\n%%EOF".getBytes());
        http.perform(multipart("/api/rfqs").file(body(data)).file(file).header("Idempotency-Key",key)).andExpect(status().isCreated()).andExpect(jsonPath("$.attachmentCount").value(1));
        assertThat(jdbc.queryForObject("select scan_status from rfq_attachment a join rfq r on r.id=a.rfq_id where r.submission_key=?",String.class,UUID.fromString(key))).isEqualTo("pending");
        assertThat(jdbc.queryForObject("select count(*) from quotation where rfq_id=(select id from rfq where submission_key=?)",Integer.class,UUID.fromString(key))).isZero();
        @SuppressWarnings("unchecked") var buyer=(Map<String,Object>)data.get("buyer");buyer.remove("channel");
        http.perform(multipart("/api/rfqs").file(body(data)).header("Idempotency-Key",UUID.randomUUID())).andExpect(status().isBadRequest());
    }
    @Test void schoolsUseTheSameRequestIntakeWithoutGovernmentFields() throws Exception {
        http.perform(multipart("/api/rfqs").file(body(request("schools"))).header("Idempotency-Key",UUID.randomUUID())).andExpect(status().isCreated());
    }
    @Test void invalidBuyerAndNegativeQuantityCannotCreateRequests() throws Exception {
        int count=jdbc.queryForObject("select count(*) from rfq",Integer.class);
        http.perform(multipart("/api/rfqs").file(body(request("personal"))).header("Idempotency-Key",UUID.randomUUID())).andExpect(status().isBadRequest());
        var data=request("business");data.put("items",List.of(Map.of("description","Paper","quantity",-1,"unit","Each")));
        http.perform(multipart("/api/rfqs").file(body(data)).header("Idempotency-Key",UUID.randomUUID())).andExpect(status().isBadRequest());
        assertThat(jdbc.queryForObject("select count(*) from rfq",Integer.class)).isEqualTo(count);
    }
    @Test void documentOnlySubmissionAndFileValidationWork() throws Exception {
        var data=request("business");data.put("source","document");data.put("items",List.of());
        var csv=new MockMultipartFile("files","list.csv","text/csv","description,quantity\nPaper,3\n".getBytes());
        http.perform(multipart("/api/rfqs").file(body(data)).file(csv).header("Idempotency-Key",UUID.randomUUID())).andExpect(status().isCreated()).andExpect(jsonPath("$.itemCount").value(0));
        http.perform(multipart("/api/rfqs").file(body(data)).header("Idempotency-Key",UUID.randomUUID())).andExpect(status().isBadRequest());
        var disguised=new MockMultipartFile("files","list.pdf","application/pdf","<html>not a PDF</html>".getBytes());
        http.perform(multipart("/api/rfqs").file(body(data)).file(disguised).header("Idempotency-Key",UUID.randomUUID())).andExpect(status().isBadRequest());
    }
    @Test @Transactional(propagation=Propagation.NOT_SUPPORTED)
    void storageFailureRollsBackCustomerRequestAndLines() throws Exception {
        int customers=jdbc.queryForObject("select count(*) from customer",Integer.class);
        int requests=jdbc.queryForObject("select count(*) from rfq",Integer.class);
        doThrow(new IOException("Simulated disk failure")).when(storage).store(any());
        var file=new MockMultipartFile("files","list.csv","text/csv","Paper,1".getBytes());
        http.perform(multipart("/api/rfqs").file(body(request("business"))).file(file).header("Idempotency-Key",UUID.randomUUID())).andExpect(status().isServiceUnavailable());
        assertThat(jdbc.queryForObject("select count(*) from customer",Integer.class)).isEqualTo(customers);
        assertThat(jdbc.queryForObject("select count(*) from rfq",Integer.class)).isEqualTo(requests);
    }
}
