package com.back.domain.order.order.controller;

import com.back.domain.order.order.dto.OrderDto;
import com.back.domain.order.order.dto.ProductSaleDto;
import com.back.domain.order.order.dto.ProductSalesSumInterface;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderStatus;
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
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class ApiV1OrderController {

    private final OrderService orderService;

    // 주문 생성 입력용 ReqBody
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

    @PostMapping
    @Operation(summary = "주문 생성")
    @Transactional
    public RsData<OrderDto> createOrder(@RequestBody @Valid OrderCreateReqBody reqBody) {

        // List<OrderItemReq>를 Map<Long, Integer> (상품ID : 수량) 형태로 변환합니다.
        Map<Long, Integer> productQuantities = reqBody.orderItems().stream()
                .collect(java.util.stream.Collectors.toMap(
                        item -> item.productId(),
                        item -> item.quantity()
                ));

        // 서비스 메서드 규격에 맞게 쪼개서 호출합니다.
        Order order = orderService.createOrder(
                reqBody.email(),
                reqBody.address1(),
                reqBody.address2(),
                reqBody.zipCode(),
                productQuantities
        );

        // 결과 엔티티(Order)를 출력용 DTO(OrderDto)로 변환하여 RsData로 반환
        return new RsData<>(
                "200-1",
                "%d번 주문이 완료되었습니다.".formatted(order.getId()),
                new OrderDto(order)
        );
    }

    // 고객 주문 조회 (이메일 기준)
    @GetMapping
    @Operation(summary = "이메일 기준 주문 조회")
    @Transactional(readOnly = true)
    public RsData<Page<OrderDto>> getOrdersByEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Order> orders = orderService.getOrdersByEmailWithPaging(email, page, size);
        Page<OrderDto> orderDtos = orders.map(OrderDto::new);

        return new RsData<>(
                "200-2",
                "이메일(%s)의 주문 내역 조회에 성공했습니다.".formatted(email),
                orderDtos
        );
    }

    // 주문 전체 조회 (관리자 - 날짜 범위 기준)
    @GetMapping("/admin")
    @Operation(summary = "기간별 주문 전체 조회 (관리자)")
    @Transactional(readOnly = true)
    public RsData<Page<OrderDto>> getOrdersBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "BEFORE_PROCESSING,AFTER_PROCESSING") List<OrderStatus> status
    ) {
        Page<Order> orders = orderService.getOrderBetweenDayWithPaging(start, end, status, page, size);

        Page<OrderDto> orderDtos = orders.map(OrderDto::new);

        return new RsData<>(
                "200-3",
                "주문 전체 조회에 성공했습니다.",
                orderDtos
        );
    }

    @GetMapping("/admin/sales")
    @Operation(summary = "기간별 판매액 조회")
    @Transactional(readOnly = true)
    public RsData<Integer> getSalesBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        int sales = orderService.getSales(start, end);
        return new RsData<>(
                "200-3",
                "판매액 조회에 성공했습니다.",
                sales
        );
    }

    @GetMapping("/admin/sales/product")
    @Operation(summary = "기간, 제품별 판매량 조회(최다판매순 정렬)")
    @Transactional(readOnly = true)
    public RsData<List<ProductSaleDto>> getProductSalesBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        List<ProductSalesSumInterface> sales = orderService.getProductSalesSum(start, end);
        List<ProductSaleDto> saleDtos = sales.stream().map(ProductSaleDto::new).toList();

        return new RsData<>(
                "200-3",
                "제품별 판매량 조회에 성공했습니다.",
                saleDtos
        );
    }

    // 주문 삭제
    @DeleteMapping("/{id}")
    @Operation(summary = "주문 삭제")
    @Transactional
    public RsData<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return new RsData<>(
                "200-4",
                "%d번 주문이 삭제되었습니다.".formatted(id)
        );
    }

    @GetMapping("/{id}/items")
    @Operation(summary = "특정 주문의 상품 목록 조회")
    @Transactional(readOnly = true)
    public RsData<List<OrderDto.OrderItemDto>> getOrderItems(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        List<OrderDto.OrderItemDto> orderItemDtos = order.getOrderItems().stream()
                .map(OrderDto.OrderItemDto::new)
                .toList();
        return new RsData<>(
                "200-5",
                "%d번 주문의 상품 목록 조회에 성공했습니다.".formatted(id),
                orderItemDtos
        );
    }

    // 주문 상태 변경용 Request Body DTO
    public record OrderStatusModifyReqBody(
            @NotNull(message = "주문 상태는 필수입니다.")
            OrderStatus status
    ) {}

    // PATCH를 사용함
    @PatchMapping("/{id}/status")
    @Operation(summary = "주문 상태 수동 변경 (관리자)")
    @Transactional
    public RsData<OrderDto> modifyOrderStatus(
            @PathVariable Long id,
            @RequestBody @Valid OrderStatusModifyReqBody reqBody
    ) {
        Order order = orderService.modifyOrderStatus(id, reqBody.status());
        return new RsData<>(
                "200-6",
                "%d번 주문 상태가 [%s](으)로 변경되었습니다.".formatted(id, reqBody.status().getDescription()),
                new OrderDto(order)
        );
    }

}