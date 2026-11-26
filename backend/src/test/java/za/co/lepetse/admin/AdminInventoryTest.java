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
import java.util.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;
@SpringBootTest @AutoConfigureMockMvc @Transactional
@EnabledIfEnvironmentVariable(named="LEPETSE_DB_TEST",matches="true")
class AdminInventoryTest {
 @Autowired MockMvc http;@Autowired JdbcTemplate db;@Autowired ObjectMapper json;
 long product(){return db.queryForObject("select min(id) from product where active",Long.class);}
 Map<String,Object> body(UUID key,String type,long qty,boolean reserved){return Map.of("submissionKey",key,"type",type,"quantity",qty,"fromReserved",reserved,"reference","TEST","reason","Stock test");}
 void entry(long p,String type,long qty,boolean held)throws Exception{http.perform(post("/api/admin/supply/inventory/"+p+"/movements").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(json.writeValueAsString(body(UUID.randomUUID(),type,qty,held)))).andExpect(status().isOk());}
 void balance(long p,long on,long reserved){var b=db.queryForMap("select * from inventory_balance where product_id=?",p);assertThat(((Number)b.get("on_hand")).longValue()).isEqualTo(on);assertThat(((Number)b.get("reserved")).longValue()).isEqualTo(reserved);}
 @Test void recordsRemainingAvailableAndHistory()throws Exception{long p=product();entry(p,"opening",100,false);entry(p,"receive",20,false);entry(p,"reserve",30,false);balance(p,120,30);entry(p,"dispatch",20,true);balance(p,100,10);entry(p,"dispatch",5,false);entry(p,"release",10,false);entry(p,"adjust",-5,false);balance(p,90,0);http.perform(get("/api/admin/supply/inventory/"+p+"/history").with(user("owner").roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(7)).andExpect(jsonPath("$[0].balance_after").value(90)).andExpect(jsonPath("$[0].actor").value("owner"));}
 @Test void retriesAreIdempotentAndChangedRetriesConflict()throws Exception{long p=product();var data=body(UUID.randomUUID(),"receive",12,false);for(int i=0;i<2;i++)http.perform(post("/api/admin/supply/inventory/"+p+"/movements").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(json.writeValueAsString(data))).andExpect(status().isOk());balance(p,12,0);var changed=new HashMap<String,Object>(data);changed.put("quantity",13);http.perform(post("/api/admin/supply/inventory/"+p+"/movements").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(json.writeValueAsString(changed))).andExpect(status().isConflict());balance(p,12,0);}
 @Test void preventsOversellingReservedStockAndDuplicateOpening()throws Exception{long p=product();entry(p,"opening",10,false);entry(p,"reserve",8,false);for(var data:List.of(body(UUID.randomUUID(),"dispatch",3,false),body(UUID.randomUUID(),"dispatch",9,true),body(UUID.randomUUID(),"adjust",-3,false),body(UUID.randomUUID(),"release",9,false),body(UUID.randomUUID(),"opening",12,false))){http.perform(post("/api/admin/supply/inventory/"+p+"/movements").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(json.writeValueAsString(data))).andExpect(status().isBadRequest());}balance(p,10,8);}
 @Test void requiresAdminCsrfAndValidQuantity()throws Exception{long p=product();http.perform(get("/api/admin/supply/inventory")).andExpect(status().isUnauthorized());http.perform(get("/api/admin/supply/inventory").with(user("viewer").roles("USER"))).andExpect(status().isForbidden());http.perform(post("/api/admin/supply/inventory/"+p+"/movements").with(user("owner").roles("ADMIN")).contentType("application/json").content(json.writeValueAsString(body(UUID.randomUUID(),"receive",1,false)))).andExpect(status().isForbidden());for(var data:List.of(body(UUID.randomUUID(),"receive",-1,false),body(UUID.randomUUID(),"dispatch",1,false))){http.perform(post("/api/admin/supply/inventory/"+p+"/movements").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(json.writeValueAsString(data))).andExpect(status().isBadRequest());}assertThat(db.queryForObject("select count(*) from inventory_balance where product_id=? and initialized",Integer.class,p)).isZero();}
 @Test void uncountedProductsAreUnknownUntilCounted()throws Exception{long p=product();http.perform(get("/api/admin/supply/inventory").with(user("owner").roles("ADMIN"))).andExpect(status().isOk());assertThat(db.queryForObject("select count(*) from inventory_balance where product_id=? and initialized",Integer.class,p)).isZero();entry(p,"opening",0,false);balance(p,0,0);}
 @Test void rejectsFractionalAndMissingStockQuantities()throws Exception{long p=product();var data=new HashMap<String,Object>(body(UUID.randomUUID(),"opening",0,false));data.put("quantity",1.5);http.perform(post("/api/admin/supply/inventory/"+p+"/movements").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(json.writeValueAsString(data))).andExpect(status().isBadRequest());data.remove("quantity");http.perform(post("/api/admin/supply/inventory/"+p+"/movements").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(json.writeValueAsString(data))).andExpect(status().isBadRequest());}
}
