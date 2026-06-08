package com.back.domain.order.order.dto;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderStatus;
import com.back.domain.order.orderitem.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.List;

public record ProductSaleDto(
        Long id,
        int sales
) {

    public ProductSaleDto(ProductSalesSumInterface sales) {
        this(
                sales.getId(),
                sales.getSales()
        );
    }
}