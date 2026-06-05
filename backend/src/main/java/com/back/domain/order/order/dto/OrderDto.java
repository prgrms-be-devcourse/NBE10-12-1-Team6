package com.back.domain.order.order.dto;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderStatus;
import com.back.domain.order.orderitem.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
        Long id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        String email,
        String zipCode,
        String address1,
        String address2,
        OrderStatus status,
        int price,
        List<OrderItemDto> orderItems
) {
    // 1. Order 엔티티를 받아 DTO로 변환해 주는 생성자
    public OrderDto(Order order) {
        this(
                order.getId(),
                order.getCreateDate(),
                order.getModifyDate(),
                order.getEmail(),
                order.getZipCode(),
                order.getAddress1(),
                order.getAddress2(),
                order.getStatus(),
                order.getPrice(),
                order.getOrderItems().stream()
                        .map(OrderItemDto::new)
                        .toList()
        );
    }

    // 2. 주문 아이템(OrderItem)을 나타내는 하위 record
    public record OrderItemDto(
            Long id,
            Long productId,
            String productName,
            int productPrice,
            int quantity
    ) {
        public OrderItemDto(OrderItem item) {
            this(
                    item.getId(),
                    item.getProductId(),
                    item.getProductName(),
                    item.getProductPrice(),
                    item.getQuantity()
            );
        }
    }
}