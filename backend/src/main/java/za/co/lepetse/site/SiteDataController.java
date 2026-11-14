package za.co.lepetse.site;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

/** Read-only bridge for the existing prototype. Never returns customer or order data. */
@RestController
public class SiteDataController {
    private final JdbcTemplate jdbc;
    private final ObjectMapper mapper;
    public SiteDataController(JdbcTemplate jdbc, ObjectMapper mapper) {
        this.jdbc=jdbc;
        this.mapper=mapper;
    }

    @GetMapping(value="/runtime-config.js", produces="application/javascript")
    public String runtimeConfig() {
        return "window.LEPETSE_CONFIG={dataSource:'api',apiBase:''};";
    }

    private Map<String,Object> json(Object value) {
        try { return mapper.readValue(value.toString(), new TypeReference<LinkedHashMap<String,Object>>() {}); }
        catch (Exception e) { throw new IllegalStateException("Invalid stored source data",e); }
    }

    @GetMapping(value="/api/schools", produces=MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly=true, isolation=org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public List<Map<String,Object>> schools() {
        var schools=jdbc.queryForList("select id,slug,name from school where active order by name");
        for (var school:schools) {
            var lists=jdbc.queryForList("select id,grade,academic_year,version,source_document from school_list where school_id=? and status='published' order by academic_year desc nulls last,version desc,id",school.get("id"));
            // Only the most recent published version per grade is shown to a buyer.
            var seen=new HashSet<String>();
            lists.removeIf(l->!seen.add(l.get("grade").toString()));
            for (var list:lists) list.put("items",jdbc.queryForList("select source_key,subject,requested_description,quantity_per_learner,requested_unit,p.legacy_id as proposed_product_id,replacement_notes,optional,reuse_existing,conversion_required,conversion_supplied,i.source_snapshot from school_list_item i left join product p on p.id=i.proposed_product_id where school_list_id=? order by display_order,i.id",list.get("id")));
            // Convert PostgreSQL jsonb values to JSON objects rather than JDBC wrappers.
            for (var list:lists) for (var row:items(list)) row.put("source_snapshot",json(row.get("source_snapshot")));
            school.put("lists",lists);
        }
        return schools;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String,Object>> items(Map<String,Object> list) {return (List<Map<String,Object>>)list.get("items");}

    @GetMapping(value="/api/site-data", produces=MediaType.APPLICATION_JSON_VALUE)
    @Transactional(readOnly=true, isolation=org.springframework.transaction.annotation.Isolation.REPEATABLE_READ)
    public Map<String,Object> siteData() {
        var active=new ArrayList<Map<String,Object>>();
        var retired=new ArrayList<Map<String,Object>>();
        var images=new HashMap<Long,Map<String,Object>>();
        for (var image:jdbc.queryForList("select product_id,asset_path,match_status from product_image order by display_order,id")) images.putIfAbsent(((Number)image.get("product_id")).longValue(),image);
        for (var row:jdbc.queryForList("select p.*,b.name as brand_name,c.code as category_code from product p left join brand b on b.id=p.brand_id join category c on c.id=p.category_id order by p.id")) {
            var p=json(row.get("source_snapshot"));
            p.put("id",row.get("legacy_id")!=null?row.get("legacy_id"):"db-"+row.get("id"));
            p.put("databaseId",row.get("id"));
            p.put("name",row.get("name")); p.put("summary",Objects.toString(row.get("description"),""));
            p.put("unit",row.get("ordering_unit")); p.put("specs",json(row.get("specifications")));
            p.put("brand",Objects.toString(row.get("brand_name"),"To be confirmed")); p.put("category",row.get("category_code"));
            p.remove("image");
            var image=images.get(((Number)row.get("id")).longValue());
            if (image!=null) {p.put("image",image.get("asset_path")); p.put("imageStatus",image.get("match_status"));}
            (Boolean.TRUE.equals(row.get("active"))?active:retired).add(p);
        }
        var prices=new LinkedHashMap<String,Object>();
        for (var row:jdbc.queryForList("select p.legacy_id,r.* from product_price_reference r join product p on p.id=r.product_id where p.legacy_id is not null order by checked_on nulls first,r.id")) {
            var price=json(row.get("source_snapshot"));
            price.put("amountMinor",((BigDecimal)row.get("amount")).movePointRight(2).longValueExact());
            price.put("retailer",row.get("retailer")); price.put("sourceUrl",row.get("source_url"));
            prices.put(row.get("legacy_id").toString(),price);
        }
        return Map.of("schemaVersion",1,"products",active,"retiredProducts",retired,"priceReferences",prices,"schools",schools());
    }
}
