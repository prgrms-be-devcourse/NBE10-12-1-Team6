package com.back.domain.order.order.scheduler;

import com.back.domain.order.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class OrderScheduler {
    private final OrderService orderService;

    @Scheduled(cron = "${schedule.process_order.cron}")
    @Transactional
    public void processOrder() {
        orderService.processOrder();
    }

}
