package za.co.lepetse.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.*;
import java.security.Principal;
import java.time.*;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/** Purchasing scenarios are estimates, not orders; only explicit price approval writes data. */
@RestController
@RequestMapping("/api/admin/supply")
public class AdminComparisonController {
 private final JdbcTemplate db;
 private final AdminSupplierController supply;
 public AdminComparisonController(JdbcTemplate db,AdminSupplierController supply){this.db=db;this.supply=supply;}
 record Need(@Min(1) long productId,@Min(1) @Max(1000000) int quantity,Long lineId){}
 record Freight(@Min(1) long supplierId,@DecimalMin("0") @DecimalMax("9999999999") BigDecimal delivery,@DecimalMin("0") @DecimalMax("9999999999") BigDecimal minimumOrder){}
 record Plan(@NotEmpty @Size(max=100) List<@NotNull @Valid Need> items,@NotNull @Size(max=100) List<@NotNull @Valid Freight> freight){}
 record Approval(@Min(1) long productId,@NotNull Instant expectedUpdatedAt,@NotNull @Valid AdminSupplierController.Price price){}
 record Batch(@NotEmpty @Size(max=100) List<@NotNull @Valid Approval> items){}
 private ResponseStatusException bad(String text){return new ResponseStatusException(HttpStatus.BAD_REQUEST,text);}
 private BigDecimal decimal(Object v){return (BigDecimal)v;}
 private long number(Object v){return ((Number)v).longValue();}
 private BigDecimal sum(List<Map<String,Object>> offers){return offers.stream().map(o->decimal(o.get("purchaseCost"))).reduce(BigDecimal.ZERO,BigDecimal::add);}
 private Map<String,Object> totals(List<Map<String,Object>> chosen,Map<Long,Freight> freight,int requested){
  var groups=new LinkedHashMap<Long,List<Map<String,Object>>>();
  chosen.forEach(o->groups.computeIfAbsent(number(o.get("supplier_id")),k->new ArrayList<>()).add(o));
  var suppliers=new ArrayList<Map<String,Object>>();BigDecimal goods=sum(chosen),delivery=BigDecimal.ZERO;boolean known=true,minimumMet=true,minimumConfirmed=true;
  for(var e:groups.entrySet()){
   BigDecimal subtotal=sum(e.getValue());Freight f=freight.get(e.getKey());BigDecimal fee=f==null?null:f.delivery(),minimum=f==null?null:f.minimumOrder();
   if(fee==null)known=false;else delivery=delivery.add(fee);
   minimumConfirmed&=minimum!=null;boolean meets=minimum==null||subtotal.compareTo(minimum)>=0;minimumMet&=meets;
   var row=new LinkedHashMap<String,Object>();row.put("supplierId",e.getKey());row.put("supplier",e.getValue().getFirst().get("supplier"));row.put("goods",subtotal);row.put("delivery",fee);row.put("minimumOrder",minimum);row.put("minimumMet",meets);suppliers.add(row);
  }
  var result=new LinkedHashMap<String,Object>();result.put("goods",goods);result.put("knownDelivery",delivery);result.put("total",known&&!groups.isEmpty()?goods.add(delivery):null);result.put("deliveryConfirmed",known&&!groups.isEmpty());result.put("minimumMet",minimumMet);result.put("minimumConfirmed",minimumConfirmed);result.put("complete",chosen.size()==requested&&known&&minimumMet&&minimumConfirmed);result.put("covered",chosen.size());result.put("requested",requested);result.put("suppliers",suppliers);return result;
 }
 @PostMapping("/comparison-plan") @Transactional(readOnly=true) Map<String,Object> compare(@Valid @RequestBody Plan plan){
  var ids=plan.items().stream().map(Need::productId).toList();if(new HashSet<>(ids).size()!=ids.size())throw bad("List each product once and combine its requested quantity.");
  var freight=new HashMap<Long,Freight>();for(var f:plan.freight())if(freight.put(f.supplierId(),f)!=null)throw bad("Enter delivery once per supplier.");
  String marks=String.join(",",Collections.nCopies(ids.size(),"?"));
  var catalogue=db.queryForList("select id,name,ordering_unit,selling_price,price_includes_vat,vat_rate,updated_at from product where active=true and id in ("+marks+")",ids.toArray());
  if(catalogue.size()!=ids.size())throw bad("A requested product is no longer active.");
  var raw=db.queryForList("select l.*,q.supplier_id,s.name supplier,q.reference,q.quote_date,q.valid_until,q.delivery_notes,q.terms from supplier_quote_line l join supplier_quote q on q.id=l.quote_id join supplier s on s.id=q.supplier_id where l.product_id in ("+marks+") order by q.quote_date desc,l.id desc",ids.toArray());
  var columns=new LinkedHashMap<Long,Map<String,Object>>();var output=new ArrayList<Map<String,Object>>();var selected=new ArrayList<Map<String,Object>>();
  for(var need:plan.items()){
   var p=catalogue.stream().filter(x->number(x.get("id"))==need.productId()).findFirst().orElseThrow();
   var offers=new ArrayList<Map<String,Object>>();
   for(var source:raw){if(number(source.get("product_id"))!=need.productId())continue;var o=new LinkedHashMap<>(source);long units=number(o.get("units_per_pack")),packs=(need.quantity()+units-1)/units;BigDecimal pack=decimal(o.get("pack_price_ex_vat"));
    o.put("packsNeeded",packs);o.put("suppliedUnits",packs*units);o.put("extraUnits",packs*units-need.quantity());o.put("purchaseCost",pack.multiply(BigDecimal.valueOf(packs)));o.put("unitCost",pack.divide(BigDecimal.valueOf(units),4,RoundingMode.HALF_UP));
    boolean expired=o.get("valid_until")!=null&&((java.sql.Date)o.get("valid_until")).toLocalDate().isBefore(LocalDate.now());o.put("expired",expired);o.put("validityUnconfirmed",o.get("valid_until")==null);offers.add(o);
    long supplier=number(o.get("supplier_id"));columns.putIfAbsent(supplier,Map.of("id",supplier,"name",o.get("supplier")));
   }
   BigDecimal best=offers.stream().filter(o->!Boolean.TRUE.equals(o.get("expired"))&&o.get("match_type").equals("exact")).map(o->decimal(o.get("purchaseCost"))).min(BigDecimal::compareTo).orElse(null);
   for(var o:offers)o.put("lowestExactCost",best!=null&&!Boolean.TRUE.equals(o.get("expired"))&&o.get("match_type").equals("exact")&&decimal(o.get("purchaseCost")).compareTo(best)==0);
   if(need.lineId()!=null){var choice=offers.stream().filter(o->number(o.get("id"))==need.lineId()).findFirst().orElseThrow(()->bad("A selected supplier line does not match its product."));if(Boolean.TRUE.equals(choice.get("expired")))throw bad("Remove an expired supplier selection before comparing.");selected.add(choice);}
   var row=new LinkedHashMap<String,Object>();row.put("productId",need.productId());row.put("name",p.get("name"));row.put("orderingUnit",p.get("ordering_unit"));row.put("quantity",need.quantity());row.put("currentPrice",p.get("selling_price"));row.put("currentIncludesVat",p.get("price_includes_vat"));row.put("currentVatRate",p.get("vat_rate"));row.put("updatedAt",((java.sql.Timestamp)p.get("updated_at")).toInstant());row.put("selectedLineId",need.lineId());row.put("offers",offers);output.add(row);
  }
  var scenarios=new ArrayList<Map<String,Object>>();
  for(long supplier:columns.keySet()){
   var choices=new ArrayList<Map<String,Object>>();
   for(var row:output){@SuppressWarnings("unchecked") var offers=(List<Map<String,Object>>)row.get("offers");offers.stream().filter(o->number(o.get("supplier_id"))==supplier&&!Boolean.TRUE.equals(o.get("expired"))&&o.get("match_type").equals("exact")).min(Comparator.comparing(o->decimal(o.get("purchaseCost")))).ifPresent(choices::add);}
   var scenario=new LinkedHashMap<>(totals(choices,freight,plan.items().size()));scenario.put("supplierId",supplier);scenario.put("supplier",columns.get(supplier).get("name"));scenarios.add(scenario);
  }
  // Allocate entered delivery proportionally across purchased goods, not requested units.
  for(var row:output){var choice=selected.stream().filter(o->number(o.get("product_id"))==number(row.get("productId"))).findFirst().orElse(null);if(choice==null)continue;var f=freight.get(number(choice.get("supplier_id")));BigDecimal allocated=null;
   if(f!=null&&f.delivery()!=null){var group=selected.stream().filter(o->number(o.get("supplier_id"))==number(choice.get("supplier_id"))).toList();BigDecimal subtotal=sum(group);allocated=subtotal.signum()==0?f.delivery().divide(BigDecimal.valueOf(group.stream().mapToLong(o->number(o.get("suppliedUnits"))).sum()),4,RoundingMode.HALF_UP):f.delivery().multiply(decimal(choice.get("purchaseCost"))).divide(subtotal,10,RoundingMode.HALF_UP).divide(BigDecimal.valueOf(number(choice.get("suppliedUnits"))),4,RoundingMode.HALF_UP);}
   row.put("deliveryPerSellingUnit",allocated);
  }
  return Map.of("items",output,"suppliers",columns.values(),"selected",totals(selected,freight,plan.items().size()),"singleSupplierScenarios",scenarios);
 }
 @PostMapping("/approve-prices") @Transactional Map<String,Object> approve(@Valid @RequestBody Batch batch,Principal principal){
  var ordered=batch.items().stream().sorted(Comparator.comparingLong(Approval::productId)).toList();
  if(ordered.stream().map(Approval::productId).distinct().count()!=ordered.size())throw bad("Approve each product only once.");
  for(var row:ordered){var timestamps=db.query("select updated_at from product where id=? and active=true for update",(rs,n)->rs.getTimestamp(1).toInstant(),row.productId());if(timestamps.isEmpty()||!timestamps.getFirst().equals(row.expectedUpdatedAt()))throw new ResponseStatusException(HttpStatus.CONFLICT,"A product price changed. Refresh the comparison and review again.");}
  for(var row:ordered)supply.approve(row.productId(),row.price(),principal);
  return Map.of("approved",ordered.size());
 }
}
