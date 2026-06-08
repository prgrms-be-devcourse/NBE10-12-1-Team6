package com.back.domain.product.product.controller;

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

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@Transactional
public class ProductControllerTest {

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
    @DisplayName("상품 생성 테스트 - 꼬숩")
    void createProductTest1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "꼬숩",
                                            "price": 24000,
                                            "description": "고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다.",
                                            "imageUrl": "ggosup.jpg"
                                        }
                                        """)
                )
                .andDo(print());

        List<Product> products = productService.findAll();
        Product product = products.get(products.size() - 1);

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 등록되었습니다.".formatted(product.getId())))
                .andExpect(jsonPath("$.data.id").value(product.getId()))
                .andExpect(jsonPath("$.data.name").value("꼬숩"))
                .andExpect(jsonPath("$.data.price").value(24000))
                .andExpect(jsonPath("$.data.description").value("고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다."))
                .andExpect(jsonPath("$.data.imageUrl").value("ggosup.jpg"));
    }

    @Test
    @DisplayName("상품 생성 테스트 - 첼베사 워시드")
    void createProductTest2() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "첼베사 워시드",
                                            "price": 18000,
                                            "description": "깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다.",
                                            "imageUrl": "chelvesa-washed.jpg"
                                        }
                                        """)
                )
                .andDo(print());

        List<Product> products = productService.findAll();
        Product product = products.get(products.size() - 1);

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 등록되었습니다.".formatted(product.getId())))
                .andExpect(jsonPath("$.data.id").value(product.getId()))
                .andExpect(jsonPath("$.data.name").value("첼베사 워시드"))
                .andExpect(jsonPath("$.data.price").value(18000))
                .andExpect(jsonPath("$.data.description").value("깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다."))
                .andExpect(jsonPath("$.data.imageUrl").value("chelvesa-washed.jpg"));
    }

    @Test
    @DisplayName("상품 생성 테스트 - 케냐 뉴조마")
    void createProductTest3() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "케냐 뉴조마",
                                            "price": 21000,
                                            "description": "선명한 산미와 묵직한 바디감이 있는 테스트 원두입니다.",
                                            "imageUrl": "kenya-nyojoma.jpg"
                                        }
                                        """)
                )
                .andDo(print());

        List<Product> products = productService.findAll();
        Product product = products.get(products.size() - 1);

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("create"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 등록되었습니다.".formatted(product.getId())))
                .andExpect(jsonPath("$.data.id").value(product.getId()))
                .andExpect(jsonPath("$.data.name").value("케냐 뉴조마"))
                .andExpect(jsonPath("$.data.price").value(21000))
                .andExpect(jsonPath("$.data.description").value("선명한 산미와 묵직한 바디감이 있는 테스트 원두입니다."))
                .andExpect(jsonPath("$.data.imageUrl").value("kenya-nyojoma.jpg"));
    }

    @Test
    @DisplayName("상품 목록 조회 테스트 - 상품 1개")
    void getItemsTest1() throws Exception {
        productService.create("꼬숩", 24000, "고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다.", "ggosup.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products"))
                .andDo(print());

        List<Product> products = productService.findAll();

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(products.size()))
                .andExpect(jsonPath("$[%d].name".formatted(products.size() - 1)).value("꼬숩"));
    }

    @Test
    @DisplayName("상품 목록 조회 테스트 - 상품 2개")
    void getItemsTest2() throws Exception {
        productService.create("꼬숩", 24000, "고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다.", "ggosup.jpg");
        productService.create("첼베사 워시드", 18000, "깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다.", "chelvesa-washed.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products"))
                .andDo(print());

        List<Product> products = productService.findAll();

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(products.size()))
                .andExpect(jsonPath("$[%d].name".formatted(products.size() - 2)).value("꼬숩"))
                .andExpect(jsonPath("$[%d].name".formatted(products.size() - 1)).value("첼베사 워시드"));
    }

    @Test
    @DisplayName("상품 목록 조회 테스트 - 상품 3개")
    void getItemsTest3() throws Exception {
        productService.create("꼬숩", 24000, "고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다.", "ggosup.jpg");
        productService.create("첼베사 워시드", 18000, "깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다.", "chelvesa-washed.jpg");
        productService.create("케냐 뉴조마", 21000, "선명한 산미와 묵직한 바디감이 있는 테스트 원두입니다.", "kenya-nyojoma.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products"))
                .andDo(print());

        List<Product> products = productService.findAll();

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(products.size()))
                .andExpect(jsonPath("$[%d].name".formatted(products.size() - 3)).value("꼬숩"))
                .andExpect(jsonPath("$[%d].name".formatted(products.size() - 2)).value("첼베사 워시드"))
                .andExpect(jsonPath("$[%d].name".formatted(products.size() - 1)).value("케냐 뉴조마"));
    }

    @Test
    @DisplayName("상품 단건 조회 테스트 - 꼬숩")
    void getItemTest1() throws Exception {
        Product product = productService.create("꼬숩", 24000, "고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다.", "ggosup.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId()))
                .andExpect(jsonPath("$.name").value("꼬숩"))
                .andExpect(jsonPath("$.price").value(24000))
                .andExpect(jsonPath("$.description").value("고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다."))
                .andExpect(jsonPath("$.imageUrl").value("ggosup.jpg"));
    }

    @Test
    @DisplayName("상품 단건 조회 테스트 - 첼베사 워시드")
    void getItemTest2() throws Exception {
        Product product = productService.create("첼베사 워시드", 18000, "깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다.", "chelvesa-washed.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId()))
                .andExpect(jsonPath("$.name").value("첼베사 워시드"))
                .andExpect(jsonPath("$.price").value(18000))
                .andExpect(jsonPath("$.description").value("깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다."))
                .andExpect(jsonPath("$.imageUrl").value("chelvesa-washed.jpg"));
    }

    @Test
    @DisplayName("상품 단건 조회 테스트 - 케냐 뉴조마")
    void getItemTest3() throws Exception {
        Product product = productService.create("케냐 뉴조마", 21000, "선명한 산미와 묵직한 바디감이 있는 테스트 원두입니다.", "kenya-nyojoma.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId()))
                .andExpect(jsonPath("$.name").value("케냐 뉴조마"))
                .andExpect(jsonPath("$.price").value(21000))
                .andExpect(jsonPath("$.description").value("선명한 산미와 묵직한 바디감이 있는 테스트 원두입니다."))
                .andExpect(jsonPath("$.imageUrl").value("kenya-nyojoma.jpg"));
    }

    @Test
    @DisplayName("상품 수정 테스트 - 꼬숩")
    void modifyTest1() throws Exception {
        Product product = productService.create("꼬숩", 24000, "고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다.", "ggosup.jpg");

        mvc.perform(
                        put("/api/v1/products/%d".formatted(product.getId()))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "꼬숩",
                                            "price": 26000,
                                            "description": "고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다.",
                                            "imageUrl": "ggosup.jpg"
                                        }
                                        """)
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("modify"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 수정되었습니다.".formatted(product.getId())));

        mvc.perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(26000));
    }

    @Test
    @DisplayName("상품 수정 테스트 - 첼베사 워시드")
    void modifyTest2() throws Exception {
        Product product = productService.create("첼베사 워시드", 18000, "깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다.", "chelvesa-washed.jpg");

        mvc.perform(
                        put("/api/v1/products/%d".formatted(product.getId()))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "첼베사 워시드",
                                            "price": 20000,
                                            "description": "깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다.",
                                            "imageUrl": "chelvesa-washed.jpg"
                                        }
                                        """)
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("modify"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 수정되었습니다.".formatted(product.getId())));

        mvc.perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(20000));
    }

    @Test
    @DisplayName("상품 수정 테스트 - 케냐 뉴조마")
    void modifyTest3() throws Exception {
        Product product = productService.create("케냐 뉴조마", 21000, "선명한 산미와 묵직한 바디감이 있는 테스트 원두입니다.", "kenya-nyojoma.jpg");

        mvc.perform(
                        put("/api/v1/products/%d".formatted(product.getId()))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "케냐 뉴조마",
                                            "price": 23000,
                                            "description": "선명한 산미와 묵직한 바디감이 있는 테스트 원두입니다.",
                                            "imageUrl": "kenya-nyojoma.jpg"
                                        }
                                        """)
                )
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("modify"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 수정되었습니다.".formatted(product.getId())));

        mvc.perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(23000));
    }

    @Test
    @DisplayName("상품 삭제 테스트 - 꼬숩")
    void deleteTest1() throws Exception {
        Product product = productService.create("꼬숩", 24000, "고소한 향과 부드러운 단맛이 균형 잡힌 테스트 원두입니다.", "ggosup.jpg");

        mvc.perform(delete("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 삭제되었습니다.".formatted(product.getId())));

        assertThat(productService.findById(product.getId().intValue())).isEmpty();
    }

    @Test
    @DisplayName("상품 삭제 테스트 - 첼베사 워시드")
    void deleteTest2() throws Exception {
        Product product = productService.create("첼베사 워시드", 18000, "깔끔한 산미와 은은한 과일 향이 있는 테스트 원두입니다.", "chelvesa-washed.jpg");

        mvc.perform(delete("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 삭제되었습니다.".formatted(product.getId())));

        assertThat(productService.findById(product.getId().intValue())).isEmpty();
    }

    @Test
    @DisplayName("상품 삭제 테스트 - 케냐 뉴조마")
    void deleteTest3() throws Exception {
        Product product = productService.create("케냐 뉴조마", 21000, "선명한 산미와 묵직한 바디감이 있는 테스트 원두입니다.", "kenya-nyojoma.jpg");

        mvc.perform(delete("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print())
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("delete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.msg").value("%d번 상품이 삭제되었습니다.".formatted(product.getId())));

        assertThat(productService.findById(product.getId().intValue())).isEmpty();
    }
}
