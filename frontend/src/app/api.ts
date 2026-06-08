export { fallbackProducts } from "@/data/fallbackProducts";
export { API_BASE_URL } from "@/lib/api/client";
export { createOrder, deleteOrder, getAdminOrders, getOrders } from "@/lib/api/orders";
export { createProduct, deleteProduct, getProduct, getProducts } from "@/lib/api/products";
export type { CreateOrderRequest, Order, OrderItem, OrderItemRequest } from "@/types/order";
export type { Product, ProductRequest } from "@/types/product";
