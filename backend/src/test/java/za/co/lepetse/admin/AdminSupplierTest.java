package za.co.lepetse.admin;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;
@SpringBootTest @AutoConfigureMockMvc @Transactional
@EnabledIfEnvironmentVariable(named="LEPETSE_DB_TEST",matches="true")
class AdminSupplierTest {
 @Autowired MockMvc http;@Autowired JdbcTemplate db;@Autowired ObjectMapper json;
 long quote(String supplier,String reference)throws Exception{return json.readTree(http.perform(post("/api/admin/supply/quotes").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("supplier",supplier,"reference",reference,"quoteDate","2026-01-01","terms","COD","deliveryNotes","Unconfirmed")))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()).get("id").asLong();}
 long product(){return db.queryForObject("select id from product where active=true order by id limit 1",Long.class);}
 long line(long quote,long product,int units,String price,String match)throws Exception{return json.readTree(http.perform(post("/api/admin/supply/quotes/"+quote+"/lines").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("sku","S-1","description","Test pens","productId",product,"matchType",match,"packLabel","Box","unitsPerPack",units,"packPrice",price,"quotedPacks",1,"availability","Unconfirmed","leadTime","")))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()).get("id").asLong();}
 @Test void suppliersArePrivateAndPackCostsAreComparedWithoutPublishing()throws Exception{
  http.perform(get("/api/admin/supply/quotes")).andExpect(status().isUnauthorized());
  http.perform(post("/api/admin/supply/quotes").with(user("owner").roles("ADMIN")).contentType(MediaType.APPLICATION_JSON).content("{}")).andExpect(status().isForbidden());
  long product=product(),a=quote("TEST A","QA"),b=quote("TEST B","QB");line(a,product,60,"189.00","exact");line(b,product,50,"170.00","alternative");
  http.perform(get("/api/admin/supply/compare/"+product).with(user("owner").roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$[0].unit_cost").value(3.15)).andExpect(jsonPath("$[1].unit_cost").value(3.40));
  assertThat(db.queryForObject("select count(*) from product_price_decision",Integer.class)).isZero();
  http.perform(get("/api/admin/supply/quotes").with(user("viewer").roles("USER"))).andExpect(status().isForbidden());
 }
 @Test void approvalRequiresValidCostsAndRecordsChosenSupplierWithoutEnablingCheckout()throws Exception{
  long product=product(),q=quote("TEST PRICE","QP"),l=line(q,product,60,"189.00","alternative");
  var body=new HashMap<String,Object>(Map.of("lineId",l,"extraCost",0,"markup",40,"sellingPrice",4.41,"includesVat",false,"vatRate",0,"confirmAlternative",false));
  http.perform(post("/api/admin/supply/products/"+product+"/approve-price").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
  body.put("confirmAlternative",true);
  http.perform(post("/api/admin/supply/products/"+product+"/approve-price").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isOk());
  assertThat(db.queryForObject("select selling_price from product where id=?",java.math.BigDecimal.class,product)).isEqualByComparingTo("4.41");
  assertThat(db.queryForObject("select actor from product_price_decision where product_id=?",String.class,product)).isEqualTo("owner");
  body.put("sellingPrice",1);
  http.perform(post("/api/admin/supply/products/"+product+"/approve-price").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
  db.update("update supplier_quote set valid_until='2026-01-02' where id=?",q);
  body.put("sellingPrice",4.41);
  http.perform(post("/api/admin/supply/products/"+product+"/approve-price").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isBadRequest());
 }
 @Test void documentsStayPrivateAndInvalidFilesAndLinesAreRejected()throws Exception{
  long q=quote("TEST PDF","QPDF");
  http.perform(multipart("/api/admin/supply/quotes/"+q+"/document").file(new MockMultipartFile("file","test.pdf","application/pdf","%PDF-1.4 test".getBytes())).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isOk());
  http.perform(get("/api/admin/supply/quotes/"+q+"/document")).andExpect(status().isUnauthorized());
  http.perform(get("/api/admin/supply/quotes/"+q+"/document").with(user("owner").roles("ADMIN"))).andExpect(status().isOk()).andExpect(header().string("Content-Disposition","attachment; filename=\"supplier-quote.pdf\""));
  http.perform(multipart("/api/admin/supply/quotes/"+q+"/document").file(new MockMultipartFile("file","test.html","text/html","<script>".getBytes())).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isBadRequest());
  http.perform(post("/api/admin/supply/quotes/"+q+"/lines").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content("{}")).andExpect(status().isBadRequest());
 }

 @Test void buyingListUsesWholePacksChargesDeliveryOnceAndKeepsUnknownCostsIncomplete()throws Exception{
  var ids=db.queryForList("select id from product where active=true order by id limit 2",Long.class);long p=ids.get(0),p2=ids.get(1),a=quote("TEST PLAN A","PA"),b=quote("TEST PLAN B","PB");
  long a1=line(a,p,60,"189","exact"),a2=line(a,p2,1,"10","exact");line(b,p,50,"170","exact");
  long supplier=db.queryForObject("select supplier_id from supplier_quote where id=?",Long.class,a);
  var needs=List.of(Map.of("productId",p,"quantity",75,"lineId",a1),Map.of("productId",p2,"quantity",10,"lineId",a2));
  var plan=Map.of("items",needs,"freight",List.of(Map.of("supplierId",supplier,"delivery",35,"minimumOrder",0)));
  http.perform(post("/api/admin/supply/comparison-plan").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(plan)))
   .andExpect(status().isOk()).andExpect(jsonPath("$.selected.goods").value(478)).andExpect(jsonPath("$.selected.knownDelivery").value(35)).andExpect(jsonPath("$.selected.total").value(513)).andExpect(jsonPath("$.selected.complete").value(true)).andExpect(jsonPath("$.items[0].deliveryPerSellingUnit").value(0.2306));
  String response=http.perform(post("/api/admin/supply/comparison-plan").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("items",needs,"freight",List.of())))).andExpect(status().isOk()).andExpect(jsonPath("$.selected.total").isEmpty()).andExpect(jsonPath("$.selected.complete").value(false)).andReturn().getResponse().getContentAsString();
  var rows=json.readTree(response).get("items");assertThat(rows.get(0).get("offers").findValues("extraUnits").stream().map(n->n.asInt()).toList()).contains(45,25);
  assertThat(rows.get(0).get("offers").findValues("purchaseCost").stream().map(n->n.asInt()).toList()).contains(378,340);
  var unmet=Map.of("items",needs,"freight",List.of(Map.of("supplierId",supplier,"delivery",35,"minimumOrder",500)));
  http.perform(post("/api/admin/supply/comparison-plan").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(unmet))).andExpect(status().isOk()).andExpect(jsonPath("$.selected.minimumMet").value(false)).andExpect(jsonPath("$.selected.complete").value(false));
 }
 @Test void comparisonRejectsWrongSelectionsDuplicateProductsAndMissingSecurity()throws Exception{
  long p=product(),q=quote("TEST PLAN VALIDATE","PV"),l=line(q,p,12,"12","exact");
  var need=Map.of("productId",p,"quantity",5,"lineId",l);
  http.perform(post("/api/admin/supply/comparison-plan").with(user("owner").roles("ADMIN")).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("items",List.of(need),"freight",List.of())))).andExpect(status().isForbidden());
  http.perform(post("/api/admin/supply/comparison-plan").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("items",List.of(need,need),"freight",List.of())))).andExpect(status().isBadRequest());
  db.update("update supplier_quote set valid_until='2026-01-02' where id=?",q);
  http.perform(post("/api/admin/supply/comparison-plan").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("items",List.of(need),"freight",List.of())))).andExpect(status().isBadRequest());
 }
 @Test void batchApprovalUsesReviewedVersionsAndDoesNotEnableCheckout()throws Exception{
  long p=product(),q=quote("TEST BATCH","BATCH"),l=line(q,p,60,"189","exact");
  boolean checkout=db.queryForObject("select checkout_enabled from product where id=?",Boolean.class,p);
  String version=db.queryForObject("select updated_at from product where id=?",java.sql.Timestamp.class,p).toInstant().toString();
  var price=Map.of("lineId",l,"extraCost",0,"markup",40,"sellingPrice",4.41,"includesVat",false,"vatRate",0,"confirmAlternative",true);
  var item=Map.of("productId",p,"expectedUpdatedAt",version,"price",price);
  var payload=json.writeValueAsString(Map.of("items",List.of(item)));
  http.perform(post("/api/admin/supply/approve-prices").with(user("owner").roles("ADMIN")).contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isForbidden());
  http.perform(post("/api/admin/supply/approve-prices").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isOk()).andExpect(jsonPath("$.approved").value(1));
  // Force a later version even though PostgreSQL now() is stable within this test transaction.
  db.update("update product set updated_at=updated_at+interval '1 second' where id=?",p);
  http.perform(post("/api/admin/supply/approve-prices").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isConflict());
  assertThat(db.queryForObject("select count(*) from product_price_decision where product_id=?",Integer.class,p)).isEqualTo(1);
  assertThat(db.queryForObject("select checkout_enabled from product where id=?",Boolean.class,p)).isEqualTo(checkout);
 }

 @Test void zeroValueGoodsStillReceiveTheirShareOfDelivery()throws Exception{
  long p=product(),q=quote("TEST FREE GOODS","FREE"),l=line(q,p,10,"0","exact");
  long supplier=db.queryForObject("select supplier_id from supplier_quote where id=?",Long.class,q);
  var body=Map.of("items",List.of(Map.of("productId",p,"quantity",5,"lineId",l)),"freight",List.of(Map.of("supplierId",supplier,"delivery",20,"minimumOrder",0)));
  http.perform(post("/api/admin/supply/comparison-plan").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isOk()).andExpect(jsonPath("$.items[0].deliveryPerSellingUnit").value(2)).andExpect(jsonPath("$.selected.total").value(20));
 }
 @Test void supplierPurchasingAndBankingDetailsPersistAndPreserveLeadingZeros()throws Exception{
 var body=new HashMap<String,Object>(Map.of("name","TEST BANK PROFILE","contactName","Test contact","email","supplier@example.invalid","phone","0000000000","address","Test address","paymentTerms","COD","deliveryNotes",""));
 body.putAll(Map.of("codNumber","00045","salesPerson","Test salesperson","bankName","Test bank","accountName","Test supplier","accountNumber","00123456789","branchName","Test branch","branchCode","001234","electronicBranchCode","000123"));
 long id=json.readTree(http.perform(post("/api/admin/supply/suppliers").with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()).get("id").asLong();
 http.perform(get("/api/admin/supply/suppliers/"+id).with(user("owner").roles("ADMIN"))).andExpect(status().isOk()).andExpect(jsonPath("$.account_number").value("00123456789")).andExpect(jsonPath("$.cod_number").value("00045")).andExpect(jsonPath("$.electronic_branch_code").value("000123"));
 body.put("salesPerson","Updated salesperson");http.perform(put("/api/admin/supply/suppliers/"+id).with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isOk());
 assertThat(db.queryForObject("select sales_person from supplier where id=?",String.class,id)).isEqualTo("Updated salesperson");
 for(String key:List.of("codNumber","salesPerson","bankName","accountName","accountNumber","branchName","branchCode","electronicBranchCode"))body.remove(key);
 http.perform(put("/api/admin/supply/suppliers/"+id).with(user("owner").roles("ADMIN")).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body))).andExpect(status().isOk());
 assertThat(db.queryForObject("select account_number from supplier where id=?",String.class,id)).isEqualTo("00123456789");
 http.perform(get("/api/admin/supply/suppliers/"+id)).andExpect(status().isUnauthorized());
 }
}
