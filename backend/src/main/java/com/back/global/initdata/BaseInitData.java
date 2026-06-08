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

        Product p1 = productService.create("에티오피아 예가체프 G1", 24000, "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p2 = productService.create("윈터 가든 블렌드", 18000, "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p3 = productService.create("콜롬비아 수프리모", 21000, "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p4 = productService.create("과테말라 안티구아", 23000, "카카오 같은 단맛과 은은한 스파이스 향이 조화로운 클래식 싱글 오리진입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p5 = productService.create("브라질 세하도 내추럴", 19000, "견과류와 밀크초콜릿의 고소함이 부드럽게 이어지는 데일리 커피입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p6 = productService.create("케냐 AA 니에리", 27000, "블랙커런트와 자몽을 닮은 선명한 산미가 매력적인 프리미엄 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p7 = productService.create("인도네시아 만델링", 22000, "묵직한 바디감과 허브 향, 낮은 산미가 어우러지는 깊은 풍미의 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p8 = productService.create("코스타리카 따라주", 25000, "사과 같은 산뜻함과 캐러멜 단맛이 균형을 이루는 워시드 커피입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p9 = productService.create("파나마 게이샤 셀렉션", 42000, "자스민 향과 복숭아의 단맛이 섬세하게 펼쳐지는 한정 수량 스페셜티입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p10 = productService.create("디카페인 콜롬비아", 21000, "밤에도 편안하게 즐길 수 있도록 부드러운 단맛을 살린 디카페인 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p11 = productService.create("하우스 에스프레소 블렌드", 20000, "초콜릿과 구운 아몬드 향이 진하게 남아 우유와도 잘 어울리는 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p12 = productService.create("모닝 라이트 블렌드", 18500, "가볍고 산뜻한 첫 모금을 위해 시트러스 계열의 밝은 향을 살린 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p13 = productService.create("선셋 모카 블렌드", 20500, "코코아의 달콤함과 은은한 베리 향이 늦은 오후에 잘 어울리는 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p14 = productService.create("르완다 후예 마운틴", 26000, "레드베리와 홍차의 뉘앙스가 깔끔하게 이어지는 산뜻한 아프리칸 커피입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p15 = productService.create("탄자니아 킬리만자로", 24500, "선명한 산미와 감귤류 향, 깔끔한 후미가 특징인 활기 있는 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p16 = productService.create("엘살바도르 파카마라", 28000, "열대과일의 단맛과 크리미한 질감이 매력적인 마이크로랏 커피입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p17 = productService.create("멕시코 치아파스", 19500, "부드러운 산미와 고소한 단맛으로 부담 없이 즐기기 좋은 균형 잡힌 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p18 = productService.create("페루 쿠스코 오가닉", 22500, "꿀 같은 단맛과 은은한 허브 향이 차분하게 남는 유기농 인증 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p19 = productService.create("에티오피아 시다모 내추럴", 25500, "딸기잼과 와인 같은 발효 향이 생동감 있게 느껴지는 내추럴 프로세스입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p20 = productService.create("콜롬비아 핑크 버번", 31000, "플로럴 향과 열대과일의 단맛이 선명한 희소 품종 스페셜티 커피입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p21 = productService.create("버터스카치 블렌드", 21500, "버터스카치와 토피넛 향을 중심으로 설계한 달콤하고 묵직한 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p22 = productService.create("오트 라떼 블렌드", 19800, "오트밀크와 함께 마셨을 때 곡물 단맛과 초콜릿 향이 잘 살아나는 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p23 = productService.create("콜드브루 다크 블렌드", 23500, "차갑게 추출했을 때 다크초콜릿과 흑설탕 단맛이 진하게 느껴지는 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p24 = productService.create("핸드드립 스타터 블렌드", 17500, "추출 편차가 적고 균형감이 좋아 핸드드립 입문자에게 알맞은 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p25 = productService.create("시그니처 다크 로스트", 20500, "스모키한 향과 묵직한 단맛을 살린 진한 로스팅의 시그니처 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p26 = productService.create("스프링 플로럴 블렌드", 22500, "꽃향기와 밝은 산미를 중심으로 계절감을 살린 산뜻한 시즌 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p27 = productService.create("서머 아이스 블렌드", 19500, "아이스 커피에서도 향과 단맛이 선명하게 살아나는 청량한 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");
        Product p28 = productService.create("어텀 캐러멜 블렌드", 21800, "캐러멜, 구운 견과, 은은한 시나몬 향이 따뜻하게 감도는 가을 블렌드입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk");
        Product p29 = productService.create("윈터 스파이스 블렌드", 22800, "다크초콜릿과 따뜻한 향신료 뉘앙스가 겨울의 묵직한 분위기를 전합니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o");
        Product p30 = productService.create("Team6 로스터스 초이스", 26000, "시즌별 가장 좋은 생두를 선별해 로스터의 추천 프로파일로 완성한 한정 원두입니다.", "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8");

        Order order1 = orderService.createOrder("base@test.com",
                "경기도 남양주시", "경춘로 789", "12100",
                Map.of(p1.getId(), 3));

        Order order2 = orderService.createOrder("base@test.com",
                "대구광역시 수성구", "노변로 55", "42268",
                Map.of(p2.getId(), 3,
                        p3.getId(), 2));
    }
}
