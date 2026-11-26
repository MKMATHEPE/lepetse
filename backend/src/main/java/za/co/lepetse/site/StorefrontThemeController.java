package za.co.lepetse.site;

import java.security.Principal;
import java.time.OffsetDateTime;
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
            "select theme, rotate_catalogue_banner, show_footer_whatsapp, applied_by, applied_at from storefront_settings where singleton",
            (row, index) -> new ThemeStatus(row.getString("theme"), row.getBoolean("rotate_catalogue_banner"),
                row.getBoolean("show_footer_whatsapp"), row.getString("applied_by"),
                row.getObject("applied_at", OffsetDateTime.class)));
    }

    @PostMapping("/api/admin/storefront-theme")
    public ResponseEntity<ThemeStatus> update(@RequestBody Theme selection, Principal principal) {
        String theme = selection.theme();
        if (!"classic".equals(theme) && !"charcoal".equals(theme)) {
            return ResponseEntity.badRequest().build();
        }
        var updated = jdbc.query("""
            update storefront_settings
            set theme = ?, rotate_catalogue_banner = coalesce(?, rotate_catalogue_banner),
                show_footer_whatsapp = coalesce(?, show_footer_whatsapp),
                applied_by = ?, applied_at = current_timestamp
            where singleton and (theme <> ?
                or rotate_catalogue_banner <> coalesce(?, rotate_catalogue_banner)
                or show_footer_whatsapp <> coalesce(?, show_footer_whatsapp))
            returning theme, rotate_catalogue_banner, show_footer_whatsapp, applied_by, applied_at
            """, (row, index) -> new ThemeStatus(row.getString("theme"), row.getBoolean("rotate_catalogue_banner"),
                row.getBoolean("show_footer_whatsapp"), row.getString("applied_by"),
                row.getObject("applied_at", OffsetDateTime.class)), theme, selection.rotateCatalogueBanner(),
                selection.showFooterWhatsApp(), principal.getName(), theme,
                selection.rotateCatalogueBanner(), selection.showFooterWhatsApp());
        return ResponseEntity.ok(updated.isEmpty() ? current() : updated.getFirst());
    }

    static DisplaySettings read(JdbcTemplate jdbc) {
        return jdbc.queryForObject(
            "select theme, rotate_catalogue_banner, show_footer_whatsapp from storefront_settings where singleton",
            (row, index) -> new DisplaySettings(row.getString("theme"),
                row.getBoolean("rotate_catalogue_banner"), row.getBoolean("show_footer_whatsapp")));
    }

    record DisplaySettings(String theme, boolean rotateCatalogueBanner, boolean showFooterWhatsApp) {}

    public record Theme(String theme, Boolean rotateCatalogueBanner, Boolean showFooterWhatsApp) {}

    public record ThemeStatus(String theme, boolean rotateCatalogueBanner, boolean showFooterWhatsApp,
                              String appliedBy, OffsetDateTime appliedAt) {}
}
