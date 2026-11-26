package za.co.lepetse.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.*;
import java.time.LocalDate;
import java.security.Principal;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/supply")
public class AdminSupplierController {
 private final JdbcTemplate db;
 public AdminSupplierController(JdbcTemplate db){this.db=db;}
 record Quote(@NotBlank @Size(max=200) String supplier,@NotBlank @Size(max=100) String reference,@NotNull LocalDate quoteDate,LocalDate validUntil,@NotNull @Size(max=2000) String terms,@NotNull @Size(max=2000) String deliveryNotes){}
 record Line(@NotBlank @Size(max=100) String sku,@NotBlank @Size(max=1000) String description,Long productId,@NotNull @Pattern(regexp="exact|alternative|unmatched") String matchType,@NotBlank @Size(max=100) String packLabel,@Min(1) @Max(1000000) int unitsPerPack,@NotNull @DecimalMin("0") @DecimalMax("9999999999") BigDecimal packPrice,@Min(1) @Max(1000000) int quotedPacks,@NotNull @Size(max=200) String availability,@NotNull @Size(max=200) String leadTime){}
 record Price(@Min(1) long lineId,@NotNull @DecimalMin("0") @DecimalMax("9999999999") BigDecimal extraCost,@NotNull @DecimalMin("0") @DecimalMax("10000") BigDecimal markup,@NotNull @DecimalMin("0") @DecimalMax("9999999999") BigDecimal sellingPrice,@NotNull Boolean includesVat,@NotNull @DecimalMin("0") @DecimalMax("1") BigDecimal vatRate,boolean confirmAlternative){}
 @GetMapping("/quotes") List<Map<String,Object>> quotes(){return db.queryForList("select q.id,q.supplier_id,s.name supplier,q.reference,q.quote_date,q.valid_until,q.terms,q.delivery_notes,q.document_name,(select count(*) from supplier_quote_line l where l.quote_id=q.id) line_count,(select count(*) from supplier_quote_line l where l.quote_id=q.id and l.match_type='unmatched') unmatched_count from supplier_quote q join supplier s on s.id=q.supplier_id order by q.created_at desc,q.id desc limit 200");}
 @PostMapping("/quotes") @Transactional Map<String,Object> create(@Valid @RequestBody Quote q,Principal p){
  if(q.validUntil()!=null&&q.validUntil().isBefore(q.quoteDate()))throw bad("Expiry cannot be before the quote date.");
  db.update("insert into supplier(name) values (?) on conflict(name) do nothing",q.supplier().trim());
  Long supplier=db.queryForObject("select id from supplier where name=?",Long.class,q.supplier().trim());
  if(db.queryForObject("select count(*) from supplier_quote where supplier_id=? and reference=?",Integer.class,supplier,q.reference().trim())>0)throw bad("This supplier quote is already recorded.");
  Long id=db.queryForObject("insert into supplier_quote(supplier_id,reference,quote_date,valid_until,terms,delivery_notes,created_by) values (?,?,?,?,?,?,?) returning id",Long.class,supplier,q.reference().trim(),q.quoteDate(),q.validUntil(),q.terms(),q.deliveryNotes(),p.getName());
  return Map.of("id",id);
 }
 private void requireQuote(long id){if(db.queryForObject("select count(*) from supplier_quote where id=?",Integer.class,id)==0)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Quote not found.");}
 @PostMapping(value="/quotes/{id}/document",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) Map<String,Object> upload(@PathVariable long id,@RequestParam MultipartFile file)throws java.io.IOException{
  requireQuote(id);byte[] bytes=file.getBytes();
  if(bytes.length<5||bytes.length>10*1024*1024||!new String(bytes,0,5,java.nio.charset.StandardCharsets.US_ASCII).equals("%PDF-"))throw bad("Choose a PDF up to 10 MB.");
  db.update("update supplier_quote set document=?,document_name=? where id=?",bytes,"supplier-quote.pdf",id);return Map.of("saved",true);
 }
 @GetMapping("/quotes/{id}/document") ResponseEntity<byte[]> document(@PathVariable long id){requireQuote(id);byte[] bytes=db.queryForObject("select document from supplier_quote where id=?",byte[].class,id);if(bytes==null)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"No PDF attached.");String filename=db.queryForObject("select document_name from supplier_quote where id=?",String.class,id);return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).header("Content-Disposition",ContentDisposition.attachment().filename(filename==null?"supplier-quote.pdf":filename).build().toString()).header("X-Content-Type-Options","nosniff").body(bytes);}
 @GetMapping("/products") List<Map<String,Object>> products(){return db.queryForList("select p.id,p.name,p.sku,p.legacy_id,(select b.name from brand b where b.id=p.brand_id) brand,p.ordering_unit,p.selling_price,p.price_includes_vat,p.vat_rate,p.updated_at,(select s.name from product_price_decision d join supplier_quote_line l on l.id=d.supplier_quote_line_id join supplier_quote q on q.id=l.quote_id join supplier s on s.id=q.supplier_id where d.product_id=p.id order by d.approved_at desc,d.id desc limit 1) preferred_supplier from product p where p.active=true order by p.name limit 2000");}
 @GetMapping("/quotes/{id}/lines") List<Map<String,Object>> lines(@PathVariable long id){requireQuote(id);return db.queryForList("select l.*,p.name product_name,p.ordering_unit from supplier_quote_line l left join product p on p.id=l.product_id where quote_id=? order by l.id",id);}
 @PostMapping("/quotes/{id}/lines") Map<String,Object> line(@PathVariable long id,@Valid @RequestBody Line l){requireQuote(id);
  if((l.productId()==null)!=l.matchType().equals("unmatched"))throw bad("Match a catalogue product or select unmatched.");
  if(l.productId()!=null&&db.queryForObject("select count(*) from product where id=? and active=true",Integer.class,l.productId())==0)throw bad("Choose an active product.");
  Long line=db.queryForObject("insert into supplier_quote_line(quote_id,supplier_sku,description,product_id,match_type,pack_label,units_per_pack,pack_price_ex_vat,quoted_packs,availability,lead_time) values (?,?,?,?,?,?,?,?,?,?,?) returning id",Long.class,id,l.sku(),l.description(),l.productId(),l.matchType(),l.packLabel(),l.unitsPerPack(),l.packPrice(),l.quotedPacks(),l.availability(),l.leadTime());return Map.of("id",line);
 }
 @GetMapping("/compare/{product}") List<Map<String,Object>> compare(@PathVariable long product){return db.queryForList("select l.*,case when l.match_type='exact' then b.name end supplier_brand,s.name supplier,q.reference,q.quote_date,q.valid_until,q.terms,q.delivery_notes,(q.valid_until<current_date) expired,round(l.pack_price_ex_vat/l.units_per_pack,4) unit_cost from supplier_quote_line l join supplier_quote q on q.id=l.quote_id join supplier s on s.id=q.supplier_id left join product p on p.id=l.product_id left join brand b on b.id=p.brand_id where l.product_id=? order by l.pack_price_ex_vat/l.units_per_pack,q.quote_date desc,l.id desc",product);}
 @PutMapping("/quotes/{id}/lines/{lineId}") @Transactional Map<String,Object> updateLine(@PathVariable long id,@PathVariable long lineId,@Valid @RequestBody Line l){requireQuote(id);if((l.productId()==null)!=l.matchType().equals("unmatched"))throw bad("Match a catalogue product or select unmatched.");if(l.productId()!=null&&db.queryForObject("select count(*) from product where id=? and active=true",Integer.class,l.productId())==0)throw bad("Choose an active product.");if(db.update("update supplier_quote_line set supplier_sku=?,description=?,product_id=?,match_type=?,pack_label=?,units_per_pack=?,pack_price_ex_vat=?,quoted_packs=?,availability=?,lead_time=? where id=? and quote_id=?",l.sku(),l.description(),l.productId(),l.matchType(),l.packLabel(),l.unitsPerPack(),l.packPrice(),l.quotedPacks(),l.availability(),l.leadTime(),lineId,id)!=1)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Quote line not found.");return Map.of("saved",true);}
 record NewProduct(@NotBlank @Size(max=1000) String name,@NotNull @Size(max=200) String brand,@Min(1) long categoryId,@NotBlank @Size(max=100) String orderingUnit){}
 @GetMapping("/product-categories") List<Map<String,Object>> productCategories(){return db.queryForList("select id,name from category order by name");}
 @PostMapping("/products") @Transactional Map<String,Object> createProduct(@Valid @RequestBody NewProduct p){
  if(db.queryForObject("select count(*) from category where id=?",Integer.class,p.categoryId())!=1)throw bad("Choose a valid category.");
  String name=p.name().trim(),brand=p.brand().trim(),unit=p.orderingUnit().trim();
  db.execute("select pg_advisory_xact_lock(728104)");
  if(db.queryForObject("select count(*) from product p left join brand b on b.id=p.brand_id where lower(p.name)=lower(?) and lower(coalesce(b.name,''))=lower(?) and lower(p.ordering_unit)=lower(?)",Integer.class,name,brand,unit)>0)throw new ResponseStatusException(HttpStatus.CONFLICT,"This catalogue product already exists. Search and link it instead.");
  Long brandId=null;
  if(!brand.isBlank()){
   var ids=db.queryForList("select id from brand where lower(name)=lower(?) order by id limit 1",Long.class,brand);
   brandId=ids.isEmpty()?db.queryForObject("insert into brand(name) values (?) on conflict(name) do update set name=excluded.name returning id",Long.class,brand):ids.getFirst();
  }
  long id=db.queryForObject("insert into product(name,description,brand_id,category_id,ordering_unit,active,checkout_enabled) values (?,?,?,?,?,true,false) returning id",Long.class,name,name,brandId,p.categoryId(),unit);
  return db.queryForMap("select p.id,p.name,p.sku,b.name brand,p.ordering_unit,p.selling_price from product p left join brand b on b.id=p.brand_id where p.id=?",id);
 }
 @PostMapping("/products/{product}/approve-price") @Transactional Map<String,Object> approve(@PathVariable long product,@Valid @RequestBody Price p,Principal actor){
  var rows=db.queryForList("select l.*,q.valid_until from supplier_quote_line l join supplier_quote q on q.id=l.quote_id where l.id=? and l.product_id=?",p.lineId(),product);
  if(rows.isEmpty())throw bad("Choose a supplier line matched to this product.");var l=rows.getFirst();
  if(l.get("valid_until")!=null&&((java.sql.Date)l.get("valid_until")).toLocalDate().isBefore(LocalDate.now()))throw bad("This quote has expired. Obtain a current quote first.");
  if(!l.get("match_type").equals("exact")&&!p.confirmAlternative())throw bad("Confirm the alternative specification before approving.");
  BigDecimal cost=((BigDecimal)l.get("pack_price_ex_vat")).divide(BigDecimal.valueOf(((Number)l.get("units_per_pack")).longValue()),4,RoundingMode.HALF_UP).add(p.extraCost());
  BigDecimal net=p.includesVat()?p.sellingPrice().divide(BigDecimal.ONE.add(p.vatRate()),4,RoundingMode.HALF_UP):p.sellingPrice();
  BigDecimal actualMarkup=cost.signum()==0?BigDecimal.ZERO:net.subtract(cost).multiply(BigDecimal.valueOf(100)).divide(cost,3,RoundingMode.HALF_UP);
  if(actualMarkup.compareTo(BigDecimal.valueOf(10000))>0)throw bad("Selling price exceeds the supported markup range. Review the cost conversion.");
  if(net.compareTo(cost)<0)throw bad("Selling price is below the entered cost. Review the price and VAT basis.");
  if(db.update("update product set selling_price=?,price_includes_vat=?,vat_rate=?,updated_at=now() where id=? and active=true",p.sellingPrice(),p.includesVat(),p.vatRate(),product)!=1)throw bad("Product is not active.");
  db.update("insert into product_price_decision(product_id,supplier_quote_line_id,landed_cost,markup_percent,selling_price,price_includes_vat,vat_rate,actor) values (?,?,?,?,?,?,?,?)",product,p.lineId(),cost,actualMarkup,p.sellingPrice(),p.includesVat(),p.vatRate(),actor.getName());return Map.of("approved",true,"sellingPrice",p.sellingPrice());
 }
 private ResponseStatusException bad(String message){return new ResponseStatusException(HttpStatus.BAD_REQUEST,message);}
}
