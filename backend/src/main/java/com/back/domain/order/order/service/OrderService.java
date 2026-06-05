package com.back.domain.order.order.service;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderStatus;
import com.back.domain.order.order.repository.OrderRepository;
import com.back.domain.order.orderitem.entity.OrderItem;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import com.back.global.globalExceptionHandler.EmailNotValidException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;

    private static final LocalTime baseTime = LocalTime.of(14, 0, 0);
    private static final LocalTime endTime = baseTime.minusNanos(1);

    private static LocalDateTime getStartOfDate(LocalDateTime day) {
        LocalDate date = day.toLocalDate();

        if (day.isAfter(LocalDateTime.of(date, endTime))) {
            return LocalDateTime.of(date, baseTime);
        }
        return LocalDateTime.of(date.minusDays(1), baseTime);

    }

    private static LocalDateTime getEndOfDate(LocalDateTime day) {
        LocalDate date = day.toLocalDate();

        if (day.isBefore(LocalDateTime.of(date, baseTime))) {
            return LocalDateTime.of(date, endTime);
        }
        return LocalDateTime.of(date.plusDays(1), endTime);
    }

    private boolean checkIsNotValidEmail(String email) {
        return !email.matches("^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9.]+$");
    }

    public List<Order> getOrdersByDay(LocalDateTime day) {
        return getOrderBetweenDay(day, day);
    }

    public List<Order> getOrderBetweenDay(LocalDateTime start, LocalDateTime end) {
        return orderRepository.findByCreateDateBetween(getStartOfDate(start), getEndOfDate(end));
    }

    public List<Order> getOrdersByEmail(String email) {
        if (checkIsNotValidEmail(email)) {
            throw new EmailNotValidException();
        }
        return orderRepository.findByEmail(email);
    }

    public Order addOrder(String email, String address1, String address2, String zipCode, List<OrderItem> orderItem) {

        LocalDateTime now = LocalDateTime.now();

        if (checkIsNotValidEmail(email)) {
            throw new EmailNotValidException();
        }

        Optional<Order> order = orderRepository
                .findByCreateDateBetweenAndEmailAndAddress1AndAddress2AndZipCode(
                        getStartOfDate(now), getEndOfDate(now), email, address1, address2, zipCode);

        Order o = order.orElseGet(() ->
                orderRepository.save(new Order(
                        email, zipCode, address1, address2,
                        OrderStatus.BEFORE_PROCESSING, 0, new ArrayList<>())));

        for (var oi : orderItem) {
            o.addOrderItem(oi);
        }

        return o;
    }

    public Order createOrder(
            String email,
            String address1,
            String address2,
            String zipCode,
            Map<Long, Integer> productQuantities
    ) {
        List<OrderItem> orderItems = new ArrayList<>();

        for (var entry : productQuantities.entrySet()) {
            Long productId = entry.getKey();
            int quantity = entry.getValue();

            Product product = productService.findById(productId.intValue())
                    .orElseThrow(() -> new NoSuchElementException("존재하지 않는 상품 번호입니다: " + productId));

            OrderItem orderItem = OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .productPrice(product.getPrice())
                    .quantity(quantity)
                    .build();

            orderItems.add(orderItem);
        }

        return addOrder(email, address1, address2, zipCode, orderItems);
    }
}
