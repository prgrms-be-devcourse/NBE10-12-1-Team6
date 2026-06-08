package com.back.global.initdata;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.service.OrderService;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {
    @Autowired
    @Lazy
    private BaseInitData self;
    private final ProductService productService;
    private final OrderService orderService;

    @Bean
    ApplicationRunner baseInitDataApplicationRunner() {
        return args -> {
            self.work1();
        };
    }

    @Transactional
    public void work1() {
        if (productService.count() > 0) return;

        Product p1 = productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");
        Product p2 = productService.create("윈터 가든 블렌드", 18000, "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.", "winter.jpg");
        Product p3 = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        Order order1 = orderService.createOrder("base@test.com",
                "경기도 남양주시", "경춘로 789", "12100",
                Map.of(p1.getId(), 3));

        Order order2 = orderService.createOrder("base@test.com",
                "대구광역시 수성구", "노변로 55", "42268",
                Map.of(p2.getId(), 3,
                        p3.getId(), 2));
    }
}
