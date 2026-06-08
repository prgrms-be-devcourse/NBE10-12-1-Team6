export { fallbackProducts } from "@/data/fallbackProducts";
export { API_BASE_URL } from "@/lib/api/client";
export {
  createOrder,
  deleteOrder,
  getAdminOrders,
  getOrderItems,
  getOrders,
  updateOrderStatus,
} from "@/lib/api/orders";
export {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  isFallbackProduct,
  updateProduct,
} from "@/lib/api/products";
export type {
  CreateOrderRequest,
  Order,
  OrderItem,
  OrderItemRequest,
  OrderStatus,
  UpdateOrderStatusRequest,
} from "@/types/order";
export type { Product, ProductRequest } from "@/types/product";
