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
    @DisplayName("상품 생성 테스트 - 에티오피아 예가체프 G1")
    void createProductTest1() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "에티오피아 예가체프 G1",
                                            "price": 24000,
                                            "description": "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.",
                                            "imageUrl": "ethiopia.jpg"
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
                .andExpect(jsonPath("$.data.name").value("에티오피아 예가체프 G1"))
                .andExpect(jsonPath("$.data.price").value(24000))
                .andExpect(jsonPath("$.data.description").value("화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다."))
                .andExpect(jsonPath("$.data.imageUrl").value("ethiopia.jpg"));
    }

    @Test
    @DisplayName("상품 생성 테스트 - 윈터 가든 블렌드")
    void createProductTest2() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "윈터 가든 블렌드",
                                            "price": 18000,
                                            "description": "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.",
                                            "imageUrl": "winter.jpg"
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
                .andExpect(jsonPath("$.data.name").value("윈터 가든 블렌드"))
                .andExpect(jsonPath("$.data.price").value(18000))
                .andExpect(jsonPath("$.data.description").value("고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다."))
                .andExpect(jsonPath("$.data.imageUrl").value("winter.jpg"));
    }

    @Test
    @DisplayName("상품 생성 테스트 - 콜롬비아 수프리모")
    void createProductTest3() throws Exception {
        ResultActions resultActions = mvc
                .perform(
                        post("/api/v1/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "콜롬비아 수프리모",
                                            "price": 21000,
                                            "description": "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.",
                                            "imageUrl": "colombia.jpg"
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
                .andExpect(jsonPath("$.data.name").value("콜롬비아 수프리모"))
                .andExpect(jsonPath("$.data.price").value(21000))
                .andExpect(jsonPath("$.data.description").value("깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다."))
                .andExpect(jsonPath("$.data.imageUrl").value("colombia.jpg"));
    }

    @Test
    @DisplayName("상품 목록 조회 테스트 - 상품 1개")
    void getItemsTest1() throws Exception {
        productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products"))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("에티오피아 예가체프 G1"));
    }

    @Test
    @DisplayName("상품 목록 조회 테스트 - 상품 2개")
    void getItemsTest2() throws Exception {
        productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");
        productService.create("윈터 가든 블렌드", 18000, "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.", "winter.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products"))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("에티오피아 예가체프 G1"))
                .andExpect(jsonPath("$[1].name").value("윈터 가든 블렌드"));
    }

    @Test
    @DisplayName("상품 목록 조회 테스트 - 상품 3개")
    void getItemsTest3() throws Exception {
        productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");
        productService.create("윈터 가든 블렌드", 18000, "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.", "winter.jpg");
        productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products"))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItems"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].name").value("에티오피아 예가체프 G1"))
                .andExpect(jsonPath("$[1].name").value("윈터 가든 블렌드"))
                .andExpect(jsonPath("$[2].name").value("콜롬비아 수프리모"));
    }

    @Test
    @DisplayName("상품 단건 조회 테스트 - 에티오피아 예가체프 G1")
    void getItemTest1() throws Exception {
        Product product = productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId()))
                .andExpect(jsonPath("$.name").value("에티오피아 예가체프 G1"))
                .andExpect(jsonPath("$.price").value(24000))
                .andExpect(jsonPath("$.description").value("화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다."))
                .andExpect(jsonPath("$.imageUrl").value("ethiopia.jpg"));
    }

    @Test
    @DisplayName("상품 단건 조회 테스트 - 윈터 가든 블렌드")
    void getItemTest2() throws Exception {
        Product product = productService.create("윈터 가든 블렌드", 18000, "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.", "winter.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId()))
                .andExpect(jsonPath("$.name").value("윈터 가든 블렌드"))
                .andExpect(jsonPath("$.price").value(18000))
                .andExpect(jsonPath("$.description").value("고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다."))
                .andExpect(jsonPath("$.imageUrl").value("winter.jpg"));
    }

    @Test
    @DisplayName("상품 단건 조회 테스트 - 콜롬비아 수프리모")
    void getItemTest3() throws Exception {
        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        ResultActions resultActions = mvc
                .perform(get("/api/v1/products/%d".formatted(product.getId())))
                .andDo(print());

        resultActions
                .andExpect(handler().handlerType(ApiV1ProductController.class))
                .andExpect(handler().methodName("getItem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(product.getId()))
                .andExpect(jsonPath("$.name").value("콜롬비아 수프리모"))
                .andExpect(jsonPath("$.price").value(21000))
                .andExpect(jsonPath("$.description").value("깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다."))
                .andExpect(jsonPath("$.imageUrl").value("colombia.jpg"));
    }

    @Test
    @DisplayName("상품 수정 테스트 - 에티오피아 예가체프 G1")
    void modifyTest1() throws Exception {
        Product product = productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");

        mvc.perform(
                        put("/api/v1/products/%d".formatted(product.getId()))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "에티오피아 예가체프 G1",
                                            "price": 26000,
                                            "description": "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.",
                                            "imageUrl": "ethiopia.jpg"
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
    @DisplayName("상품 수정 테스트 - 윈터 가든 블렌드")
    void modifyTest2() throws Exception {
        Product product = productService.create("윈터 가든 블렌드", 18000, "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.", "winter.jpg");

        mvc.perform(
                        put("/api/v1/products/%d".formatted(product.getId()))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "윈터 가든 블렌드",
                                            "price": 20000,
                                            "description": "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.",
                                            "imageUrl": "winter.jpg"
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
    @DisplayName("상품 수정 테스트 - 콜롬비아 수프리모")
    void modifyTest3() throws Exception {
        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

        mvc.perform(
                        put("/api/v1/products/%d".formatted(product.getId()))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                            "name": "콜롬비아 수프리모",
                                            "price": 23000,
                                            "description": "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.",
                                            "imageUrl": "colombia.jpg"
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
    @DisplayName("상품 삭제 테스트 - 에티오피아 예가체프 G1")
    void deleteTest1() throws Exception {
        Product product = productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "ethiopia.jpg");

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
    @DisplayName("상품 삭제 테스트 - 윈터 가든 블렌드")
    void deleteTest2() throws Exception {
        Product product = productService.create("윈터 가든 블렌드", 18000, "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.", "winter.jpg");

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
    @DisplayName("상품 삭제 테스트 - 콜롬비아 수프리모")
    void deleteTest3() throws Exception {
        Product product = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "colombia.jpg");

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
