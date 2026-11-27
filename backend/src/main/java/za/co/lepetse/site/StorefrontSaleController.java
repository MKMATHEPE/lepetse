package za.co.lepetse.site;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/storefront-sales")
public class StorefrontSaleController {
    private static final ZoneOffset SAST = ZoneOffset.ofHours(2);
    private final JdbcTemplate jdbc;

    public StorefrontSaleController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping
    public List<Sale> list() {
        return sales(jdbc);
    }

    @PostMapping
    public ResponseEntity<Void> schedule(@RequestBody Schedule input) {
        if (input.productId() == null || input.amountMinor() == null || input.amountMinor() < 1
                || input.startsAt() == null || input.endsAt() == null
                || !input.endsAt().isAfter(input.startsAt())
                || !input.endsAt().isAfter(LocalDateTime.now(SAST))) {
            return ResponseEntity.badRequest().build();
        }
        int saved = jdbc.update("""
            insert into storefront_sale(product_id, amount_minor, starts_at, ends_at)
            select p.id, ?, ?, ?
            from product p
            join lateral (select amount from product_price_reference r where r.product_id = p.id
                order by checked_on desc nulls last, id desc limit 1) regular on true
            where p.active and coalesce(p.legacy_id, 'db-' || p.id) = ? and ? < regular.amount * 100
            on conflict (product_id) do update set amount_minor = excluded.amount_minor,
                starts_at = excluded.starts_at, ends_at = excluded.ends_at
            """, input.amountMinor(), input.startsAt().atOffset(SAST), input.endsAt().atOffset(SAST),
                input.productId(), input.amountMinor());
        return saved == 1 ? ResponseEntity.noContent().build() : ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> remove(@PathVariable("productId") String productId) {
        jdbc.update("""
            delete from storefront_sale using product
            where storefront_sale.product_id = product.id
            and coalesce(product.legacy_id, 'db-' || product.id) = ?
            """, productId);
        return ResponseEntity.noContent().build();
    }

    static List<Sale> sales(JdbcTemplate jdbc) {
        return jdbc.query("""
            select coalesce(p.legacy_id, 'db-' || p.id) as product_key,
                s.amount_minor, s.starts_at, s.ends_at
            from storefront_sale s join product p on p.id = s.product_id
            where p.active and s.ends_at > current_timestamp
            order by s.starts_at, p.id
            """, (row, index) -> new Sale(row.getString("product_key"), row.getLong("amount_minor"),
                row.getObject("starts_at", OffsetDateTime.class), row.getObject("ends_at", OffsetDateTime.class)));
    }

    public record Schedule(String productId, Long amountMinor, LocalDateTime startsAt, LocalDateTime endsAt) {}
    public record Sale(String productId, long amountMinor, OffsetDateTime startsAt, OffsetDateTime endsAt) {}
}
