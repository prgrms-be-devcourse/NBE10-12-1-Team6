import { API_BASE_URL } from "@/lib/api/client";
import type { Order } from "@/types/order";

export { API_BASE_URL };
export {
  createOrder,
  deleteOrder,
  getOrderItems,
  getOrders,
  getAdminOrders,
  getProductSalesBetween,
  getSalesBetween,
  updateOrderStatus,
} from "@/lib/api/orders";
export {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
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
export type { ProductSale } from "@/types/product";
