package za.co.lepetse.site;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import org.springframework.jdbc.support.SqlArrayValue;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StorefrontThemeController {
    private final JdbcTemplate jdbc;

    public StorefrontThemeController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/api/admin/storefront-theme")
    public ThemeStatus current() {
        return jdbc.queryForObject(
            "select theme, rotate_catalogue_banner, show_footer_whatsapp, featured_product_ids, applied_by, applied_at from storefront_settings where singleton",
            (row, index) -> status(row));
    }

    @PostMapping("/api/admin/storefront-theme")
    public ResponseEntity<ThemeStatus> update(@RequestBody Theme selection, Principal principal) {
        String theme = selection.theme();
        if (!"classic".equals(theme) && !"charcoal".equals(theme)) {
            return ResponseEntity.badRequest().build();
        }
        var ids = selection.featuredProductIds();
        if (ids != null && (ids.size() > 12
                || ids.stream().anyMatch(id -> id == null || id.isBlank() || id.length() > 200)
                || ids.stream().distinct().count() != ids.size()
                || jdbc.queryForObject("""
                    select count(*) from product where active
                    and coalesce(legacy_id, 'db-' || id) = any(?)
                    """, Long.class, productArray(ids)) != ids.size())) {
            return ResponseEntity.badRequest().build();
        }
        var updated = jdbc.query("""
            update storefront_settings
            set theme = ?, rotate_catalogue_banner = coalesce(?, rotate_catalogue_banner),
                show_footer_whatsapp = coalesce(?, show_footer_whatsapp),
                featured_product_ids = coalesce(?, featured_product_ids),
                applied_by = ?, applied_at = current_timestamp
            where singleton and (theme <> ?
                or rotate_catalogue_banner <> coalesce(?, rotate_catalogue_banner)
                or show_footer_whatsapp <> coalesce(?, show_footer_whatsapp)
                or featured_product_ids <> coalesce(?, featured_product_ids))
            returning theme, rotate_catalogue_banner, show_footer_whatsapp, featured_product_ids, applied_by, applied_at
            """, (row, index) -> status(row), theme, selection.rotateCatalogueBanner(),
                selection.showFooterWhatsApp(), productArray(ids), principal.getName(), theme,
                selection.rotateCatalogueBanner(), selection.showFooterWhatsApp(), productArray(ids));
        return ResponseEntity.ok(updated.isEmpty() ? current() : updated.getFirst());
    }

    static DisplaySettings read(JdbcTemplate jdbc) {
        return jdbc.queryForObject(
            "select theme, rotate_catalogue_banner, show_footer_whatsapp, featured_product_ids from storefront_settings where singleton",
            (row, index) -> new DisplaySettings(row.getString("theme"),
                row.getBoolean("rotate_catalogue_banner"), row.getBoolean("show_footer_whatsapp"), featuredIds(row)));
    }

    private static ThemeStatus status(ResultSet row) throws SQLException {
        return new ThemeStatus(row.getString("theme"), row.getBoolean("rotate_catalogue_banner"),
            row.getBoolean("show_footer_whatsapp"), featuredIds(row), row.getString("applied_by"),
            row.getObject("applied_at", OffsetDateTime.class));
    }

    private static List<String> featuredIds(ResultSet row) throws SQLException {
        return List.of((String[]) row.getArray("featured_product_ids").getArray());
    }

    private static SqlArrayValue productArray(List<String> ids) {
        return ids == null ? null : new SqlArrayValue("text", ids.toArray());
    }

    record DisplaySettings(String theme, boolean rotateCatalogueBanner, boolean showFooterWhatsApp,
                           List<String> featuredProductIds) {}

    public record Theme(String theme, Boolean rotateCatalogueBanner, Boolean showFooterWhatsApp,
                        List<String> featuredProductIds) {}

    public record ThemeStatus(String theme, boolean rotateCatalogueBanner, boolean showFooterWhatsApp,
                              List<String> featuredProductIds, String appliedBy, OffsetDateTime appliedAt) {}
}
