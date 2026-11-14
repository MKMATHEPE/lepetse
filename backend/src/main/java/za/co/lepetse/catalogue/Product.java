package za.co.lepetse.catalogue;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Map;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "product")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String legacyId;
    String sku;
    String name;
    String description;
    Long brandId;
    Long categoryId;
    String orderingUnit;
    Integer packQuantity;
    @JdbcTypeCode(SqlTypes.JSON)
    Map<String, Object> specifications;
    boolean active;
    boolean checkoutEnabled;
    @Column(precision = 14, scale = 2)
    BigDecimal sellingPrice;
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 3, columnDefinition = "char(3)")
    String currency;
    Boolean priceIncludesVat;
    @Column(precision = 5, scale = 4)
    BigDecimal vatRate;

    protected Product() {}
}
