package com.back.domain.product.product.repository;

import com.back.domain.product.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    public Page<Product> findByNameContainingOrDescriptionContaining(
            String searchTerm1, String searchTerm2, Pageable pageable);
}
