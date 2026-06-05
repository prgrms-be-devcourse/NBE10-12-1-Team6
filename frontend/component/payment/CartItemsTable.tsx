import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { CartProduct } from "./types";

type CartItemsTableProps = {
  items: CartProduct[];
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (item: CartProduct) => void;
};

export default function CartItemsTable({
  items,
  onQuantityChange,
  onRemove,
}: CartItemsTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#d2c3bf]/50 bg-white">
      <div className="border-b border-[#d2c3bf]/30 p-6">
        <h2 className="text-2xl font-semibold text-[#130805]">
          주문 상품 정보
        </h2>
      </div>

      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-[#f4f4f0] text-sm font-semibold text-[#4f4542]">
                <th className="p-4">상품명</th>
                <th className="p-4 text-center">수량</th>
                <th className="p-4 text-right">금액</th>
                <th className="w-24 whitespace-nowrap p-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d2c3bf]/30">
              {items.map((item) => (
                <tr key={item.productId} className="hover:bg-[#f4f4f0]/70">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 flex-none rounded-lg bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${item.product.imageUrl})`,
                        }}
                      />
                      <div>
                        <p className="font-semibold text-[#130805]">
                          {item.product.name}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-[#4f4542]">
                          {item.product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="mx-auto inline-flex overflow-hidden rounded-lg border border-[#d2c3bf] bg-[#faf9f5]">
                      <button
                        type="button"
                        onClick={() =>
                          onQuantityChange(item.productId, item.quantity - 1)
                        }
                        className="h-10 w-10 text-lg font-semibold text-[#130805] transition-colors hover:bg-[#e9e8e4]"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        readOnly
                        aria-label={`${item.product.name} 수량`}
                        className="h-10 w-12 border-x border-[#d2c3bf] bg-transparent p-0 text-center font-semibold leading-10 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onQuantityChange(item.productId, item.quantity + 1)
                        }
                        className="h-10 w-10 text-lg font-semibold text-[#130805] transition-colors hover:bg-[#e9e8e4]"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4 text-right font-semibold text-[#130805]">
                    {formatPrice(item.product.price * item.quantity)}
                  </td>
                  <td className="w-24 whitespace-nowrap p-4 text-center">
                    <button
                      type="button"
                      onClick={() => onRemove(item)}
                      className="text-sm font-semibold text-[#7d562d] hover:text-[#130805]"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-[#4f4542]">
          장바구니에 담긴 상품이 없습니다.{" "}
          <Link href="/products" className="font-semibold text-[#7d562d]">
            상품 보러가기
          </Link>
        </div>
      )}
    </section>
  );
}
