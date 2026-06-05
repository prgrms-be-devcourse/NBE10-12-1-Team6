import { API_BASE_URL } from "@/lib/api/client";
import type { CreateOrderRequest, Order } from "@/types/order";

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
