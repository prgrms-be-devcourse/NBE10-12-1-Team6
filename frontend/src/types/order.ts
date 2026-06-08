export type OrderItemRequest = {
  productId: number;
  quantity: number;
};

export type OrderStatus = "BEFORE_PROCESSING" | "AFTER_PROCESSING";

export type UpdateOrderStatusRequest = {
  status: OrderStatus;
};

export type CreateOrderRequest = {
  email: string;
  zipCode: string;
  address1: string;
  address2: string;
  orderItems: OrderItemRequest[];
};

export type OrderItem = {
  id: number | null;
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
  status: OrderStatus;
  price: number;
  orderItems: OrderItem[];
};
