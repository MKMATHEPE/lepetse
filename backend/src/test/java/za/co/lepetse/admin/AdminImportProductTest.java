package za.co.lepetse.admin;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;
@SpringBootTest @AutoConfigureMockMvc @Transactional
@EnabledIfEnvironmentVariable(named="LEPETSE_DB_TEST",matches="true")
class AdminImportProductTest {
 @Autowired MockMvc http;@Autowired JdbcTemplate db;@Autowired ObjectMapper json;
 String body() throws Exception{return json.writeValueAsString(Map.of("name","Import product test blue pen","brand","Import test brand","categoryId",db.queryForObject("select min(id) from category",Long.class),"orderingUnit","Each"));}
 @Test void creationRequiresAdminAndCsrf()throws Exception{
  http.perform(post("/api/admin/supply/products").with(csrf()).contentType("application/json").content(body())).andExpect(status().isUnauthorized());
  http.perform(post("/api/admin/supply/products").with(user("owner").roles("ADMIN")).contentType("application/json").content(body())).andExpect(status().isForbidden());
 }
 @Test void createsWithoutRetailPriceAndPreventsDuplicate()throws Exception{
  var result=http.perform(post("/api/admin/supply/products").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(body())).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  long id=json.readTree(result).get("id").asLong();var p=db.queryForMap("select * from product where id=?",id);
  assertThat(p.get("selling_price")).isNull();assertThat(p.get("checkout_enabled")).isEqualTo(false);
  http.perform(post("/api/admin/supply/products").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(body())).andExpect(status().isConflict());
 }
 @Test void rejectsMissingCategory()throws Exception{
  http.perform(post("/api/admin/supply/products").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content("{\"name\":\"Missing category\",\"brand\":\"\",\"categoryId\":9223372036854775807,\"orderingUnit\":\"Each\"}")).andExpect(status().isBadRequest());
 }
}
