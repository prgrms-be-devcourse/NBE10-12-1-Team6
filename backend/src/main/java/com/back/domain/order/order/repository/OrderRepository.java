package com.back.domain.order.order.repository;


import com.back.domain.order.order.dto.ProductSalesSumInterface;
import com.back.domain.order.order.dto.SalesInterface;
import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCreateDateBetween(
            LocalDateTime start, LocalDateTime end);

    Page<Order> findByCreateDateBetweenAndStatusIn(
            LocalDateTime startOfDate, LocalDateTime endOfDate, List<OrderStatus> status, Pageable pageable);

    Optional<Order> findByCreateDateBetweenAndEmailAndAddress1AndAddress2AndZipCode(
            LocalDateTime start, LocalDateTime end, String email, String address1, String address2, String zipCode);

    List<Order> findByEmail(String email);

    Page<Order> findByEmail(String email, Pageable pageable);

    List<Order> findByCreateDateBeforeAndStatus(LocalDateTime date, OrderStatus status);

    // ref: https://medium.com/@odysseymoon/spring-data-jpa에서-groupby-처리하기-82cddc6e5d4a
    @Query(value=
            """
                SELECT
                    oi.product_id as id,
                    SUM(oi.quantity) AS sales
                    FROM ORDER_ITEMS as oi
                    WHERE create_date > :start AND create_date < :end
                    GROUP BY oi.product_id
                    ORDER BY sales DESC
            """
            , nativeQuery = true)
    List<ProductSalesSumInterface> findGroupByProduct(
            LocalDateTime start, LocalDateTime end);

    @Query(value=
            """
                SELECT
                    SUM(ORDERS.price) AS sales
                    FROM ORDERS
                    WHERE create_date > :start AND create_date < :end
            """
            , nativeQuery = true)
    Optional<SalesInterface> findSalesBetween(
            LocalDateTime start, LocalDateTime end);

}
