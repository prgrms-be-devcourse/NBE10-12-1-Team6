import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";

export type CartProduct = CartItem & {
  product: Product;
};

export type DeliveryFormState = {
  recipientName: string;
  phone: string;
  email: string;
  zipCode: string;
  address1: string;
  address2: string;
};
