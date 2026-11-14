package za.co.lepetse.catalogue;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("select p from Product p where p.active = true and (:category is null or p.categoryId = :category)")
    Page<Product> findCatalogue(@Param("category") Long category, Pageable pageable);
}
