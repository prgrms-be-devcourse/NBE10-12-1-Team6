import { API_BASE_URL, unwrapRsData } from "@/lib/api/client";
import type {
  CreateOrderRequest,
  Order,
  OrderItem,
  OrderStatus,
} from "@/types/order";
import type { ProductSale } from "@/types/product";

export async function createOrder(order: CreateOrderRequest): Promise<Order> {
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

  return unwrapRsData<Order>(await response.json());
}

export async function getOrders(email: string): Promise<Order[]> {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      email: normalizedEmail,
    });
    const response = await fetch(`${API_BASE_URL}/api/v1/orders?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const orders = unwrapRsData<Order[]>(await response.json());
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export async function getAdminOrders(start: string, end: string): Promise<Order[]> {
  try {
    const params = new URLSearchParams({
      start,
      end,
    });
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const orders = unwrapRsData<Order[]>(await response.json());
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

export async function getSalesBetween(start: string, end: string): Promise<number> {
  try {
    const params = new URLSearchParams({
      start,
      end,
    });
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/admin/sales?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return 0;
    }

    return unwrapRsData<number>(await response.json());
  } catch {
    return 0;
  }
}

export async function getProductSalesBetween(
  start: string,
  end: string,
): Promise<ProductSale[]> {
  try {
    const params = new URLSearchParams({
      start,
      end,
    });
    const response = await fetch(
      `${API_BASE_URL}/api/v1/orders/admin/sales/product?${params}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const productSales = unwrapRsData<ProductSale[]>(await response.json());
    return Array.isArray(productSales)
      ? productSales.sort((a, b) => b.sales - a.sales)
      : [];
  } catch {
    return [];
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("주문 상태 변경에 실패했습니다.");
  }

  return unwrapRsData<Order>(await response.json());
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/items`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("주문 상품 목록 조회에 실패했습니다.");
  }

  return unwrapRsData<OrderItem[]>(await response.json());
}

export async function deleteOrder(orderId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("주문 삭제에 실패했습니다.");
  }
}
