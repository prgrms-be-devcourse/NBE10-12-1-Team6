package com.back.domain.product.product.service;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public long count() {
        return productRepository.count();
    }

    public Product create(String name, int price, String description, String imageUrl) {
        Product product = new Product(name, price, description, imageUrl);

        return productRepository.save(product);
    }

    public Optional<Product> findById(long id) {
        return productRepository.findById(id);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Page<Product> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    public void modify(Product product, String name, int price, String description, String imageUrl) {
        product.modify(name, price, description, imageUrl);
    }

    public void delete(Product product) {
        productRepository.delete(product);
    }

    public Page<Product> findByNameContainingOrDescriptionContaining(String searchTerm, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingOrDescriptionContaining(searchTerm, searchTerm, pageable);
    }
}
