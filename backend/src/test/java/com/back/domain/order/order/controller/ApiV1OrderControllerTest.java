package com.back.domain.order.order.controller;

import com.back.domain.order.order.entity.Order;
import com.back.domain.order.order.entity.OrderStatus;
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
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
class ApiV1OrderControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    private Product testProduct;

    private static final String ADMIN_TEST_START = "2035-06-15T00:00:00";
    private static final String ADMIN_TEST_END = "2035-06-15T23:59:59";
    private static final LocalDateTime ADMIN_TEST_TIME = LocalDateTime.of(2035, 6, 15, 15, 30, 0);

    @BeforeEach
    void setup() {
        mvc = MockMvcBuilders.webAppContextSetup(context).build();
        testProduct = productService.create("테스트 원두", 24000, "테스트용 원두입니다.", "test.jpg");
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
        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(getOrderJson("apple@test.com", "서울시 강남구", "강남대로 123", "06000", testProduct.getId(), 2)))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg", containsString("번 주문이 완료되었습니다.")))
                .andExpect(jsonPath("$.data.email").value("apple@test.com"))
                .andExpect(jsonPath("$.data.address1").value("서울시 강남구"))
                .andExpect(jsonPath("$.data.address2").value("강남대로 123"))
                .andExpect(jsonPath("$.data.zipCode").value("06000"))
                .andExpect(jsonPath("$.data.price").value(testProduct.getPrice() * 2))
                .andExpect(jsonPath("$.data.orderItems.length()").value(1))
                .andExpect(jsonPath("$.data.orderItems[0].productName").value(testProduct.getName()))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(2));
    }

    @Test
    @DisplayName("주문 생성 테스트 - 서울시 동대문구")
    void createOrderTest2() throws Exception {
        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(getOrderJson("banana@test.com", "서울시 동대문구", "왕산로 456", "02600", testProduct.getId(), 1)))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg", containsString("번 주문이 완료되었습니다.")))
                .andExpect(jsonPath("$.data.email").value("banana@test.com"))
                .andExpect(jsonPath("$.data.address1").value("서울시 동대문구"))
                .andExpect(jsonPath("$.data.price").value(testProduct.getPrice()))
                .andExpect(jsonPath("$.data.orderItems[0].productName").value(testProduct.getName()))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(1));
    }

    @Test
    @DisplayName("주문 생성 테스트 - 경기도 남양주시")
    void createOrderTest3() throws Exception {
        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(getOrderJson("cherry@test.com", "경기도 남양주시", "경춘로 789", "12100", testProduct.getId(), 3)))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data.price").value(testProduct.getPrice() * 3))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(3));
    }

    @Test
    @DisplayName("동일 이메일 주문 생성 - 같은날 같은 시간")
    void createSameEmailOrderTest1() throws Exception {
        mvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(getOrderJson("durian@test.com", "경기도 남양주시", "경춘로 789", "12100", testProduct.getId(), 3)));

        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(getOrderJson("durian@test.com", "경기도 남양주시", "경춘로 789", "12100", testProduct.getId(), 3)))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data.price").value(testProduct.getPrice() * 6))
                .andExpect(jsonPath("$.data.orderItems.length()").value(1))
                .andExpect(jsonPath("$.data.orderItems[0].quantity").value(6));
    }

    @Test
    @DisplayName("동일 이메일 주문 생성 - 경계시간")
    void createSameEmailOrderTest2() throws Exception {
        LocalDateTime beforeBoundary = LocalDateTime.of(2026, 6, 10, 13, 59, 59);
        LocalDateTime atBoundary = LocalDateTime.of(2026, 6, 10, 14, 0, 0);

        try (MockedStatic<LocalDateTime> localDateTimeMockedStatic = Mockito.mockStatic(LocalDateTime.class, Mockito.CALLS_REAL_METHODS)) {

            localDateTimeMockedStatic.when(LocalDateTime::now).thenReturn(beforeBoundary);

            mvc.perform(post("/api/v1/orders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(getOrderJson("elderberry@test.com", "경기도 남양주시", "경춘로 789", "12100", testProduct.getId(), 3)));

            localDateTimeMockedStatic.when(LocalDateTime::now).thenReturn(atBoundary);

            ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(getOrderJson("elderberry@test.com", "경기도 남양주시", "경춘로 789", "12100", testProduct.getId(), 3)))
                    .andDo(print());

            resultActions
                    .andExpect(handler().handlerType(ApiV1OrderController.class))
                    .andExpect(handler().methodName("createOrder"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.resultCode").value("200-1"))
                    .andExpect(jsonPath("$.data.price").value(testProduct.getPrice() * 3))
                    .andExpect(jsonPath("$.data.orderItems[0].quantity").value(3));
        }
    }

    @Test
    @DisplayName("동일 이메일 주문 생성 - 중간 상품 가격 변동")
    void createSameEmailOrderTest3() throws Exception {
        String productName = "콜롬비아 수프리모";
        String productDesc = "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.";
        String productImage = "colombia.jpg";

        var product = productService.create(productName, 21000, productDesc, productImage);

        mvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(getOrderJson("fig@test.com", "경기도 남양주시", "경춘로 789", "12100", product.getId(), 3)));

        productService.modify(product, productName, 20000, productDesc, productImage);

        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(getOrderJson("fig@test.com", "경기도 남양주시", "경춘로 789", "12100", product.getId(), 3)))
                .andDo(print());

        resultActions
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
        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(getOrderJson("grape@test.com", "경기도 남양주시", "경춘로 789", "12100", 99999L, 3)))
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
        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(getOrderJson("", "경기도 남양주시", "경춘로 789", "12100", testProduct.getId(), 3)))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode").value("400-1"))
                .andExpect(jsonPath("$.msg", containsString("이메일은 필수 입력 항목입니다.")));
    }

    @Test
    @DisplayName("주문 생성 실패 테스트 - 이메일 형식 오류")
    void createOrderFailTest3() throws Exception {
        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(getOrderJson("test", "경기도 남양주시", "경춘로 789", "12100", testProduct.getId(), 3)))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode").value("400-1"))
                .andExpect(jsonPath("$.msg", containsString("올바른 이메일 형식이 아닙니다.")));
    }

    @Test
    @DisplayName("주문 생성 실패 테스트 - 주문 상품 목록 비어있음")
    void createOrderFailTest4() throws Exception {
        ResultActions resultActions = mvc.perform(post("/api/v1/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "email": "kiwi@test.com",
                                    "address1": "경기도 남양주시",
                                    "address2": "경춘로 789",
                                    "zipCode": "12100",
                                    "orderItems": []
                                }
                                """))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("createOrder"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode").value("400-1"));
    }

    @Test
    @DisplayName("주문 다건조회 테스트 - 이메일 입력")
    void getOrdersByEmailTest() throws Exception {
        orderService.createOrder("lemon@test.com", "경기도 남양주시", "경춘로 789", "12100", Map.of(testProduct.getId(), 3));
        orderService.createOrder("lemon@test.com", "대구광역시 수성구", "노변로 55", "42268", Map.of(testProduct.getId(), 3));

        List<Order> orders = orderService.getOrdersByEmail("lemon@test.com");

        ResultActions resultActions = mvc.perform(get("/api/v1/orders")
                        .param("email", "lemon@test.com"))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getOrdersByEmail"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-2"))
                .andExpect(jsonPath("$.data.length()").value(orders.size()));

        for (int i = 0; i < orders.size(); i++) {
            resultActions
                    .andExpect(jsonPath("$.data[%d].id".formatted(i)).value(orders.get(i).getId()));
        }
                /*
                    .andExpect(jsonPath("$.data[1].id").value(order2.getId()))
                    .andExpect(jsonPath("$.data[1].price").value(product.getPrice() * 3))
                    .andExpect(jsonPath("$.data[1].orderItems.length()").value(1))
                    .andExpect(jsonPath("$.data[1].orderItems[0].productName").value(product.getName()))
                    .andExpect(jsonPath("$.data[1].orderItems[0].quantity").value(3));*/
    }

    @Test
    @DisplayName("주문 단건조회 테스트 - 상세 주문 내역")
    void getOrderTest() throws Exception {
        Order order = orderService.createOrder("mango@test.com", "경기도 남양주시", "경춘로 789", "12100", Map.of(testProduct.getId(), 2));

        ResultActions resultActions = mvc.perform(get("/api/v1/orders/%d/items".formatted(order.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getOrderItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(order.getOrderItems().size()))
                .andExpect(jsonPath("$.data[0].productId").value(order.getOrderItems().get(0).getProductId()))
                .andExpect(jsonPath("$.data[0].quantity").value(order.getOrderItems().get(0).getQuantity()));
    }

    @Test
    @DisplayName("주문 단건조회 실패 - 존재하지 않는 주문")
    void getOrderFailTest() throws Exception {
        ResultActions resultActions = mvc.perform(get("/api/v1/orders/99999/items"))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getOrderItems"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.resultCode").value("404-1"))
                .andExpect(jsonPath("$.msg").value("해당 데이터가 존재하지 않습니다."));
    }

    @Test
    @DisplayName("주문 상태 변경 - 성공 (처리전 → 처리후)")
    void modifyOrderStatusTest() throws Exception {
        Order order = orderService.createOrder("nectarine@test.com", "서울시 강남구", "강남대로 123", "06000", Map.of(testProduct.getId(), 1));

        ResultActions resultActions = mvc.perform(patch("/api/v1/orders/%d/status".formatted(order.getId()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "status": "AFTER_PROCESSING"
                                }
                                """))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("modifyOrderStatus"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-6"))
                .andExpect(jsonPath("$.msg").value("%d번 주문 상태가 [처리후](으)로 변경되었습니다.".formatted(order.getId())))
                .andExpect(jsonPath("$.data.status").value("AFTER_PROCESSING"));
    }

    @Test
    @DisplayName("주문 삭제 테스트")
    void deleteOrderTest() throws Exception {
        Order order = orderService.createOrder("orange@test.com", "경기도 남양주시", "경춘로 789", "12100", Map.of(testProduct.getId(), 1));

        ResultActions resultActions = mvc.perform(delete("/api/v1/orders/%d".formatted(order.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("deleteOrder"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-4"))
                .andExpect(jsonPath("$.msg").value("%d번 주문이 삭제되었습니다.".formatted(order.getId())));
    }

    @Test
    @DisplayName("처리 후 상태의 주문은 삭제할 수 없다")
    void deleteOrderFailAfterProcessingTest() throws Exception {
        Order order = orderService.createOrder("peach@test.com", "서울시 강남구", "강남대로 123", "06000", Map.of(testProduct.getId(), 1));
        orderService.modifyOrderStatus(order.getId(), OrderStatus.AFTER_PROCESSING);

        ResultActions resultActions = mvc.perform(delete("/api/v1/orders/%d".formatted(order.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("deleteOrder"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.resultCode").value("400-2"))
                .andExpect(jsonPath("$.msg").value("이미 처리가 완료된 주문은 삭제할 수 없습니다."));
    }

    @Test
    @DisplayName("주문 삭제 실패 - 존재하지 않는 주문")
    void deleteOrderFailNotFoundTest() throws Exception {
        ResultActions resultActions = mvc.perform(delete("/api/v1/orders/99999"))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("deleteOrder"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.resultCode").value("404-1"))
                .andExpect(jsonPath("$.msg").value("해당 데이터가 존재하지 않습니다."));
    }

    @Test
    @DisplayName("주문 상태 변경 실패 - 존재하지 않는 주문")
    void modifyOrderStatusFailTest() throws Exception {
        ResultActions resultActions = mvc.perform(patch("/api/v1/orders/99999/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "status": "AFTER_PROCESSING"
                                }
                                """))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("modifyOrderStatus"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.resultCode").value("404-1"))
                .andExpect(jsonPath("$.msg").value("해당 데이터가 존재하지 않습니다."));
    }

    @Test
    @DisplayName("주문 페이징 조회 - 이메일 기준")
    void getOrdersByEmailPageTest() throws Exception {
        orderService.createOrder("pineapple@test.com", "서울시 강남구", "강남대로 123", "06000", Map.of(testProduct.getId(), 1));
        orderService.createOrder("pineapple@test.com", "서울시 종로구", "종로 456", "03000", Map.of(testProduct.getId(), 2));

        ResultActions resultActions = mvc.perform(get("/api/v1/orders/page")
                        .param("email", "pineapple@test.com")
                        .param("page", "0")
                        .param("size", "5"))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1OrderController.class))
                .andExpect(handler().methodName("getOrdersByEmail"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-2"))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(2))
                .andExpect(jsonPath("$.data.size").value(5));
    }

    @Test
    @DisplayName("관리자 기간별 주문 조회")
    void getOrdersBetweenTest() throws Exception {
        try (MockedStatic<LocalDateTime> ldt = Mockito.mockStatic(LocalDateTime.class, Mockito.CALLS_REAL_METHODS)) {
            ldt.when(LocalDateTime::now).thenReturn(ADMIN_TEST_TIME);

            orderService.createOrder("raspberry1@test.com", "서울시 강남구", "강남대로 123", "06000", Map.of(testProduct.getId(), 1));
            orderService.createOrder("raspberry2@test.com", "서울시 종로구", "종로 456", "03000", Map.of(testProduct.getId(), 2));

            ResultActions resultActions = mvc.perform(get("/api/v1/orders/admin")
                            .param("start", ADMIN_TEST_START)
                            .param("end", ADMIN_TEST_END))
                    .andDo(print());

            resultActions
                    .andExpect(handler().handlerType(ApiV1OrderController.class))
                    .andExpect(handler().methodName("getOrdersBetween"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.resultCode").value("200-3"))
                    .andExpect(jsonPath("$.data").isArray())
                    .andExpect(jsonPath("$.data.length()").value(2));
        }
    }

    @Test
    @DisplayName("관리자 기간별 주문 페이징 조회")
    void getOrdersBetweenPageTest() throws Exception {
        try (MockedStatic<LocalDateTime> ldt = Mockito.mockStatic(LocalDateTime.class, Mockito.CALLS_REAL_METHODS)) {
            ldt.when(LocalDateTime::now).thenReturn(ADMIN_TEST_TIME);

            orderService.createOrder("strawberry1@test.com", "서울시 강남구", "강남대로 123", "06000", Map.of(testProduct.getId(), 1));
            orderService.createOrder("strawberry2@test.com", "서울시 종로구", "종로 456", "03000", Map.of(testProduct.getId(), 2));

            ResultActions resultActions = mvc.perform(get("/api/v1/orders/admin/page")
                            .param("start", ADMIN_TEST_START)
                            .param("end", ADMIN_TEST_END)
                            .param("status", "BEFORE_PROCESSING")
                            .param("status", "AFTER_PROCESSING")
                            .param("page", "0")
                            .param("size", "5"))
                    .andDo(print());

            resultActions
                    .andExpect(handler().handlerType(ApiV1OrderController.class))
                    .andExpect(handler().methodName("getOrdersBetween"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.resultCode").value("200-3"))
                    .andExpect(jsonPath("$.data.content").isArray())
                    .andExpect(jsonPath("$.data.totalElements").value(2))
                    .andExpect(jsonPath("$.data.size").value(5));
        }
    }

    @Test
    @DisplayName("관리자 기간별 판매액 조회")
    void getSalesBetweenTest() throws Exception {
        try (MockedStatic<LocalDateTime> ldt = Mockito.mockStatic(LocalDateTime.class, Mockito.CALLS_REAL_METHODS)) {
            ldt.when(LocalDateTime::now).thenReturn(ADMIN_TEST_TIME);

            orderService.createOrder("tangerine@test.com", "서울시 강남구", "강남대로 123", "06000", Map.of(testProduct.getId(), 2));

            ResultActions resultActions = mvc.perform(get("/api/v1/orders/admin/sales")
                            .param("start", ADMIN_TEST_START)
                            .param("end", ADMIN_TEST_END))
                    .andDo(print());

            resultActions
                    .andExpect(handler().handlerType(ApiV1OrderController.class))
                    .andExpect(handler().methodName("getSalesBetween"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.resultCode").value("200-3"))
                    .andExpect(jsonPath("$.data").value(testProduct.getPrice() * 2));
        }
    }

    @Test
    @DisplayName("관리자 기간별 상품별 판매량 조회")
    void getProductSalesBetweenTest() throws Exception {
        try (MockedStatic<LocalDateTime> ldt = Mockito.mockStatic(LocalDateTime.class, Mockito.CALLS_REAL_METHODS)) {
            ldt.when(LocalDateTime::now).thenReturn(ADMIN_TEST_TIME);

            orderService.createOrder("watermelon1@test.com", "서울시 강남구", "강남대로 123", "06000", Map.of(testProduct.getId(), 2));
            orderService.createOrder("watermelon2@test.com", "서울시 종로구", "종로 456", "03000", Map.of(testProduct.getId(), 3));

            ResultActions resultActions = mvc.perform(get("/api/v1/orders/admin/sales/product")
                            .param("start", ADMIN_TEST_START)
                            .param("end", ADMIN_TEST_END))
                    .andDo(print());

            resultActions
                    .andExpect(handler().handlerType(ApiV1OrderController.class))
                    .andExpect(handler().methodName("getProductSalesBetween"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.resultCode").value("200-3"))
                    .andExpect(jsonPath("$.data").isArray())
                    .andExpect(jsonPath("$.data[0].id").value(testProduct.getId()))
                    .andExpect(jsonPath("$.data[0].sales").value(5));
        }
    }
}
