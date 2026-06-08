import type { Order } from "@/types/order";
import type { OrderStatus } from "@/types/order";

export function getOrderTitle(order: Order) {
  const [firstItem, ...restItems] = order.orderItems ?? [];

  if (!firstItem) {
    return "주문 상품 없음";
  }

  return restItems.length > 0
    ? `${firstItem.productName} 외 ${restItems.length}건`
    : firstItem.productName;
}

export function getOrderStatusLabel(status: OrderStatus | string) {
  switch (status) {
    case "BEFORE_PROCESSING":
      return "처리 전";
    case "AFTER_PROCESSING":
      return "처리 후";
    default:
      return status || "상태 없음";
  }
}

export function getOrderStatusClass(status: OrderStatus | string) {
  return status === "AFTER_PROCESSING"
    ? "bg-[#ffca98]/40 text-[#7a532a]"
    : "bg-[#ffdad6] text-[#93000a]";
}
