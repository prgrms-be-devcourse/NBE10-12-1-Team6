package com.back.domain.product.product.service;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
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

    public Optional<Product> findById(int id) {
        return productRepository.findById(id);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public void modify(Product product, String name, int price, String description, String imageUrl) {
        product.modify(name, price, description, imageUrl);
    }

    public void delete(Product product) {
        productRepository.delete(product);
    }
}
