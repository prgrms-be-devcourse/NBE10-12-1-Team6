import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type { CartItem } from "@/types/cart";

const CART_STORAGE_KEY =
  process.env.NEXT_PUBLIC_CART_STORAGE_KEY || "cart-items";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

type CartState = {
  items: CartItem[];
  lastAddedAt: number;
  addCartItem: (item: CartItem) => CartItem[];
  updateCartItem: (productId: number, quantity: number) => CartItem[];
  removeCartItem: (productId: number) => CartItem[];
  clearCartItems: () => void;
  getCartItems: () => CartItem[];
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedAt: 0,

      addCartItem: ({ productId, quantity = 1 }) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === productId,
          );

          const items = existingItem
            ? state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              )
            : [...state.items, { productId, quantity }];

          return {
            items,
            lastAddedAt: Date.now(),
          };
        });

        return get().items;
      },

      updateCartItem: (productId, quantity) => {
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                ),
        }));

        return get().items;
      },

      removeCartItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));

        return get().items;
      },

      clearCartItems: () => {
        set({ items: [] });
      },

      getCartItems: () => get().items,
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function getCartItems() {
  return useCartStore.getState().getCartItems();
}

export function addCartItem(item: CartItem) {
  return useCartStore.getState().addCartItem(item);
}

export function updateCartItem(productId: number, quantity: number) {
  return useCartStore.getState().updateCartItem(productId, quantity);
}

export function removeCartItem(productId: number) {
  return useCartStore.getState().removeCartItem(productId);
}

export function clearCartItems() {
  return useCartStore.getState().clearCartItems();
}
