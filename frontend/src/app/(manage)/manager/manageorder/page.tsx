"use client";

import {
  FormEvent,
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  deleteOrder,
  getAdminOrders,
  getOrderItems,
  getProducts,
  getProductSalesBetween,
  getSalesBetween,
  updateOrderStatus,
  type Order,
  type OrderItem,
  type ProductSale,
  type OrderStatus,
} from "@/app/api";
import OrderDetailPanel from "../../../../../component/OrderDetailPanel";
import ManagerNotice from "../../../../../component/manage/ManagerNotice";
import ManagerPageHeader from "../../../../../component/manage/ManagerPageHeader";
import ManagerPagination from "../../../../../component/manage/ManagerPagination";
import {
  getDefaultDateRange,
  toEndDateTime,
  toStartDateTime,
} from "@/lib/dateRange";
import { formatDate, formatPrice } from "@/lib/format";
import {
  getOrderStatusClass,
  getOrderStatusLabel,
  getOrderTitle,
} from "@/lib/orderDisplay";

const PAGE_SIZE = 5;
const SUCCESS_HIDE_DELAY = 3200;
const orderStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: "BEFORE_PROCESSING", label: "처리 전" },
  { value: "AFTER_PROCESSING", label: "처리 후" },
];

type RankedProductSale = ProductSale & {
  name: string;
};

export default function ManageOrderPage() {
  const successTimerId = useRef<number | undefined>(undefined);
  const defaultDateRange = useMemo(() => getDefaultDateRange(), []);
  const [orders, setOrders] = useState<Order[]>([]);
  const [periodSales, setPeriodSales] = useState(0);
  const [rankedProductSales, setRankedProductSales] = useState<
    RankedProductSale[]
  >([]);
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusOrderId, setUpdatingStatusOrderId] = useState<
    number | null
  >(null);
  const [pendingDeleteOrder, setPendingDeleteOrder] = useState<Order | null>(
    null,
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailErrorMessage, setDetailErrorMessage] = useState("");
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
    const startDateTime = toStartDateTime(start);
    const endDateTime = toEndDateTime(end);
    const [ordersData, salesAmount, productSalesData, productsData] =
      await Promise.all([
      getAdminOrders(startDateTime, endDateTime),
      getSalesBetween(startDateTime, endDateTime),
      getProductSalesBetween(startDateTime, endDateTime),
      getProducts(),
    ]);
    const productNameMap = new Map(
      productsData.map((product) => [product.id, product.name]),
    );

    setOrders(ordersData);
    setPeriodSales(salesAmount);
    setRankedProductSales(
      productSalesData.slice(0, 3).map((productSale) => ({
        ...productSale,
        name:
          productNameMap.get(productSale.id) ??
          `상품 ID ${productSale.id}`,
      })),
    );
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
    setSelectedOrder(null);
    setPendingDeleteOrder(order);
  };

  const handleControlClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleOpenOrderDetail = async (order: Order) => {
    setSelectedOrder(order);
    setSelectedOrderItems(order.orderItems ?? []);
    setDetailErrorMessage("");
    setIsDetailLoading(true);

    try {
      setSelectedOrderItems(await getOrderItems(order.id));
    } catch (error) {
      setDetailErrorMessage(
        error instanceof Error
          ? error.message
          : "주문 상품 목록 조회에 실패했습니다.",
      );
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleStatusChange =
    (order: Order) => async (event: ChangeEvent<HTMLSelectElement>) => {
      const nextStatus = event.target.value as OrderStatus;

      if (order.status === nextStatus) {
        return;
      }

      setUpdatingStatusOrderId(order.id);
      setSuccessMessage("");
      setErrorMessage("");

      try {
        const updatedOrder = await updateOrderStatus(order.id, nextStatus);

        setOrders((prevOrders) =>
          prevOrders.map((prevOrder) =>
            prevOrder.id === order.id
              ? {
                  ...prevOrder,
                  ...updatedOrder,
                  status: updatedOrder.status ?? nextStatus,
                }
              : prevOrder,
          ),
        );
        setSuccessMessage(
          `주문 #${order.id}의 상태가 ${getOrderStatusLabel(
            nextStatus,
          )}(으)로 변경되었습니다.`,
        );

        if (successTimerId.current) {
          window.clearTimeout(successTimerId.current);
        }

        successTimerId.current = window.setTimeout(() => {
          setSuccessMessage("");
        }, SUCCESS_HIDE_DELAY);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "주문 상태 변경에 실패했습니다.",
        );
      } finally {
        setUpdatingStatusOrderId(null);
      }
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
        <ManagerPageHeader
          title="주문 현황 관리"
          description="기간별 주문 내역을 조회하고 처리 상태별로 확인합니다."
        />

        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-5 rounded-lg border border-[#d2c3bf]/40 bg-[#f4f4f0] p-5 md:flex-row md:items-end"
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

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-lg border border-[#d2c3bf]/40 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-[#817471]">기간판매액</p>
            <p className="mt-2 text-3xl font-bold text-[#130805]">
              {formatPrice(periodSales)}
            </p>
            <p className="mt-1 text-sm text-[#4f4542]">
              선택한 조회 기간의 총 판매액입니다.
            </p>
          </div>

          <div className="rounded-lg border border-[#d2c3bf]/40 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-[#817471]">
                  최다 판매 원두
                </p>
                <p className="mt-1 text-sm text-[#4f4542]">
                  선택한 조회 기간 기준 상위 3개 상품입니다.
                </p>
              </div>
            </div>
            {rankedProductSales.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {rankedProductSales.map((productSale, index) => (
                  <div
                    key={productSale.id}
                    className="rounded-lg border border-[#d2c3bf]/50 bg-[#f4f4f0] p-4"
                  >
                    <p className="text-sm font-bold text-[#7d562d]">
                      Best seller {index + 1}등
                    </p>
                    <p className="mt-2 line-clamp-2 font-semibold text-[#130805]">
                      {productSale.name}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#4f4542]">
                      {productSale.sales}개 판매
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg bg-[#f4f4f0] px-4 py-6 text-center text-sm text-[#4f4542]">
                조회 기간 내 판매된 원두가 없습니다.
              </p>
            )}
          </div>
        </section>

        <ManagerNotice
          message={errorMessage}
          tone="error"
          className="mb-6"
        />

        <section className="overflow-hidden rounded-lg border border-[#d2c3bf]/40 bg-white shadow-sm">
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
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-[#4f4542]"
                    >
                      주문 내역을 불러오는 중입니다.
                    </td>
                  </tr>
                ) : visibleOrders.length > 0 ? (
                  visibleOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => void handleOpenOrderDetail(order)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          void handleOpenOrderDetail(order);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      className="cursor-pointer transition-colors hover:bg-[#f4f4f0]/70 focus:bg-[#f4f4f0]/70 focus:outline-none"
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
                        <select
                          value={order.status}
                          onChange={handleStatusChange(order)}
                          onClick={handleControlClick}
                          disabled={updatingStatusOrderId === order.id}
                          aria-label={`주문 #${order.id} 진행 상태 변경`}
                          className={`inline-flex h-8 min-w-24 cursor-pointer appearance-none rounded-full border-0 px-3 text-center text-xs font-semibold outline-none transition-all focus:ring-2 focus:ring-[#ffca98] disabled:cursor-wait disabled:opacity-60 ${getOrderStatusClass(
                            order.status,
                          )}`}
                        >
                          {orderStatusOptions.map((statusOption) => (
                            <option
                              key={statusOption.value}
                              value={statusOption.value}
                            >
                              {statusOption.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          type="button"
                          onClick={(event) => {
                            handleControlClick(event);
                            handleRequestDelete(order);
                          }}
                          className="min-w-16 whitespace-nowrap rounded-lg border border-[#d2c3bf] px-4 py-2 text-sm font-semibold text-[#93000a] transition-colors hover:border-[#ba1a1a] hover:bg-[#ffdad6]"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-[#4f4542]"
                    >
                      조회된 주문 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <ManagerPagination
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalItems={filteredOrders.length}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      </main>

      <OrderDetailPanel
        order={selectedOrder}
        orderItems={selectedOrderItems}
        isLoading={isDetailLoading}
        errorMessage={detailErrorMessage}
        onClose={() => setSelectedOrder(null)}
      />

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
                처리 완료
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
