package com.back.domain.order.order.entity;

import com.back.domain.order.orderitem.entity.OrderItem;
import com.back.global.jpa.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {

    @Column(nullable = false)
    private String email;

    @Column(name = "zip_code", nullable = false, length = 10)
    private String zipCode;

    @Column(name = "address_1", nullable = false)
    private String address1;

    @Column(name = "address_2", nullable = false)
    private String address2;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(nullable = false)
    private int price; // 주문 총 금액

    // 다른 패키지의 OrderItem과 일대다 매핑
    @Builder.Default
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order(String email, String zipCode, String address1, String address2) {
        this.email = email;
        this.zipCode = zipCode;
        this.address1 = address1;
        this.address2 = address2;
        status = OrderStatus.BEFORE_PROCESSING;
        price = 0;
        orderItems = new ArrayList<>();
    }

    public void changeStatus(OrderStatus status) {
        this.status = status;
    }

    // 자동 합산 및 금액 재계산을 위한 도메인 메서드
    public void addOrderItem(OrderItem newItem) {
        // 이미 주문 내역에 같은 상품이 있는지 검증
        this.orderItems.stream()
                .filter(item -> item.getProductId().equals(newItem.getProductId())
                        && item.getProductPrice() == newItem.getProductPrice()
                        && item.getProductName().equals(newItem.getProductName()))
                .findFirst()
                .ifPresentOrElse(
                        existingItem -> {
                            // 동일 상품 존재 시 수량 증가
                            existingItem.addQuantity(newItem.getQuantity());
                        },
                        () -> {
                            // 새로운 상품일 시 리스트에 추가하고 연관관계 설정
                            this.orderItems.add(newItem);
                            newItem.setOrder(this);
                        }
                );

        // 상품이 추가/합산될 때마다 주문 총 금액 업데이트
        calculateTotalPrice();
    }

    // 총 주문 금액을 계산하는 내부 메서드
    private void calculateTotalPrice() {
        this.price = this.orderItems.stream()
                .mapToInt(item -> item.getProductPrice() * item.getQuantity())
                .sum();
    }
}