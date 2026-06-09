import { API_BASE_URL, unwrapRsData } from "@/lib/api/client";
import type { Product, ProductRequest } from "@/types/product";

export async function getProductsByPaging(
  searchTerm: string = "",
  page: number = 0,
  size: number = 10,
): Promise<{ content: Product[]; totalElements: number }> {
  const query = new URLSearchParams({
    searchTerm,
    page: page.toString(),
    size: size.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/v1/products/page?${query.toString()}`);

  if (!response.ok) {
    throw new Error("상품 목록 조회에 실패했습니다.");
  }

  return unwrapRsData(await response.json());
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const products = (await response.json()) as Product[];
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}

export async function getProduct(productId: number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as Product;
  } catch {
    return null;
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

export async function updateProduct(
  productId: number,
  product: ProductRequest,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("상품 수정에 실패했습니다.");
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("상품 삭제에 실패했습니다.");
  }
}
