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
}
