export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};

export type OrderItemRequest = {
  productId: number;
  quantity: number;
};

export type CreateOrderRequest = {
  email: string;
  zipCode: string;
  address1: string;
  address2: string;
  orderItems: OrderItemRequest[];
};

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
};

export type Order = {
  id: number;
  createDate: string;
  modifyDate: string;
  email: string;
  zipCode: string;
  address1: string;
  address2: string;
  status: string;
  price: number;
  orderItems: OrderItem[];
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "에티오피아 예가체프 G1",
    price: 24000,
    description: "화사한 꽃향기와 세련된 산미가 은은하게 이어지는 싱글 오리진 원두입니다.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEWNLNnJ5Hy4LuRWWEqlrhMvJA48j4oJLXGaH_6ZuQnEVVDmnnbompokn57fOVJftMjW36qHVilFm5Pr7rHNf-M8iADz6crCZ0-1LKoMF9SLw7UMLp3aLAYriCanuH7pWAciz6oh270z5Tn9_8SrRnNRARPWYRINV2shFyM3b4KGJ033UyV5gCH25Mn0UoyhIv4I3YKZY8--Zd7gYBMRsSaepELLyMLyzflZisg_zyJw8ksypY1l8EA-QA9-sWXRfMTX-7l2GwfYk",
  },
  {
    id: 2,
    name: "윈터 가든 블렌드",
    price: 18000,
    description: "고소한 견과 향과 부드러운 단맛이 균형을 이루는 시즌 블렌드입니다.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdhrmUBUsvDSYaHRrvuLsjw6iR4ex9AXkyZATZJyEWksXOLX0YAbfId8W60JIokglmebcyYIPG9kvYlD6UUFIgmsUSismH_s3PwjxhGReY1HFM4WjuKm3GG_ky5upLA3bx97rckSEphn49kLVl2hj15EKXtoLbWEO8WFGCRYUmM3Rl8J3zlPRIFPdDrMKnTOQDoH2-RYqEqSKugyTrq9iNjKKPVKmuDPDPU-7RzPV0orWicGS6_yDNsUXqPNbRsqk09lB9BYKKf3o",
  },
  {
    id: 3,
    name: "콜롬비아 수프리모",
    price: 21000,
    description: "깨끗한 단맛과 묵직한 바디감으로 매일 마시기 좋은 원두입니다.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLUIQCHdNMDK5DuFCtkU8NcHt-_XflT29T8kLZAceDcKUFBW7FBpPwBJOCfQwfpKi8HlqnoHgzQL3PRfVyYr1P_ql7EfJzGlQc5L-KhohIOhhJEiSPIrakrLZd7kjWECSzeSrJsM3KRJukT98TSToAY1pcZsH5tGxo2gAYypYw_idg-20kjO6zAf9qWeRRhuKxJwK3rBRKRvvpMAXJG0UMOTBeBoMX5avm-6dJdg3BF0Gfp_OfCPBVklk-bI1VYH2hcF2gEwaBIi8",
  },
];

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackProducts;
    }

    const products = (await response.json()) as Product[];
    return Array.isArray(products) && products.length > 0
      ? products
      : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function createOrder(order: CreateOrderRequest): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("주문 생성에 실패했습니다.");
  }

  return await response.json();
}

export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const orders = (await response.json()) as Order[];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}
