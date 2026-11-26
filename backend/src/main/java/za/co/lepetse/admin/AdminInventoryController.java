package za.co.lepetse.admin;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.security.Principal;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
@RestController
@RequestMapping("/api/admin/supply/inventory")
public class AdminInventoryController {
 private final JdbcTemplate db;
 public AdminInventoryController(JdbcTemplate db){this.db=db;}
 record Change(@NotNull UUID submissionKey,@NotBlank @Pattern(regexp="opening|receive|dispatch|adjust|reserve|release") String type,@NotNull @DecimalMin("-999999999") @DecimalMax("999999999") @Digits(integer=9,fraction=0) BigDecimal quantity,boolean fromReserved,@NotNull @Size(max=200) String reference,@NotBlank @Size(max=1000) String reason){}
 @GetMapping List<Map<String,Object>> list(){return db.queryForList("select p.id,p.name,p.sku,p.legacy_id,b.name brand,p.ordering_unit,case when i.initialized then i.on_hand end on_hand,case when i.initialized then i.reserved end reserved,case when i.initialized then i.on_hand-i.reserved end available,i.updated_at from product p left join brand b on b.id=p.brand_id left join inventory_balance i on i.product_id=p.id where p.active order by p.name");}
 void requireProduct(long id){if(db.queryForObject("select count(*) from product where id=? and active",Integer.class,id)!=1)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Active product not found.");}
 @GetMapping("/{product}/history") List<Map<String,Object>> history(@PathVariable long product){requireProduct(product);return db.queryForList("select id,movement_type,quantity,from_reserved,on_hand_delta,reserved_delta,balance_after,reserved_after,reference,reason,actor,created_at from inventory_movement where product_id=? order by id desc limit 100",product);}
 @PostMapping("/{product}/movements") @Transactional Map<String,Object> change(@PathVariable long product,@Valid @RequestBody Change c,Principal actor){
  long quantity=c.quantity().longValueExact();requireProduct(product);db.queryForList("select pg_advisory_xact_lock(hashtextextended(?,0))",c.submissionKey().toString());
  var previous=db.queryForList("select * from inventory_movement where submission_key=?",c.submissionKey());
  if(!previous.isEmpty()){var p=previous.getFirst();if(((Number)p.get("product_id")).longValue()!=product||!p.get("movement_type").equals(c.type())||((Number)p.get("quantity")).longValue()!=quantity||!p.get("from_reserved").equals(c.fromReserved())||!p.get("reference").equals(c.reference().trim())||!p.get("reason").equals(c.reason().trim()))throw new ResponseStatusException(HttpStatus.CONFLICT,"This stock entry has changed. Review and submit it again.");return Map.of("saved",true,"onHand",p.get("balance_after"),"reserved",p.get("reserved_after"));}
  if(!c.type().equals("dispatch")&&c.fromReserved())throw bad("Reserved-stock dispatch applies only to dispatch entries.");
  if(c.type().equals("opening")?quantity<0:c.type().equals("adjust")?quantity==0:quantity<=0)throw bad("Enter a valid whole quantity. Adjustments use a positive or negative change.");
  db.update("insert into inventory_balance(product_id) values (?) on conflict do nothing",product);
  var balance=db.queryForMap("select * from inventory_balance where product_id=? for update",product);
  long on=((Number)balance.get("on_hand")).longValue(),reserved=((Number)balance.get("reserved")).longValue(),delta=0,hold=0;
  if(c.type().equals("opening")){if(Boolean.TRUE.equals(balance.get("initialized")))throw bad("Opening stock is already recorded. Use an adjustment to correct it.");delta=quantity;}
  else if(c.type().equals("receive"))delta=quantity;
  else {if(!Boolean.TRUE.equals(balance.get("initialized")))throw bad("Record opening stock or receive stock first.");switch(c.type()){
   case "adjust" -> delta=quantity;
   case "reserve" -> hold=quantity;
   case "release" -> hold=-quantity;
   case "dispatch" -> {delta=-quantity;if(c.fromReserved())hold=-quantity;else if(quantity>on-reserved)throw bad("Not enough available stock. Reserved stock must be dispatched as reserved stock.");}
  }}
  long nextOn=on+delta,nextReserved=reserved+hold;
  if(nextOn<0||nextOn>999999999||nextReserved<0||nextReserved>nextOn)throw bad("This entry exceeds the stock available or reserved. Review the quantity.");
  db.update("update inventory_balance set on_hand=?,reserved=?,initialized=true,updated_at=now() where product_id=?",nextOn,nextReserved,product);
  db.update("insert into inventory_movement(submission_key,product_id,movement_type,quantity,from_reserved,on_hand_delta,reserved_delta,balance_after,reserved_after,reference,reason,actor) values (?,?,?,?,?,?,?,?,?,?,?,?)",c.submissionKey(),product,c.type(),quantity,c.fromReserved(),delta,hold,nextOn,nextReserved,c.reference().trim(),c.reason().trim(),actor.getName());
  return Map.of("saved",true,"onHand",nextOn,"reserved",nextReserved,"available",nextOn-nextReserved);
 }
 ResponseStatusException bad(String message){return new ResponseStatusException(HttpStatus.BAD_REQUEST,message);}
}
