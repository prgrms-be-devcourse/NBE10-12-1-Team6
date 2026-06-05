const CART_STORAGE_KEY = "cart-items";

function readCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
}

function writeCartItems(items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-items-change"));
}

export function getCartItems() {
  return readCartItems();
}

export function addCartItem({ productId, quantity = 1 }) {
  const cartItems = readCartItems();
  const existingItem = cartItems.find((item) => item.productId === productId);

  if (existingItem) {
    const nextItems = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    );
    writeCartItems(nextItems);
    return nextItems;
  }

  const nextItems = [...cartItems, { productId, quantity }];
  writeCartItems(nextItems);
  return nextItems;
}

export function updateCartItem(productId, quantity) {
  const nextItems =
    quantity <= 0
      ? readCartItems().filter((item) => item.productId !== productId)
      : readCartItems().map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );

  writeCartItems(nextItems);
  return nextItems;
}

export function removeCartItem(productId) {
  const nextItems = readCartItems().filter((item) => item.productId !== productId);
  writeCartItems(nextItems);
  return nextItems;
}

export function clearCartItems() {
  writeCartItems([]);
}
