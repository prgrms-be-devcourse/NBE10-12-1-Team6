import { fallbackProducts } from "@/data/fallbackProducts";
import { API_BASE_URL } from "@/lib/api/client";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackProducts;
    }

    const products = (await response.json()) as Product[];
    return Array.isArray(products) && products.length > 0
      ? products
      : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function getProduct(productId: number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackProducts.find((product) => product.id === productId) ?? null;
    }

    return (await response.json()) as Product;
  } catch {
    return fallbackProducts.find((product) => product.id === productId) ?? null;
  }
}
