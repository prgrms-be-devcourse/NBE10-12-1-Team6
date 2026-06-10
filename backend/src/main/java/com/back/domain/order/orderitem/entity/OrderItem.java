package com.back.domain.order.orderitem.entity;

import com.back.domain.order.order.entity.Order;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem extends BaseEntity {

    // 다른 패키지의 Order와 다대일 매핑 (리포지토리 없이 부모를 참조)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "product_price", nullable = false)
    private int productPrice; // 주문 당시 가격 (스냅샷)

    @Column(name = "product_name", nullable = false)
    private String productName; // 주문 당시 상품명 (스냅샷)

    public OrderItem(Long productId, String productName, int productPrice, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.quantity = quantity;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    /**
     * 수량 증가 비즈니스 로직 (자동 합산용)
     */
    public void addQuantity(int count) {
        this.quantity += count;
    }
}