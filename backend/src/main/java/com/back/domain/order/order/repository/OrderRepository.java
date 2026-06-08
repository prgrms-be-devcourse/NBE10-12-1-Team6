package com.back.domain.order.order.repository;


import com.back.domain.order.order.dto.ProductSalesSumInterface;
import com.back.domain.order.order.dto.SalesInterface;
import com.back.domain.order.order.entity.Order;
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

    Page<Order> findByCreateDateBetween(
            LocalDateTime startOfDate, LocalDateTime endOfDate, Pageable pageable);

    Optional<Order> findByCreateDateBetweenAndEmailAndAddress1AndAddress2AndZipCode(
            LocalDateTime start, LocalDateTime end, String email, String address1, String address2, String zipCode);

    List<Order> findByEmail(String email);

    Page<Order> findByEmail(String email, Pageable pageable);


}
