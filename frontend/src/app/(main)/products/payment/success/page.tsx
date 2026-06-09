"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../../../../../../component/Footer";
import { formatPrice } from "@/lib/format";
import { extractOrder } from "@/lib/orderResponse";
import { useCartStore } from "@/stores/cartStore";
import type { Order } from "@/types/order";

export default function PaymentSuccessPage() {
  const clearCartItems = useCartStore((state) => state.clearCartItems);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderEmail, setOrderEmail] = useState("");

  useEffect(() => {
    window.requestAnimationFrame(() => {
      const storedOrder = window.sessionStorage.getItem("last-order");
      const storedEmail = window.sessionStorage.getItem("last-order-email");

      if (storedOrder) {
        try {
          setOrder(extractOrder(JSON.parse(storedOrder)));
        } catch {
          setOrder(null);
        }
      }

      if (storedEmail) {
        setOrderEmail(storedEmail);
      }

      clearCartItems();
    });
  }, [clearCartItems]);

  const orderItems = order?.orderItems ?? [];
  const totalPrice =
    order?.price ??
    orderItems.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0,
    );
  const orderListHref = orderEmail
    ? `/orders?email=${encodeURIComponent(orderEmail)}`
    : "/orders";

  return (
    <>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf9f5] px-5 py-28 text-[#1b1c1a]">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -left-[5%] -top-[10%] h-[40%] w-[40%] rounded-full bg-[#ffdcbd] blur-[120px]" />
          <div className="absolute -right-[5%] bottom-[10%] h-[30%] w-[30%] rounded-full bg-[#f7ddd6] blur-[100px]" />
        </div>

        <section className="relative z-10 w-full max-w-2xl text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#1e3932]/10">
            <span className="text-5xl font-bold text-[#1e3932]">✓</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-[#130805] md:text-5xl">
              주문이 완료되었습니다!
            </h1>
            <p className="mx-auto max-w-md text-lg leading-8 text-[#4f4542]">
              장인의 손길로 갓 볶아낸 커피가 곧 당신을 찾아갑니다.
            </p>
          </div>

          <div className="mt-10 rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] p-6 text-left shadow-sm md:p-8">
            <div className="flex items-center justify-between border-b border-[#d2c3bf]/40 pb-4">
              <span className="text-sm font-semibold text-[#4f4542]">
                주문 번호
              </span>
              <span className="text-2xl font-semibold tracking-wide text-[#130805]">
                {order ? order.id : "-"}
              </span>
            </div>

            <div className="mt-6">
              <h2 className="mb-4 text-xl font-semibold text-[#130805]">
                주문 내역
              </h2>
              {orderItems.length > 0 ? (
                <div className="divide-y divide-[#d2c3bf]/40 overflow-hidden rounded-lg border border-[#d2c3bf]/40 bg-white">
                  {orderItems.map((item, index) => (
                    <div
                      key={`${item.id ?? "order-item"}-${item.productId}-${index}`}
                      className="grid grid-cols-[1fr_auto] gap-4 p-4"
                    >
                      <div>
                        <p className="font-semibold text-[#130805]">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-sm text-[#4f4542]">
                          {formatPrice(item.productPrice)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-[#7d562d]">
                        {formatPrice(item.productPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-[#d2c3bf]/40 bg-white p-4 text-[#4f4542]">
                  주문 내역을 불러올 수 없습니다.
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#d2c3bf]/40 pt-5">
              <span className="text-lg font-semibold text-[#130805]">
                총 결제 금액
              </span>
              <span className="text-3xl font-bold text-[#a67c52]">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <p className="mt-6 text-center text-sm italic text-[#4f4542]/70">
              주문 상태는 주문 확인하기 페이지에서 확인 가능합니다.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={orderListHref}
              className="w-full rounded-lg bg-[#130805] px-10 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-[#130805]/10 transition-colors hover:bg-[#a67c52] sm:w-auto"
            >
              주문 확인하기
            </Link>
            <Link
              href="/"
              className="w-full rounded-lg border border-[#130805] px-10 py-4 text-center text-sm font-semibold text-[#130805] transition-colors hover:bg-[#130805]/5 sm:w-auto"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
