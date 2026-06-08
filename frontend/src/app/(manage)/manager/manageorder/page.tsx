"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { deleteOrder, getAdminOrders, type Order } from "@/app/api";
import { formatDate, formatPrice } from "@/lib/format";

const PAGE_SIZE = 5;
const SUCCESS_HIDE_DELAY = 3200;

function formatInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  return {
    startDate: formatInputDate(startDate),
    endDate: formatInputDate(endDate),
  };
}

function toStartDateTime(date: string) {
  return `${date}T00:00:00`;
}

function toEndDateTime(date: string) {
  return `${date}T23:59:59`;
}

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
      return "처리 전";
    case "AFTER_PROCESSING":
      return "처리 후";
    default:
      return status || "상태 없음";
  }
}

function getStatusClass(status: string) {
  return status === "AFTER_PROCESSING"
    ? "bg-[#ffca98]/40 text-[#7a532a]"
    : "bg-[#ffdad6] text-[#93000a]";
}

export default function ManageOrderPage() {
  const successTimerId = useRef<number | undefined>(undefined);
  const defaultDateRange = useMemo(() => getDefaultDateRange(), []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDeleteOrder, setPendingDeleteOrder] = useState<Order | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadOrders = useCallback(async (start: string, end: string) => {
    if (!start || !end) {
      setErrorMessage("조회 기간을 모두 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    setOrders(await getAdminOrders(toStartDateTime(start), toEndDateTime(end)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (successTimerId.current) {
        window.clearTimeout(successTimerId.current);
      }
    };
  }, []);

  useEffect(() => {
    const animationId = window.requestAnimationFrame(() => {
      void loadOrders(defaultDateRange.startDate, defaultDateRange.endDate);
    });

    return () => window.cancelAnimationFrame(animationId);
  }, [defaultDateRange.endDate, defaultDateRange.startDate, loadOrders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return orders;
    }

    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    void loadOrders(startDate, endDate);
  };

  const handleRequestDelete = (order: Order) => {
    setSuccessMessage("");
    setErrorMessage("");
    setPendingDeleteOrder(order);
  };

  const handleCancelDelete = () => {
    setPendingDeleteOrder(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteOrder) {
      return;
    }

    setIsDeleting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await deleteOrder(pendingDeleteOrder.id);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== pendingDeleteOrder.id),
      );
      setSuccessMessage(`주문 #${pendingDeleteOrder.id}이 삭제되었습니다.`);
      setPendingDeleteOrder(null);

      if (successTimerId.current) {
        window.clearTimeout(successTimerId.current);
      }

      successTimerId.current = window.setTimeout(() => {
        setSuccessMessage("");
      }, SUCCESS_HIDE_DELAY);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "주문 삭제에 실패했습니다.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-7xl px-5 py-10 text-[#1b1c1a] md:px-10 lg:px-16">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7d562d]">
            Admin
          </p>
          <h1 className="text-4xl font-bold leading-tight text-[#130805]">
            주문 현황 관리
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#4f4542]">
            기간별 주문 내역을 조회하고 처리 상태별로 확인합니다.
          </p>
        </header>

        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-5 rounded-xl border border-[#d2c3bf]/40 bg-[#f4f4f0] p-5 md:flex-row md:items-end"
        >
        <div className="flex-1">
          <label className="mb-2 block text-sm font-bold text-[#4f4542]">
            조회 기간
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <input
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-12 rounded-lg border border-[#d2c3bf] bg-white px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
              type="date"
            />
            <span className="hidden text-[#817471] sm:block">~</span>
            <input
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="h-12 rounded-lg border border-[#d2c3bf] bg-white px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
              type="date"
            />
          </div>
        </div>

        <label className="w-full md:w-48">
          <span className="mb-2 block text-sm font-bold text-[#4f4542]">
            처리 상태
          </span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-white px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
          >
            <option value="all">전체 상태</option>
            <option value="BEFORE_PROCESSING">처리 전</option>
            <option value="AFTER_PROCESSING">처리 후</option>
          </select>
        </label>

        <button
          type="submit"
          className="h-12 rounded-lg bg-[#130805] px-8 text-sm font-semibold text-white shadow-sm shadow-[#130805]/10 transition-colors hover:bg-[#7d562d] active:scale-95"
        >
          검색하기
        </button>
        </form>

        {errorMessage ? (
          <p className="mb-6 rounded-lg bg-[#ffdad6] px-4 py-3 text-sm font-semibold text-[#93000a]">
            {errorMessage}
          </p>
        ) : null}

        <section className="overflow-hidden rounded-xl border border-[#d2c3bf]/40 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#d2c3bf]/30 bg-[#f4f4f0] text-xs font-bold uppercase tracking-wider text-[#4f4542]">
                <th className="w-28 px-6 py-4 text-left">주문 번호</th>
                <th className="w-36 px-6 py-4 text-left">주문 일시</th>
                <th className="w-56 px-6 py-4 text-left">고객 이메일</th>
                <th className="px-6 py-4 text-left">상품 내역</th>
                <th className="w-36 px-6 py-4 text-right">총 주문 금액</th>
                <th className="w-28 px-6 py-4 text-center">진행 상태</th>
                <th className="w-32 px-6 py-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d2c3bf]/20">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#4f4542]">
                    주문 내역을 불러오는 중입니다.
                  </td>
                </tr>
              ) : visibleOrders.length > 0 ? (
                visibleOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-[#f4f4f0]/70"
                  >
                    <td className="px-6 py-5 text-left font-bold text-[#130805]">
                      #{order.id}
                    </td>
                    <td className="px-6 py-5 text-left text-[#4f4542]">
                      {formatDate(order.createDate)}
                    </td>
                    <td className="truncate px-6 py-5 text-left text-[#130805]">
                      {order.email}
                    </td>
                    <td className="truncate px-6 py-5 text-left font-medium text-[#130805]">
                      {getOrderTitle(order)}
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-[#130805]">
                      {formatPrice(order.price)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex justify-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRequestDelete(order)}
                        className="min-w-16 whitespace-nowrap rounded-lg border border-[#d2c3bf] px-4 py-2 text-sm font-semibold text-[#93000a] transition-colors hover:border-[#ba1a1a] hover:bg-[#ffdad6]"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#4f4542]">
                    조회된 주문 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#d2c3bf]/30 bg-[#f4f4f0]/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-[#4f4542]">
            전체 {filteredOrders.length}건 중{" "}
            {filteredOrders.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-
            {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}건 표시
          </span>
          <div className="flex justify-center gap-2">
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
        </div>
        </section>
      </main>

      <aside
        aria-live="polite"
        className={`fixed inset-x-0 bottom-0 z-[70] px-5 pb-5 transition-transform duration-300 ease-out md:px-16 ${
          pendingDeleteOrder ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {pendingDeleteOrder ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-[#d2c3bf]/70 bg-[#f4f4f0] p-4 text-[#130805] shadow-2xl shadow-[#130805]/20 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#7d562d]">
                이 주문을 삭제할까요?
              </p>
              <p className="mt-1 font-semibold">
                #{pendingDeleteOrder.id} · {pendingDeleteOrder.email}
              </p>
              <p className="mt-1 text-sm text-[#4f4542]">
                {getOrderTitle(pendingDeleteOrder)}
              </p>
            </div>
            <div className="flex gap-3 sm:flex-none">
              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-[#d2c3bf] px-5 py-3 text-sm font-semibold text-[#4f4542] transition-colors hover:border-[#7d562d] hover:text-[#130805] disabled:opacity-50 sm:flex-none"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-[#2c1e1a] px-5 py-3 text-sm font-semibold text-[#f9f5eb] transition-colors hover:bg-[#7d562d] disabled:opacity-50 sm:flex-none"
              >
                {isDeleting ? "삭제 중" : "확인"}
              </button>
            </div>
          </div>
        ) : null}
      </aside>

      <aside
        aria-live="polite"
        className={`fixed inset-x-0 bottom-0 z-[65] px-5 pb-5 transition-transform duration-300 ease-out md:px-16 ${
          successMessage && !pendingDeleteOrder
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >
        {successMessage && !pendingDeleteOrder ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-[#d2c3bf]/70 bg-[#2c1e1a] px-5 py-4 text-[#f9f5eb] shadow-2xl shadow-[#130805]/25 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#f0bd8b]">
                주문 삭제 완료
              </p>
              <p className="mt-1 text-sm text-[#f7ddd6]">{successMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="inline-flex items-center justify-center rounded-lg bg-[#f9f5eb] px-5 py-3 text-sm font-semibold text-[#130805] transition-colors hover:bg-[#ffca98]"
            >
              확인
            </button>
          </div>
        ) : null}
      </aside>
    </>
  );
}
