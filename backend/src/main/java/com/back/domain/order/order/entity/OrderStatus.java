package com.back.domain.order.order.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OrderStatus {
    BEFORE_PROCESSING("처리전"),
    AFTER_PROCESSING("처리후");

    private final String description;
}