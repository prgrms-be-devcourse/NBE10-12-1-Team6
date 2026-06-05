package com.back.domain.product.product.controller;

import com.back.domain.product.product.dto.ProductDto;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.global.rsData.RsData;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ApiV1ProductController {
    @Autowired
    private final ProductService productService;

    public record ProductCreateReqBody(
            @NotBlank
            @Size(min = 2)
            String name,
            @Min(2)
            int price,
            @NotBlank
            @Size(min = 2)
            String description,
            String imageUrl
    ) {}

    @PostMapping
    @Transactional
    public RsData<ProductDto> create(
            @RequestBody @Valid ProductCreateReqBody reqBody
    ) {
        Product product = productService.create(reqBody.name, reqBody.price, reqBody.description, reqBody.imageUrl);

        return new RsData<>(
                "201-1",
                "%d번 상품이 등록되었습니다.".formatted(product.getId()),
                new ProductDto(product)
        );
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<ProductDto> getItems() {
        List<Product> items = productService.findAll();

        return items
                .stream()
                .map(ProductDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ProductDto getItem(@PathVariable int id) {
        Product product = productService.findById(id).get();

        return new ProductDto(product);
    }

    public record ProductModifyReqBody(
            @NotBlank
            @Size(min = 2)
            String name,
            @Min(2)
            int price,
            @NotBlank
            @Size(min = 2)
            String description,
            String imageUrl
    ) {}

    @PutMapping("/{id}")
    @Transactional
    public RsData<Void> modify(
            @PathVariable int id,
            @RequestBody @Valid ProductModifyReqBody reqBody
    ) {
        Product product = productService.findById(id).get();

        productService.modify(product, reqBody.name, reqBody.price, reqBody.description, reqBody.imageUrl);

        return new RsData<>(
                "200-1",
                "%d번 상품이 수정되었습니다.".formatted(product.getId())
        );
    }

    @DeleteMapping("/{id}")
    @Transactional
    public RsData<Void> delete(@PathVariable int id) {
        Product product = productService.findById(id).get();

        productService.delete(product);

        return new RsData<>(
                "200-1",
                "%d번 상품이 삭제되었습니다.".formatted(id)
        );
    }
}
