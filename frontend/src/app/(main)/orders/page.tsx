"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Footer from "../../../../component/Footer";
import { formatDate, formatPrice } from "@/lib/format";
import { getOrders, type Order } from "../../api";

const PAGE_SIZE = 5;

function getOrderTitle(order: Order) {
  const [firstItem, ...restItems] = order.orderItems ?? [];

  if (!firstItem) {
    return "주문 상품 없음";
  }

  return restItems.length > 0
    ? `${firstItem.productName} 외 ${restItems.length}건`
    : firstItem.productName;
}

function getStatusLabel(status: string) {
  switch (status) {
    case "BEFORE_PROCESSING":
      return "주문 확인";
    case "PROCESSING":
      return "배송 준비";
    case "SHIPPING":
      return "배송 중";
    case "COMPLETED":
      return "배송 완료";
    case "CANCELED":
      return "주문 취소";
    default:
      return status || "상태 없음";
  }
}

function getStatusClass(status: string) {
  if (status === "COMPLETED") {
    return "bg-[#1e3932]/10 text-[#1e3932]";
  }

  if (status === "SHIPPING" || status === "PROCESSING") {
    return "bg-[#ffca98]/30 text-[#7d562d]";
  }

  if (status === "CANCELED") {
    return "bg-[#ffdad6] text-[#93000a]";
  }

  return "bg-[#d2c3bf]/30 text-[#4f4542]";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const email = searchParams.get("email") ?? "";

      setEmailInput(email);
      setSearchedEmail(email);
      setOrders(await getOrders());
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const normalizedEmail = searchedEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      return orders;
    }

    return orders.filter((order) =>
      order.email.toLowerCase().includes(normalizedEmail),
    );
  }, [orders, searchedEmail]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchedEmail(emailInput);
    setPage(1);
  };

  return (
    <>
      <main className="relative mx-auto min-h-screen max-w-7xl overflow-hidden bg-[#faf9f5] px-5 pb-24 pt-32 text-[#1b1c1a] md:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -right-64 top-1/2 h-[760px] w-[760px] -translate-y-1/2 rounded-full bg-[#2c1e1a]/5"
        />

        <section className="relative z-10 mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7d562d]">
            Order History
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-[#130805] md:text-5xl">
            주문 목록
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#4f4542]">
            이메일 주소를 입력하여 주문 내역과 처리 상태를 확인할 수 있습니다.
          </p>
        </section>

        <section className="relative z-10 mb-12">
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <input
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              className="h-16 w-full rounded-xl border border-[#d2c3bf] bg-[#f4f4f0] px-6 pr-32 text-base outline-none transition-all placeholder:text-[#817471] focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
              placeholder="이메일 주소를 입력하세요"
              type="email"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#130805] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7d562d] active:scale-95"
            >
              검색
            </button>
          </form>
        </section>

        <section className="relative z-10 overflow-hidden rounded-2xl border border-[#d2c3bf]/40 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse">
              <thead>
                <tr className="border-b border-[#d2c3bf]/40 bg-[#f4f4f0]">
                  <th className="px-8 py-6 text-left text-xs font-semibold uppercase tracking-wider text-[#4f4542]">
                    주문 번호
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-semibold uppercase tracking-wider text-[#4f4542]">
                    주문 날짜
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-semibold uppercase tracking-wider text-[#4f4542]">
                    상품 내역
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-semibold uppercase tracking-wider text-[#4f4542]">
                    총 결제 금액
                  </th>
                  <th className="px-8 py-6 text-right text-xs font-semibold uppercase tracking-wider text-[#4f4542]">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d2c3bf]/20">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-[#4f4542]">
                      주문 내역을 불러오는 중입니다.
                    </td>
                  </tr>
                ) : visibleOrders.length > 0 ? (
                  visibleOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-[#f4f4f0]/70"
                    >
                      <td className="px-8 py-6 font-semibold text-[#130805]">
                        #{order.id}
                      </td>
                      <td className="px-8 py-6 text-[#4f4542]">
                        {formatDate(order.createDate)}
                      </td>
                      <td className="px-8 py-6 font-medium text-[#130805]">
                        {getOrderTitle(order)}
                      </td>
                      <td className="px-8 py-6 font-bold text-[#130805]">
                        {formatPrice(order.price)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            order.status,
                          )}`}
                        >
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-[#4f4542]">
                      조회된 주문 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-2 border-t border-[#d2c3bf]/30 bg-[#f4f4f0]/60 px-8 py-4">
            <button
              type="button"
              onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
              disabled={currentPage === 1}
              className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold text-[#4f4542] transition-colors hover:bg-[#e3e2df] disabled:opacity-40"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === pageNumber
                      ? "bg-[#130805] text-white"
                      : "text-[#4f4542] hover:bg-[#e3e2df]"
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() =>
                setPage((prevPage) => Math.min(totalPages, prevPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold text-[#4f4542] transition-colors hover:bg-[#e3e2df] disabled:opacity-40"
            >
              다음
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
