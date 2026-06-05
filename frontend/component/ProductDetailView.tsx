"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Product } from "@/app/api";
import Footer from "./Footer";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";

type ProductDetailViewProps = {
  product: Product | null;
};

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const addCartItem = useCartStore((state) => state.addCartItem);
  const [quantity, setQuantity] = useState(1);

  const totalPrice = useMemo(
    () => (product ? product.price * quantity : 0),
    [product, quantity],
  );

  const changeQuantity = (nextQuantity: number) => {
    setQuantity(Math.max(1, nextQuantity));
  };

  const handleAddCart = () => {
    if (!product) {
      return;
    }

    addCartItem({ productId: product.id, quantity });
  };

  const handleOrderNow = () => {
    if (!product) {
      return;
    }

    addCartItem({ productId: product.id, quantity });
    router.push("/products/payment");
  };

  if (!product) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl bg-[#faf9f5] px-5 pb-24 pt-32 text-[#1b1c1a] md:px-16">
        <div className="rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] p-8">
          <h1 className="text-3xl font-bold text-[#130805]">
            상품을 찾을 수 없습니다
          </h1>
          <p className="mt-3 text-[#4f4542]">
            요청하신 상품 정보가 존재하지 않습니다.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex rounded-lg bg-[#130805] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7d562d]"
          >
            상품 목록으로 이동
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl bg-[#faf9f5] px-5 pb-24 pt-32 text-[#1b1c1a] md:px-16">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12">
          <section className="md:col-span-6">
            <div className="mx-auto aspect-[4/3] max-w-2xl overflow-hidden rounded-xl border border-[#d2c3bf]/40 bg-[#f4f4f0]">
              <div
                aria-label={product.name}
                className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              />
            </div>
            <div className="mx-auto mt-5 grid max-w-2xl grid-cols-1 overflow-hidden rounded-xl border border-[#d2c3bf]/40 bg-white sm:grid-cols-3">
              {["당일 로스팅", "안전 포장", "빠른 결제"].map((label) => (
                <div
                  key={label}
                  className="border-b border-[#d2c3bf]/30 px-5 py-4 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                >
                  <p className="text-sm font-semibold text-[#130805]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="sticky top-32 flex flex-col gap-8 md:col-span-6">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#ffca98] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#7a532a]">
                  Coffee Selection
                </span>
                <span className="text-sm font-medium text-[#4f4542]">
                  Team6 Roastery
                </span>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-[#130805]">
                {product.name}
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#4f4542]">
                {product.description}
              </p>
            </div>

            <div className="text-4xl font-bold text-[#130805]">
              {formatPrice(product.price)}
            </div>

            <div className="rounded-xl border border-[#d2c3bf]/40 bg-[#f4f4f0] p-6">
              <label className="mb-3 block text-sm font-semibold text-[#4f4542]">
                수량 선택
              </label>
              <div className="flex items-center justify-between gap-4">
                <div className="flex overflow-hidden rounded-lg border border-[#d2c3bf] bg-white">
                  <button
                    type="button"
                    onClick={() => changeQuantity(quantity - 1)}
                    className="h-11 w-12 text-xl font-semibold text-[#130805] transition-colors hover:bg-[#e9e8e4]"
                  >
                    -
                  </button>
                  <input
                    value={quantity}
                    min="1"
                    type="number"
                    readOnly
                    aria-label="선택 수량"
                    className="h-11 w-16 border-x border-[#d2c3bf] bg-transparent p-0 text-center text-lg font-semibold leading-[2.75rem] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => changeQuantity(quantity + 1)}
                    className="h-11 w-12 text-xl font-semibold text-[#130805] transition-colors hover:bg-[#e9e8e4]"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#817471]">
                    총 주문 금액
                  </p>
                  <p className="text-2xl font-bold text-[#7d562d]">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleOrderNow}
                className="w-full rounded-xl bg-[#130805] py-5 text-xl font-semibold text-white shadow-lg shadow-[#130805]/10 transition-colors active:scale-[0.98] hover:bg-[#7d562d]"
              >
                바로 주문
              </button>
              <button
                type="button"
                onClick={handleAddCart}
                className="w-full rounded-xl border-2 border-[#130805] bg-transparent py-5 text-xl font-semibold text-[#130805] transition-colors active:scale-[0.98] hover:bg-[#f7ddd6]"
              >
                장바구니
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
