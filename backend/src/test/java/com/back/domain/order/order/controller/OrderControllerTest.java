package com.back.domain.order.order.controller;

import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
class OrderControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @Autowired
    private ProductService productService;

    @BeforeEach
    void setup() {
        mvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    @DisplayName("주문 생성 테스트 - 서울시 강남구")
    void createOrderTest1() throws Exception {
        Product product = productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "email": "test@test.com",
                                            "address1": "서울시 강남구",
                                            "address2": "강남대로 123",
                                            "zipCode": "06000",
                                            "orderItems": [
                                                {
                                                    "productId": %d,
                                                    "quantity": 2
                                                }
                                            ]
                                        }
                                        """.formatted(product.getId()))
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg", containsString("번 주문이 완료되었습니다.")))
                .andExpect(jsonPath("$.data.email").value("test@test.com"))
                .andExpect(jsonPath("$.data.address1").value("서울시 강남구"))
                .andExpect(jsonPath("$.data.address2").value("강남대로 123"))
                .andExpect(jsonPath("$.data.zipCode").value("06000"))
                .andExpect(jsonPath("$.data.price").value(48000))
                .andExpect(jsonPath("$.data.orderItems.length()").value(1))
                .andExpect(jsonPath("$.data.orderItems[0].productName").value("에티오피아 예가체프 G1"))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(2));
    }

    @Test
    @DisplayName("주문 생성 테스트 - 서울시 동대문구")
    void createOrderTest2() throws Exception {
        Product product = productService.create("윈터 가든 블렌드", 18000, "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.", "winter.jpg");

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "email": "test@test.com",
                                            "address1": "서울시 동대문구",
                                            "address2": "왕산로 456",
                                            "zipCode": "02600",
                                            "orderItems": [
                                                {
                                                    "productId": %d,
                                                    "quantity": 1
                                                }
                                            ]
                                        }
                                        """.formatted(product.getId()))
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg", containsString("번 주문이 완료되었습니다.")))
                .andExpect(jsonPath("$.data.email").value("test@test.com"))
                .andExpect(jsonPath("$.data.address1").value("서울시 동대문구"))
                .andExpect(jsonPath("$.data.address2").value("왕산로 456"))
                .andExpect(jsonPath("$.data.zipCode").value("02600"))
                .andExpect(jsonPath("$.data.price").value(18000))
                .andExpect(jsonPath("$.data.orderItems.length()").value(1))
                .andExpect(jsonPath("$.data.orderItems[0].productName").value("윈터 가든 블렌드"))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(1));
    }

    @Test
    @DisplayName("주문 생성 테스트 - 경기도 남양주시")
    void createOrderTest3() throws Exception {
        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "email": "test@test.com",
                                            "address1": "경기도 남양주시",
                                            "address2": "경춘로 789",
                                            "zipCode": "12100",
                                            "orderItems": [
                                                {
                                                    "productId": %d,
                                                    "quantity": 3
                                                }
                                            ]
                                        }
                                        """.formatted(product.getId()))
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg", containsString("번 주문이 완료되었습니다.")))
                .andExpect(jsonPath("$.data.email").value("test@test.com"))
                .andExpect(jsonPath("$.data.address1").value("경기도 남양주시"))
                .andExpect(jsonPath("$.data.address2").value("경춘로 789"))
                .andExpect(jsonPath("$.data.zipCode").value("12100"))
                .andExpect(jsonPath("$.data.price").value(63000))
                .andExpect(jsonPath("$.data.orderItems.length()").value(1))
                .andExpect(jsonPath("$.data.orderItems[0].productName").value("콜롬비아 수프리모"))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(3));
    }

    @Test
    @DisplayName("주문 다건조회 테스트")
    void getOrdersTest() {
    }

    @Test
    @DisplayName("주문 단건조회 테스트")
    void getOrderTest() {
    }

    @Test
    @DisplayName("주문 삭제 테스트")
    void deleteOrderTest() {
    }
}
