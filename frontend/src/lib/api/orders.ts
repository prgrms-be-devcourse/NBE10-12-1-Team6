import { fallbackOrders } from "@/data/fallbackOrders";
import { API_BASE_URL, unwrapRsData } from "@/lib/api/client";
import type {
  CreateOrderRequest,
  Order,
  OrderItem,
  OrderStatus,
} from "@/types/order";

function getFallbackOrdersByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return fallbackOrders.filter((order) =>
    order.email.toLowerCase().includes(normalizedEmail),
  );
}

function getFallbackAdminOrders(start: string, end: string) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return fallbackOrders;
  }

  return fallbackOrders.filter((order) => {
    const orderTime = new Date(order.createDate).getTime();
    return orderTime >= startTime && orderTime <= endTime;
  });
}

function isFallbackOrder(orderId: number) {
  return fallbackOrders.some((order) => order.id === orderId);
}

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
    return Array.isArray(orders) && orders.length > 0
      ? orders
      : getFallbackOrdersByEmail(normalizedEmail);
  } catch {
    return getFallbackOrdersByEmail(normalizedEmail);
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
    return Array.isArray(orders) && orders.length > 0
      ? orders
      : getFallbackAdminOrders(start, end);
  } catch {
    return getFallbackAdminOrders(start, end);
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<Order> {
  if (isFallbackOrder(orderId)) {
    const fallbackOrder = fallbackOrders.find((order) => order.id === orderId);

    if (!fallbackOrder) {
      throw new Error("주문을 찾을 수 없습니다.");
    }

    return {
      ...fallbackOrder,
      status,
      modifyDate: new Date().toISOString(),
    };
  }

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
  const fallbackOrder = fallbackOrders.find((order) => order.id === orderId);

  if (fallbackOrder) {
    return fallbackOrder.orderItems;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/items`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("주문 상품 목록 조회에 실패했습니다.");
  }

  return unwrapRsData<OrderItem[]>(await response.json());
}

export async function deleteOrder(orderId: number): Promise<void> {
  if (isFallbackOrder(orderId)) {
    return;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("주문 삭제에 실패했습니다.");
  }
}
