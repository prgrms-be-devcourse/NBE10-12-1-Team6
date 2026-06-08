import type { Order, OrderItem } from "@/types/order";
import { formatDate, formatPrice } from "@/lib/format";
import {
  getOrderStatusClass,
  getOrderStatusLabel,
  getOrderTitle,
} from "@/lib/orderDisplay";

type OrderDetailPanelProps = {
  order: Order | null;
  orderItems: OrderItem[];
  isLoading: boolean;
  errorMessage?: string;
  onClose: () => void;
};

function getItemKey(item: OrderItem, index: number) {
  return `${item.id ?? "item"}-${item.productId}-${index}`;
}

export default function OrderDetailPanel({
  order,
  orderItems,
  isLoading,
  errorMessage = "",
  onClose,
}: OrderDetailPanelProps) {
  const isOpen = Boolean(order);
  const displayItems = orderItems.length > 0 ? orderItems : order?.orderItems ?? [];

  return (
    <aside
      aria-live="polite"
      className={`fixed inset-x-0 bottom-0 z-[80] px-5 pb-5 transition-transform duration-300 ease-out md:px-16 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {order ? (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-[#d2c3bf]/70 bg-[#fffaf3] text-[#130805] shadow-2xl shadow-[#130805]/25">
          <div className="flex flex-col gap-4 border-b border-[#d2c3bf]/50 bg-[#2c1e1a] px-5 py-4 text-[#f9f5eb] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#f0bd8b]">
                주문 상세내역
              </p>
              <h2 className="mt-1 text-xl font-bold">주문 #{order.id}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#f9f5eb] px-5 text-sm font-semibold text-[#130805] transition-colors hover:bg-[#ffca98]"
            >
              닫기
            </button>
          </div>

          <div className="grid max-h-[72vh] gap-5 overflow-y-auto p-5 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-lg border border-[#d2c3bf]/50 bg-white p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#817471]">대표 상품</p>
                  <p className="mt-1 font-semibold text-[#130805]">
                    {getOrderTitle(order)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClass(
                    order.status,
                  )}`}
                >
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>

              <dl className="grid grid-cols-1 gap-3 text-sm">
                <div className="rounded-lg bg-[#f4f4f0] p-3">
                  <dt className="font-semibold text-[#817471]">주문 일시</dt>
                  <dd className="mt-1 text-[#130805]">
                    {formatDate(order.createDate)}
                  </dd>
                </div>
                <div className="rounded-lg bg-[#f4f4f0] p-3">
                  <dt className="font-semibold text-[#817471]">고객 이메일</dt>
                  <dd className="mt-1 break-all text-[#130805]">{order.email}</dd>
                </div>
                <div className="rounded-lg bg-[#f4f4f0] p-3">
                  <dt className="font-semibold text-[#817471]">배송지</dt>
                  <dd className="mt-1 text-[#130805]">
                    ({order.zipCode}) {order.address1} {order.address2}
                  </dd>
                </div>
                <div className="rounded-lg bg-[#f4f4f0] p-3">
                  <dt className="font-semibold text-[#817471]">총 결제 금액</dt>
                  <dd className="mt-1 text-lg font-bold text-[#130805]">
                    {formatPrice(order.price)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border border-[#d2c3bf]/50 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#130805]">상품 목록</h3>
                <span className="text-sm font-semibold text-[#7d562d]">
                  {displayItems.length}개 상품
                </span>
              </div>

              {isLoading ? (
                <p className="rounded-lg bg-[#f4f4f0] px-4 py-8 text-center text-sm text-[#4f4542]">
                  주문 상품 목록을 불러오는 중입니다.
                </p>
              ) : errorMessage ? (
                <p className="rounded-lg bg-[#ffdad6] px-4 py-3 text-sm font-semibold text-[#93000a]">
                  {errorMessage}
                </p>
              ) : displayItems.length > 0 ? (
                <div className="divide-y divide-[#d2c3bf]/30 overflow-hidden rounded-lg border border-[#d2c3bf]/40">
                  {displayItems.map((item, index) => (
                    <div
                      key={getItemKey(item, index)}
                      className="grid grid-cols-[1fr_auto] gap-4 p-4"
                    >
                      <div>
                        <p className="font-semibold text-[#130805]">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-sm text-[#817471]">
                          상품 ID {item.productId} · 수량 {item.quantity}개
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#4f4542]">
                          {formatPrice(item.productPrice)}
                        </p>
                        <p className="mt-1 font-bold text-[#130805]">
                          {formatPrice(item.productPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-[#f4f4f0] px-4 py-8 text-center text-sm text-[#4f4542]">
                  표시할 주문 상품이 없습니다.
                </p>
              )}
            </section>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
