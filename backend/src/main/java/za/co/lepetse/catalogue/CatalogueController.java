package za.co.lepetse.catalogue;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/catalogue/products")
public class CatalogueController {
    private final ProductRepository products;

    public CatalogueController(ProductRepository products) { this.products = products; }

    @GetMapping
    @Transactional(readOnly = true)
    public CataloguePage list(@RequestParam(defaultValue = "0") @Min(0) int page,
                              @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
                              @RequestParam(required = false) @Min(1) Long categoryId) {
        var result = products.findCatalogue(categoryId, PageRequest.of(page, size, Sort.by("name", "id")));
        return new CataloguePage(result.getContent().stream().map(ProductView::from).toList(),
                result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }

    public record CataloguePage(List<ProductView> items, int page, int size, long totalItems, int totalPages) {}
    public record ProductView(Long id, String legacyId, String sku, String name, String description,
                              Long brandId, Long categoryId, String orderingUnit, Integer packQuantity,
                              Map<String, Object> specifications, boolean checkoutEnabled,
                              BigDecimal sellingPrice, String currency, Boolean priceIncludesVat) {
        static ProductView from(Product p) {
            return new ProductView(p.id, p.legacyId, p.sku, p.name, p.description, p.brandId, p.categoryId,
                    p.orderingUnit, p.packQuantity, p.specifications, p.checkoutEnabled,
                    p.checkoutEnabled ? p.sellingPrice : null, p.currency,
                    p.checkoutEnabled ? p.priceIncludesVat : null);
        }
    }
}
