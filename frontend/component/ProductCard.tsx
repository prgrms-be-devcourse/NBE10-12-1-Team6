"use client";

import Link from "next/link";
import type { Product } from "@/app/api";
import { addCartItem } from "../stores/cartstore";

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);
}

type ProductCardProps = {
  product: Product;
  badge?: string;
};

export default function ProductCard({ product, badge }: ProductCardProps) {
  const handleAddCart = () => {
    addCartItem({ productId: product.id, quantity: 1 });
    window.alert("장바구니에 상품을 담았습니다.");
  };

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] transition-all duration-300 hover:-translate-y-1 hover:border-[#a67c52] hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#efeeea]">
          <div
            aria-label={product.name}
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          />
          {badge ? (
            <span className="absolute left-4 top-4 rounded-full bg-[#7d562d] px-3 py-1 text-xs font-semibold text-white">
              {badge}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link href={`/products/${product.id}`} className="block">
          <h2 className="text-2xl font-semibold leading-tight text-[#130805]">
            {product.name}
          </h2>
          <p className="mt-2 line-clamp-2 min-h-[3.25rem] leading-7 text-[#4f4542]">
            {product.description}
          </p>
        </Link>

        <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-semibold text-[#a67c52]">
            {formatPrice(product.price)}
          </p>
          <button
            type="button"
            onClick={handleAddCart}
            className="rounded-lg bg-[#130805] px-4 py-2 text-sm font-semibold text-white transition-colors active:scale-95 hover:bg-[#7d562d]"
          >
            장바구니 담기
          </button>
        </div>
      </div>
    </article>
  );
}
