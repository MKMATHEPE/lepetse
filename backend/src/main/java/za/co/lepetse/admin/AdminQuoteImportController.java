package za.co.lepetse.admin;

import java.io.*;
import za.co.lepetse.admin.AdminSupplierController.Line;
import za.co.lepetse.admin.AdminSupplierController.Quote;
import java.math.*;
import java.security.*;
import java.util.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/supply/imports")
public class AdminQuoteImportController {
 private final SupplierQuoteExtractor extractor;private final AdminSupplierController supply;private final JdbcTemplate db;
 public AdminQuoteImportController(SupplierQuoteExtractor extractor,AdminSupplierController supply,JdbcTemplate db){this.extractor=extractor;this.supply=supply;this.db=db;}
 record Review(@NotNull @Valid Quote quote,@NotEmpty @Size(max=500) List<@NotNull @Valid Line> lines,@NotBlank @Pattern(regexp="[a-f0-9]{64}") String sha256,@NotNull @Pattern(regexp="exclusive|inclusive") String vatBasis,@DecimalMin("0") @DecimalMax("1") BigDecimal vatRate,@AssertTrue boolean confirmed){}
 record ManualReview(@NotNull @Valid Quote quote,@NotEmpty @Size(max=500) List<@NotNull @Valid Line> lines,@NotNull @Pattern(regexp="exclusive|inclusive") String vatBasis,@DecimalMin("0") @DecimalMax("1") BigDecimal vatRate,@AssertTrue boolean confirmed){}
 @PostMapping(value="/manual",consumes=MediaType.APPLICATION_JSON_VALUE) @Transactional
 Map<String,Object> manual(@RequestBody @Valid ManualReview review,Principal actor){return persist(review.quote(),review.lines(),review.vatBasis(),review.vatRate(),actor);}
 private Map<String,Object> persist(Quote quote,List<Line> lines,String vatBasis,BigDecimal vatRate,Principal actor){
  if(vatBasis.equals("inclusive")&&(vatRate==null||vatRate.signum()==0))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Enter the VAT rate to convert inclusive prices.");
  var saved=supply.create(quote,actor);long id=((Number)saved.get("id")).longValue();
  for(var l:lines){BigDecimal price=vatBasis.equals("inclusive")?l.packPrice().divide(BigDecimal.ONE.add(vatRate),4,RoundingMode.HALF_UP):l.packPrice();supply.line(id,new Line(l.sku(),l.description(),l.productId(),l.matchType(),l.packLabel(),l.unitsPerPack(),price,l.quotedPacks(),l.availability(),l.leadTime()));}
  return Map.of("id",id,"importedLines",lines.size());
 }
 private String digest(byte[] bytes){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));}catch(NoSuchAlgorithmException e){throw new IllegalStateException(e);}}
 @PostMapping(value="/extract",consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
 Map<String,Object> extract(@RequestParam MultipartFile file,@RequestParam(required=false) Long supplierId){try{byte[] bytes=file.getBytes();Map<String,String> columns=Map.of();if(supplierId!=null){var rows=db.queryForList("select import_columns::text columns from supplier where id=?",supplierId);if(rows.isEmpty())throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Supplier not found.");if(db.queryForObject("select count(*) from supplier_quote where supplier_id=? and source_sha256=?",Integer.class,supplierId,digest(bytes))>0)throw new ResponseStatusException(HttpStatus.CONFLICT,"This file is already saved for this supplier. Open it in Price lists.");columns=new com.fasterxml.jackson.databind.ObjectMapper().readValue(rows.getFirst().get("columns").toString(),new com.fasterxml.jackson.core.type.TypeReference<Map<String,String>>(){});}return Map.of("extraction",extractor.extract(bytes,file.getOriginalFilename(),columns),"sha256",digest(bytes));}catch(IOException|IllegalArgumentException e){throw new ResponseStatusException(HttpStatus.BAD_REQUEST,e instanceof IllegalArgumentException?e.getMessage():"Unable to read this document. Use a readable, text-based PDF, XLSX or UTF-8 CSV.");}catch(ResponseStatusException e){throw e;}catch(RuntimeException e){throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"The document format could not be read. Check the file or export it as CSV.");}}
 @PostMapping(consumes=MediaType.MULTIPART_FORM_DATA_VALUE) @Transactional
 Map<String,Object> save(@RequestPart("review") @Valid Review review,@RequestPart MultipartFile file,Principal actor){
  try{
   byte[] bytes=file.getBytes();String format=extractor.format(bytes,file.getOriginalFilename());
   if(!MessageDigest.isEqual(digest(bytes).getBytes(java.nio.charset.StandardCharsets.US_ASCII),review.sha256().getBytes(java.nio.charset.StandardCharsets.US_ASCII)))throw new IllegalArgumentException("The file changed after extraction. Extract it again before saving.");
   if(db.queryForObject("select count(*) from supplier_quote q join supplier s on s.id=q.supplier_id where s.name=? and q.source_sha256=?",Integer.class,review.quote().supplier().trim(),review.sha256())>0)throw new ResponseStatusException(HttpStatus.CONFLICT,"This file is already saved for this supplier.");
   var saved=persist(review.quote(),review.lines(),review.vatBasis(),review.vatRate(),actor);long id=((Number)saved.get("id")).longValue();
   db.update("update supplier_quote set document=?,document_name=?,source_sha256=? where id=?",bytes,"supplier-quote."+format,review.sha256(),id);
   return saved;
  }catch(IOException e){throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unable to read the original document.");}catch(IllegalArgumentException e){throw new ResponseStatusException(HttpStatus.BAD_REQUEST,e.getMessage());}
 }
}
