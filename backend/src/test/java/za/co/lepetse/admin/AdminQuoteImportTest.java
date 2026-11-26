package za.co.lepetse.admin;
import java.util.*;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mock.web.MockMultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;
@SpringBootTest @AutoConfigureMockMvc @Transactional
@EnabledIfEnvironmentVariable(named="LEPETSE_DB_TEST",matches="true")
class AdminQuoteImportTest {
 @Autowired MockMvc http;@Autowired JdbcTemplate db;@Autowired ObjectMapper json;
 MockMultipartFile file(){return new MockMultipartFile("file","quote.csv","text/csv","SKU,Description,Quantity,Price,UOM\nA1,Blue pens,2,115,Box-10\n".getBytes(StandardCharsets.UTF_8));}
 String hash()throws Exception{return json.readTree(http.perform(multipart("/api/admin/supply/imports/extract").file(file()).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()).get("sha256").asText();}
 Map<String,Object> review(String hash){return new HashMap<>(Map.of("quote",Map.of("supplier","Import test supplier","reference","IMPORT-TEST-1","quoteDate","2026-11-18","terms","COD","deliveryNotes",""),"lines",List.of(Map.of("sku","A1","description","Blue pens","quotedPacks",2,"packPrice",115,"packLabel","Box-10","unitsPerPack",10,"matchType","unmatched","availability","Unconfirmed","leadTime","")),"sha256",hash,"vatBasis","inclusive","vatRate",0.15,"confirmed",true));}
 MockMultipartFile data(Map<String,Object> review)throws Exception{return new MockMultipartFile("review","review.json","application/json",json.writeValueAsBytes(review));}
 @Test void supplierColumnPreferencesAndDuplicateFilesAreRecognised()throws Exception{long supplier=db.queryForObject("insert into supplier(name) values ('Import test supplier') returning id",Long.class);var mapping=Map.of("description","Article","packPrice","Trade price","sku","Vendor code");http.perform(put("/api/admin/supply/suppliers/"+supplier+"/import-columns").with(user("owner").roles("ADMIN")).with(csrf()).contentType("application/json").content(json.writeValueAsBytes(mapping))).andExpect(status().isOk());var custom=new MockMultipartFile("file","prices.csv","text/csv","Article,Trade price,Vendor code\nPaper,79.90,P-01\n".getBytes(StandardCharsets.UTF_8));http.perform(multipart("/api/admin/supply/imports/extract").file(custom).param("supplierId",String.valueOf(supplier)).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.extraction.lines[0].sku").value("P-01"));http.perform(multipart("/api/admin/supply/imports/extract").file(custom).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isBadRequest());String sha=hash();http.perform(multipart("/api/admin/supply/imports").file(file()).file(data(review(sha))).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isOk());http.perform(multipart("/api/admin/supply/imports/extract").file(file()).param("supplierId",String.valueOf(supplier)).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isConflict());}
 @Test void extractionIsPrivateCsrfProtectedAndDoesNotWriteQuotes()throws Exception{
  int before=db.queryForObject("select count(*) from supplier_quote",Integer.class);
  http.perform(multipart("/api/admin/supply/imports/extract").file(file()).with(csrf())).andExpect(status().isUnauthorized());
  http.perform(multipart("/api/admin/supply/imports/extract").file(file()).with(user("owner").roles("ADMIN"))).andExpect(status().isForbidden());
  hash();assertThat(db.queryForObject("select count(*) from supplier_quote",Integer.class)).isEqualTo(before);
 }
 @Test void reviewSavesOriginalWithConvertedCostsAndNeverChangesRetailPrices()throws Exception{
  String sha=hash();int prices=db.queryForObject("select count(*) from product_price_decision",Integer.class);
  var response=http.perform(multipart("/api/admin/supply/imports").file(file()).file(data(review(sha))).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.importedLines").value(1)).andReturn().getResponse().getContentAsString();long id=json.readTree(response).get("id").asLong();
  assertThat(db.queryForObject("select pack_price_ex_vat from supplier_quote_line where quote_id=?",java.math.BigDecimal.class,id)).isEqualByComparingTo("100");
  assertThat(db.queryForObject("select document_name from supplier_quote where id=?",String.class,id)).isEqualTo("supplier-quote.csv");
  assertThat(db.queryForObject("select count(*) from product_price_decision",Integer.class)).isEqualTo(prices);
  http.perform(get("/api/admin/supply/quotes/"+id+"/document").with(user("owner").roles("ADMIN"))).andExpect(status().isOk()).andExpect(header().string("Content-Disposition","attachment; filename=\"supplier-quote.csv\""));
  http.perform(multipart("/api/admin/supply/imports").file(file()).file(data(review(sha))).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isConflict());
 }
 @Test void changedFileMissingConfirmationAndInvalidRowsCannotBeImported()throws Exception{
  var review=review("0".repeat(64));http.perform(multipart("/api/admin/supply/imports").file(file()).file(data(review)).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isBadRequest());
  review=review(hash());review.put("confirmed",false);http.perform(multipart("/api/admin/supply/imports").file(file()).file(data(review)).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isBadRequest());
  review.put("confirmed",true);review.put("lines",List.of(Map.of("sku","")));http.perform(multipart("/api/admin/supply/imports").file(file()).file(data(review)).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isBadRequest());
  assertThat(db.queryForObject("select count(*) from supplier_quote where reference='IMPORT-TEST-1'",Integer.class)).isZero();
 }

 @Test void manualEntrySavesTheSameReviewedQuoteWithoutAFile()throws Exception{
  var review=review("0".repeat(64));review.remove("sha256");
  var response=http.perform(post("/api/admin/supply/imports/manual").contentType("application/json").content(json.writeValueAsBytes(review)).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isOk()).andExpect(jsonPath("$.importedLines").value(1)).andReturn().getResponse().getContentAsString();
  long id=json.readTree(response).get("id").asLong();assertThat(db.queryForObject("select document_name from supplier_quote where id=?",String.class,id)).isNull();assertThat(db.queryForObject("select pack_price_ex_vat from supplier_quote_line where quote_id=?",java.math.BigDecimal.class,id)).isEqualByComparingTo("100");
 }
 @Test void manualEntryNeedsSecurityConfirmationAndAtLeastOneCompleteRow()throws Exception{
  var review=review("0".repeat(64));review.remove("sha256");
  http.perform(post("/api/admin/supply/imports/manual").contentType("application/json").content(json.writeValueAsBytes(review)).with(user("owner").roles("ADMIN"))).andExpect(status().isForbidden());
  review.put("confirmed",false);http.perform(post("/api/admin/supply/imports/manual").contentType("application/json").content(json.writeValueAsBytes(review)).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isBadRequest());
  review.put("confirmed",true);review.put("lines",List.of());http.perform(post("/api/admin/supply/imports/manual").contentType("application/json").content(json.writeValueAsBytes(review)).with(user("owner").roles("ADMIN")).with(csrf())).andExpect(status().isBadRequest());
 }
}
