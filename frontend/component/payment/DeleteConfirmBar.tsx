import type { CartProduct } from "./types";

type DeleteConfirmBarProps = {
  item: CartProduct | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmBar({
  item,
  onCancel,
  onConfirm,
}: DeleteConfirmBarProps) {
  return (
    <aside
      aria-live="polite"
      className={`fixed inset-x-0 bottom-0 z-[70] px-5 pb-5 transition-transform duration-300 ease-out md:px-16 ${
        item ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {item ? (
        <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-[#d2c3bf]/70 bg-[#f4f4f0] p-4 text-[#130805] shadow-2xl shadow-[#130805]/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 flex-none rounded-lg bg-cover bg-center"
              style={{
                backgroundImage: `url(${item.product.imageUrl})`,
              }}
            />
            <div>
              <p className="text-sm font-semibold text-[#7d562d]">
                이 상품을 장바구니에서 삭제할까요?
              </p>
              <p className="mt-1 font-semibold">{item.product.name}</p>
            </div>
          </div>
          <div className="flex gap-3 sm:flex-none">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-[#d2c3bf] px-5 py-3 text-sm font-semibold text-[#4f4542] transition-colors hover:border-[#7d562d] hover:text-[#130805] sm:flex-none"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-[#2c1e1a] px-5 py-3 text-sm font-semibold text-[#f9f5eb] transition-colors hover:bg-[#7d562d] sm:flex-none"
            >
              확인
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
