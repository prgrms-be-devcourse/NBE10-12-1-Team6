package com.back.domain.order.order.controller;

import com.back.domain.order.order.dto.OrderDto;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.service.OrderService;
import com.back.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class ApiV1OrderController {

    private final OrderService orderService;

    // 1. 입력용 ReqBody (검증용 벨리데이션 포함)
    public record OrderCreateReqBody(
            @NotBlank(message = "이메일은 필수 입력 항목입니다.")
            @Email(message = "올바른 이메일 형식이 아닙니다.")
            String email,

            @NotBlank(message = "기본 주소는 필수 입력 항목입니다.")
            String address1,

            @NotBlank(message = "상세 주소는 필수 입력 항목입니다.")
            String address2,

            @NotBlank(message = "우편번호는 필수 입력 항목입니다.")
            String zipCode,

            @NotEmpty(message = "주문 상품 목록은 비어 있을 수 없습니다.")
            List<OrderItemReq> orderItems
    ) {
        public record OrderItemReq(
                @NotNull(message = "상품 번호는 필수입니다.")
                Long productId,

                @Min(value = 1, message = "수량은 최소 1개 이상이어야 합니다.")
                int quantity
        ) {}
    }
    /**
     * POST /api/v1/orders
     * 주문을 생성하고, 결과를 출력용 OrderDto로 가공하여 RsData 규격으로 반환합니다.
     */
    @PostMapping
    @Operation(summary = "주문 생성")
    public RsData<OrderDto> createOrder(@RequestBody @Valid OrderCreateReqBody reqBody) {
        Order order = orderService.createOrder(reqBody);

        // 결과 엔티티(Order)를 출력용 DTO(OrderDto)로 변환하여 RsData로 반환
        return new RsData<>(
                "200-1",
                "%d번 주문이 완료되었습니다.".formatted(order.getId()),
                new OrderDto(order)
        );
    }
}