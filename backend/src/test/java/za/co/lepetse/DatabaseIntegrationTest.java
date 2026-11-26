package za.co.lepetse;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@EnabledIfEnvironmentVariable(named = "LEPETSE_DB_TEST", matches = "true")
class DatabaseIntegrationTest {
    @Autowired JdbcTemplate jdbc;
    @Autowired MockMvc http;

    private long category() {
        return jdbc.queryForObject("insert into category(code,name) values ('test-paper','Paper') returning id", Long.class);
    }

    @Test void migratedCatalogueReturnsOnlyActiveProductsAndApprovedPrices() throws Exception {
        long category = category();
        jdbc.update("insert into product(name,category_id,ordering_unit,selling_price) values ('A reference only',?,'Each',79.90)", category);
        jdbc.update("insert into product(name,category_id,ordering_unit,checkout_enabled,selling_price,price_includes_vat,vat_rate) values ('B approved',?,'Ream',true,85.00,true,0.15)", category);
        jdbc.update("insert into product(name,category_id,ordering_unit,active) values ('C inactive',?,'Each',false)", category);
        http.perform(get("/api/catalogue/products").param("categoryId", Long.toString(category)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalItems").value(2))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.items[0].name").value("A reference only"))
                .andExpect(jsonPath("$.items[0].sellingPrice").isEmpty())
                .andExpect(jsonPath("$.items[1].sellingPrice").value(85.00));
        http.perform(get("/api/catalogue/products").param("size", "101")).andExpect(status().isBadRequest());
        http.perform(get("/api/catalogue/products").param("page", "-1")).andExpect(status().isBadRequest());
        assertThat(jdbc.queryForObject("select count(*) from flyway_schema_history where success", Integer.class)).isEqualTo(9);
    }

    @Test void checkoutCannotBeEnabledWithoutAnApprovedPrice() {
        long category = category();
        assertThatThrownBy(() -> jdbc.update("insert into product(name,category_id,ordering_unit,checkout_enabled) values ('Unpriced',?,'Each',true)", category))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test void websiteReadsDatabaseProductsAndSchoolLists() throws Exception {
        jdbc.update("update product set name='Database supplied paper' where legacy_id='waltons-801215'");
        http.perform(get("/api/site-data"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.schemaVersion").value(1))
                .andExpect(jsonPath("$.products.length()").value(256))
                .andExpect(jsonPath("$.products[0].name").value("Database supplied paper"))
                .andExpect(jsonPath("$.schools.length()").value(2));
        http.perform(get("/api/schools"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("curro-serengeti"))
                .andExpect(jsonPath("$[0].lists.length()").value(5));
        http.perform(get("/runtime-config.js"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("dataSource:'api'")));
        http.perform(get("/index.html"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("backend-bridge.js")));
    }

    @Test void rfqRejectsUnknownBuyerTypes() {
        long customer = jdbc.queryForObject("insert into customer(contact_name,email,phone) values ('Test','test@example.invalid','000') returning id", Long.class);
        assertThatThrownBy(() -> jdbc.update("insert into rfq(reference,customer_id,buyer_type,purchase_type,contact_snapshot) values ('TEST',?,'personal','once_off','{}')", customer))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test void importedDataIsCompleteAndReplayingDoesNotDuplicateOrOverwriteApprovedPrices() {
        assertThat(jdbc.queryForObject("select count(*) from product where active", Integer.class)).isEqualTo(256);
        assertThat(jdbc.queryForObject("select count(*) from product", Integer.class)).isEqualTo(489);
        assertThat(jdbc.queryForObject("select count(*) from school", Integer.class)).isEqualTo(2);
        assertThat(jdbc.queryForObject("select count(*) from school_list", Integer.class)).isEqualTo(13);
        assertThat(jdbc.queryForObject("select count(*) from school_list_item", Integer.class)).isEqualTo(422);
        assertThat(jdbc.queryForObject("select count(*) from product_price_reference", Integer.class)).isEqualTo(62);
        assertThat(jdbc.queryForObject("select count(*) from product where checkout_enabled or selling_price is not null", Integer.class)).isZero();
        assertThat(jdbc.queryForObject("select count(*) from school_list l join school s on s.id=l.school_id where s.slug='glenanda-primary' and academic_year is null", Integer.class)).isEqualTo(8);
        assertThat(jdbc.queryForObject("select count(*) from school_list_item i join school_list l on l.id=i.school_list_id where l.grade='12' and i.subject='English Home Language' and i.reuse_existing", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("select conversion_supplied from school_list_item i join school_list l on l.id=i.school_list_id where l.grade='R' and i.source_key='glenanda-27'", Integer.class)).isEqualTo(12);
        assertThat(jdbc.queryForObject("select count(*) from school_list_item where quantity_per_learner is null", Integer.class)).isPositive();
        jdbc.update("update product set selling_price=123.45, price_includes_vat=true, vat_rate=0.15, checkout_enabled=true where legacy_id='waltons-801215'");
        int images=jdbc.queryForObject("select count(*) from product_image",Integer.class);
        int sources=jdbc.queryForObject("select count(*) from supplier_product",Integer.class);
        jdbc.execute((ConnectionCallback<Void>) connection -> {
            ScriptUtils.executeSqlScript(connection, new ClassPathResource("db/migration/V3__import_prototype_catalogue_and_schools.sql"));
            return null;
        });
        assertThat(jdbc.queryForObject("select count(*) from product",Integer.class)).isEqualTo(489);
        assertThat(jdbc.queryForObject("select count(*) from school_list_item",Integer.class)).isEqualTo(422);
        assertThat(jdbc.queryForObject("select count(*) from product_image",Integer.class)).isEqualTo(images);
        assertThat(jdbc.queryForObject("select count(*) from supplier_product",Integer.class)).isEqualTo(sources);
        assertThat(jdbc.queryForObject("select selling_price from product where legacy_id='waltons-801215'",java.math.BigDecimal.class)).isEqualByComparingTo("123.45");
    }
}
