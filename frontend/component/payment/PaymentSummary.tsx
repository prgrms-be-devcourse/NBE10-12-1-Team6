import { formatPrice } from "@/lib/format";

type PaymentSummaryProps = {
  totalPrice: number;
  errorMessage: string;
  isSubmitting: boolean;
  disabled: boolean;
};

export default function PaymentSummary({
  totalPrice,
  errorMessage,
  isSubmitting,
  disabled,
}: PaymentSummaryProps) {
  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-28 space-y-6">
        <section className="rounded-xl bg-[#2c1e1a] p-8 text-[#f9f5eb] shadow-xl shadow-[#130805]/15">
          <h2 className="mb-8 border-b border-[#99847e]/30 pb-4 text-2xl font-semibold">
            결제 요약
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-[#dac1bb]">
              <span>총 상품 금액</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="mt-6 flex items-end justify-between border-t border-[#99847e]/30 pt-6">
              <span className="text-xl font-semibold">최종 결제 금액</span>
              <span className="text-4xl font-bold text-[#f0bd8b]">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          {errorMessage ? (
            <p className="mt-6 rounded-lg bg-[#ffdad6] px-4 py-3 text-sm font-semibold text-[#93000a]">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={disabled || isSubmitting}
            className="mt-10 w-full rounded-xl bg-[#7d562d] py-4 text-xl font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-[#a67c52] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#817471]"
          >
            {isSubmitting ? "결제 처리 중" : "결제하기"}
          </button>

          <div className="mt-6 text-center text-xs text-[#99847e]">
            보안 결제 시스템 적용 중
          </div>
        </section>

        <div className="rounded-xl border border-[#d2c3bf]/30 bg-[#e9e8e4] p-6">
          <h3 className="mb-3 text-sm font-bold text-[#130805]">배송 안내</h3>
          <ul className="list-disc space-y-2 pl-4 text-sm text-[#4f4542]">
            <li>오후 2시 이전 결제 완료 시 당일 로스팅 및 출고</li>
            <li>도서산간 지역은 배송이 지연될 수 있습니다.</li>
            <li>신선식품 특성상 단순 변심 반품은 제한됩니다.</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
