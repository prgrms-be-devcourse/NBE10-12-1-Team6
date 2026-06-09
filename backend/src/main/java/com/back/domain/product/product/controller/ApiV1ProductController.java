package com.back.domain.product.product.controller;

import com.back.domain.product.product.dto.ProductDto;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
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
            @NotBlank(message = "상품명을 입력해주세요.")
            @Size(min = 2, message = "제목은 두 글자 이상 입력해주세요.")
            String name,
            @Min(value = 2, message = "가격은 2원 이상으로 입력해주세요.")
            int price,
            @NotBlank(message = "상품설명을 입력해주세요.")
            @Size(min = 2, message = "상품설명은 두 글자 이상 입력해주세요.")
            String description,
            @NotBlank(message = "상품 이미지를 업로드하거나 이미지 URL을 입력해주세요.")
            String imageUrl
    ) {}

    @PostMapping
    @Transactional
    @Operation(summary = "상품 등록")
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
    @Operation(summary = "상품 목록 조회")
    public List<ProductDto> getItems() {
        List<Product> items = productService.findAll();

        return items
                .stream()
                .map(ProductDto::new)
                .toList();
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    @Operation(summary = "상품 상세 조회")
    public ProductDto getItem(@PathVariable long id) {
        Product product = productService.findById(id).get();

        return new ProductDto(product);
    }

    public record ProductModifyReqBody(
            @NotBlank(message = "상품명을 입력해주세요.")
            @Size(min = 2, message = "제목은 두 글자 이상 입력해주세요.")
            String name,
            @Min(value = 2, message = "가격은 2원 이상으로 입력해주세요.")
            int price,
            @NotBlank(message = "상품설명을 입력해주세요.")
            @Size(min = 2, message = "상품설명은 두 글자 이상 입력해주세요.")
            String description,
            @NotBlank(message = "상품 이미지를 업로드하거나 이미지 URL을 입력해주세요.")
            String imageUrl
    ) {}

    @PutMapping("/{id}")
    @Transactional
    @Operation(summary = "상품 수정")
    public RsData<Void> modify(
            @PathVariable long id,
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
    @Operation(summary = "상품 삭제")
    public RsData<Void> delete(@PathVariable long id) {
        Product product = productService.findById(id).get();

        productService.delete(product);

        return new RsData<>(
                "200-1",
                "%d번 상품이 삭제되었습니다.".formatted(id)
        );
    }
}
