"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCartStore } from "../stores/cartstore";

const HIDE_DELAY = Number(
  process.env.NEXT_PUBLIC_STORE_BAR_HIDE_DELAY_MS || 3600,
);

type CartItem = {
  productId: number;
  quantity: number;
};

export default function StoreBar() {
  const [isVisible, setIsVisible] = useState(false);
  const timerId = useRef<number | undefined>(undefined);
  const didMount = useRef(false);
  const lastAddedAt = useCartStore((state) => state.lastAddedAt);
  const totalQuantity = useCartStore((state) =>
    (state.items as CartItem[]).reduce(
      (total: number, item: CartItem) => total + item.quantity,
      0,
    ),
  );

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    if (lastAddedAt < 1 || totalQuantity < 1) {
      return;
    }

    window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY);
  }, [lastAddedAt, totalQuantity]);

  useEffect(() => {
    return () => {
      if (timerId.current) {
        window.clearTimeout(timerId.current);
      }
    };
  }, []);

  return (
    <aside
      aria-live="polite"
      className={`fixed inset-x-0 bottom-0 z-[60] px-5 pb-5 transition-transform duration-300 ease-out md:px-16 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-[#d2c3bf]/70 bg-[#2c1e1a] px-5 py-4 text-[#f9f5eb] shadow-2xl shadow-[#130805]/25 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#f0bd8b]">
            장바구니에 상품을 담았습니다
          </p>
          <p className="mt-1 text-sm text-[#f7ddd6]">
            현재 장바구니에 {totalQuantity}개의 상품이 있습니다.
          </p>
        </div>
        <Link
          href="/products/payment"
          className="inline-flex items-center justify-center rounded-lg bg-[#f9f5eb] px-5 py-3 text-sm font-semibold text-[#130805] transition-colors hover:bg-[#ffca98]"
        >
          장바구니 가기
        </Link>
      </div>
    </aside>
  );
}
