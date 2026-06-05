import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const CART_STORAGE_KEY =
  process.env.NEXT_PUBLIC_CART_STORAGE_KEY || "cart-items";

export const useCartStore = create(
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function getCartItems() {
  return useCartStore.getState().getCartItems();
}

export function addCartItem(item) {
  return useCartStore.getState().addCartItem(item);
}

export function updateCartItem(productId, quantity) {
  return useCartStore.getState().updateCartItem(productId, quantity);
}

export function removeCartItem(productId) {
  return useCartStore.getState().removeCartItem(productId);
}

export function clearCartItems() {
  return useCartStore.getState().clearCartItems();
}
