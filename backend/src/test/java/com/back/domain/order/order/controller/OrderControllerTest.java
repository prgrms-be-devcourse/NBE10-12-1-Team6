package com.back.domain.order.order.controller;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.service.OrderService;
import com.back.domain.product.product.entity.Product;
import com.back.domain.product.product.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class OrderControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @Autowired
    private ProductService productService;
    @Autowired
    private OrderService orderService;

    @BeforeEach
    void setup() {
        mvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    static String getOrderJson(String email, String address1, String address2, String zipCode,
                               Long productId, int quantity) {
        return """
                {
                    "email": "%s",
                    "address1": "%s",
                    "address2": "%s",
                    "zipCode": "%s",
                    "orderItems": [
                        {
                            "productId": %d,
                            "quantity": %d
                        }
                    ]
                }
                """.formatted(email, address1, address2, zipCode, productId, quantity);

    }

    @Test
    @DisplayName("주문 생성 테스트 - 서울시 강남구")
    void createOrderTest1() throws Exception {
        Product product = productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        getOrderJson("test@test.com",
                                                "서울시 강남구", "강남대로 123", "06000",
                                                product.getId(), 2))
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
                                .content(
                                        getOrderJson("test@test.com",
                                                "서울시 동대문구", "왕산로 456", "02600",
                                                product.getId(), 1))
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
                                .content(
                                        getOrderJson("test@test.com",
                                                "경기도 남양주시",
                                                "경춘로 789",
                                                "12100",
                                                product.getId(), 3))
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
    @DisplayName("동일 이메일 주문 생성 - 같은날 같은 시간")
    void createSameEmailOrderTest1() throws Exception {
        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        ResultActions resultActions1 = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        getOrderJson("test@test.com",
                                                "경기도 남양주시",
                                                "경춘로 789",
                                                "12100",
                                                product.getId(), 3))
                )
                .andDo(print());

        ResultActions resultActions2 = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        getOrderJson("test@test.com",
                                                "경기도 남양주시",
                                                "경춘로 789",
                                                "12100",
                                                product.getId(), 3))
                )
                .andDo(print());

        resultActions2
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data.price").value(126000))
                .andExpect(jsonPath("$.data.orderItems.length()").value(1))
                .andExpect(jsonPath("$.data.orderItems[0].productName").value("콜롬비아 수프리모"))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(6));

    }

    @Test
    @DisplayName("동일 이메일 주문 생성 - 경계시간")
    void createSameEmailOrderTest2() throws Exception {
        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        try (MockedStatic<LocalDateTime> localDateTimeMockedStatic = Mockito.mockStatic(LocalDateTime.class, Mockito.CALLS_REAL_METHODS)) {

            LocalDateTime firstTime = LocalDateTime.of(2026, 6, 10, 13, 59, 59);
            localDateTimeMockedStatic.when(LocalDateTime::now)
                    .thenReturn(firstTime);

            ResultActions resultActions1 = mvc
                    .perform(
                            post("/api/v1/orders")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(
                                            getOrderJson("test@test.com",
                                                    "경기도 남양주시",
                                                    "경춘로 789",
                                                    "12100",
                                                    product.getId(), 3))
                    )
                    .andDo(print());

            LocalDateTime secondTime = LocalDateTime.of(2026, 6, 10, 14, 0, 0);

            localDateTimeMockedStatic.when(LocalDateTime::now)
                    .thenReturn(secondTime);

            // [두 번째 요청] 14:00:00 설정된 상태로 실행
            ResultActions resultActions2 = mvc
                    .perform(
                            post("/api/v1/orders")
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(
                                            getOrderJson("test@test.com",
                                                    "경기도 남양주시",
                                                    "경춘로 789",
                                                    "12100",
                                                    product.getId(), 3))
                    )
                    .andDo(print());

            // 검증 로직 실행
            resultActions2
                    .andExpect(handler().handlerType(ApiV1OrderController.class))
                    .andExpect(handler().methodName("createOrder"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.resultCode").value("200-1"))
                    .andExpect(jsonPath("$.data.price").value(63000))
                    .andExpect(jsonPath("$.data.orderItems.length()").value(1))
                    .andExpect(jsonPath("$.data.orderItems[0].productName").value("콜롬비아 수프리모"))
                    .andExpect(jsonPath("$.data.orderItems[0].quantity").value(3));
        }
    }

    @Test
    @DisplayName("동일 이메일 주문 생성 - 중간 상품 가격 변동")
    void createSameEmailOrderTest3() throws Exception {

        String productName = "콜롬비아 수프리모";
        String productDesc = "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.";
        String productImage = "colombia.jpg";

        Product product = productService.create(productName, 21000, productDesc, productImage);

        ResultActions resultActions1 = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        getOrderJson("test@test.com",
                                                "경기도 남양주시",
                                                "경춘로 789",
                                                "12100",
                                                product.getId(), 3))
                )
                .andDo(print());

        productService.modify(product, productName, 20000, productDesc, productImage);

        ResultActions resultActions2 = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        getOrderJson("test@test.com",
                                                "경기도 남양주시",
                                                "경춘로 789",
                                                "12100",
                                                product.getId(), 3))
                )
                .andDo(print());

        resultActions2
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data.price").value(123000))
                .andExpect(jsonPath("$.data.orderItems.length()").value(2))
                .andExpect(jsonPath("$.data.orderItems[0].productName").value("콜롬비아 수프리모"))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(3));

    }


    @Test
    @DisplayName("주문 생성 실패 테스트 - 존재하지 않는 상품 주문")
    void createOrderFailTest1() throws Exception {

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        getOrderJson("test@test.com",
                                                "경기도 남양주시",
                                                "경춘로 789",
                                                "12100",
                                                1L, 3))
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.resultCode").value("404-1"))
                .andExpect(jsonPath("$.msg", containsString("해당 데이터가 존재하지 않습니다.")));
    }

    @Test
    @DisplayName("주문 생성 실패 테스트 - 이메일 미입력")
    void createOrderFailTest2() throws Exception {

        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        getOrderJson("",
                                                "경기도 남양주시",
                                                "경춘로 789",
                                                "12100",
                                                product.getId(), 3))
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("$.resultCode").value("400-1"))
                .andExpect(jsonPath("$.msg", containsString("이메일은 필수 입력 항목입니다.")));
    }

    @Test
    @DisplayName("주문 생성 실패 테스트 - 이메일 형식 오류")
    void createOrderFailTest3() throws Exception {

        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/orders")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        getOrderJson("test",
                                                "경기도 남양주시",
                                                "경춘로 789",
                                                "12100",
                                                product.getId(), 3))
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("$.resultCode").value("400-1"))
                .andExpect(jsonPath("$.msg", containsString("올바른 이메일 형식이 아닙니다.")));
    }

    @Test
    @DisplayName("주문 다건조회 테스트 - 이메일 입력")
    void getOrdersByEmailTest() throws Exception {

        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        Order order1 = orderService.createOrder("test@test.com",
                "경기도 남양주시", "경춘로 789", "12100",
                Map.of(product.getId(), 3));

        Order order2 = orderService.createOrder("test@test.com",
                "대구광역시 수성구", "노변로 55", "42268",
                Map.of(product.getId(), 3));

        Order order3 = orderService.createOrder("test@test.com",
                "경기도 남양주시", "경춘로 789", "12100",
                Map.of(product.getId(), 3));

        ResultActions resultActions = mvc.perform(
                get("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .queryParam("email", "test@test.com")
                )
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getOrdersByEmail"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-2"))
                .andExpect(jsonPath("$.data[0].id").value(order1.getId()))
                .andExpect(jsonPath("$.data[0].price").value(126000))
                .andExpect(jsonPath("$.data[0].orderItems.length()").value(1))
                .andExpect(jsonPath("$.data[0].orderItems[0].productName").value("콜롬비아 수프리모"))
                .andExpect(jsonPath("$.data[0].orderItems[0].quantity").value(6))
                .andExpect(jsonPath("$.data[1].id").value(order2.getId()))
                .andExpect(jsonPath("$.data[1].price").value(63000))
                .andExpect(jsonPath("$.data[1].orderItems.length()").value(1))
                .andExpect(jsonPath("$.data[1].orderItems[0].productName").value("콜롬비아 수프리모"))
                .andExpect(jsonPath("$.data[1].orderItems[0].quantity").value(3));
    }

    @Test
    @DisplayName("주문 단건조회 테스트 - 상세 주문 내역")
    void getOrderTest() throws Exception {
    }

    @Test
    @DisplayName("주문 삭제 테스트")
    void deleteOrderTest() {
    }
}
