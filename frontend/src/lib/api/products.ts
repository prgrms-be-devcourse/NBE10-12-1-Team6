import { fallbackProducts } from "@/data/fallbackProducts";
import { API_BASE_URL, unwrapRsData } from "@/lib/api/client";
import type { Product, ProductRequest } from "@/types/product";

export function isFallbackProduct(product: Product) {
  return fallbackProducts.some(
    (fallbackProduct) =>
      fallbackProduct.id === product.id &&
      fallbackProduct.name === product.name &&
      fallbackProduct.price === product.price &&
      fallbackProduct.description === product.description &&
      fallbackProduct.imageUrl === product.imageUrl,
  );
}

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

export async function createProduct(product: ProductRequest): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("상품 등록에 실패했습니다.");
  }

  return unwrapRsData<Product>(await response.json());
}

export async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("상품 삭제에 실패했습니다.");
  }
}
