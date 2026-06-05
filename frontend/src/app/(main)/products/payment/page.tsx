"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder, getProducts, type Product } from "../../../api";
import { useCartStore } from "../../../../../stores/cartstore";

type CartItem = {
  productId: number;
  quantity: number;
};

type CartProduct = CartItem & {
  product: Product;
};

const emptyForm = {
  recipientName: "",
  phone: "",
  email: "",
  zipCode: "",
  address1: "",
  address2: "",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PaymentPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const cartItems = useCartStore((state) => state.items) as CartItem[];
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<CartProduct | null>(
    null,
  );

  useEffect(() => {
    const loadProducts = async () => {
      const productList = await getProducts();
      setProducts(productList);
    };

    loadProducts();
  }, []);

  const cartProducts = useMemo<CartProduct[]>(() => {
    return cartItems
      .map((item) => {
        const product = products.find((candidate) => candidate.id === item.productId);
        return product ? { ...item, product } : null;
      })
      .filter((item): item is CartProduct => item !== null);
  }, [cartItems, products]);

  const totalPrice = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const handleChange =
    (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prevForm) => ({
        ...prevForm,
        [field]: event.target.value,
      }));
    };

  const handleQuantityChange = (productId: number, quantity: number) => {
    const nextQuantity = Math.max(1, quantity);
    updateCartItem(productId, nextQuantity);
  };

  const handleRemove = (item: CartProduct) => {
    setPendingDeleteItem(item);
  };

  const handleCancelRemove = () => {
    setPendingDeleteItem(null);
  };

  const handleConfirmRemove = () => {
    if (!pendingDeleteItem) {
      return;
    }

    removeCartItem(pendingDeleteItem.productId);
    setPendingDeleteItem(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (cartProducts.length < 1) {
      setErrorMessage("장바구니에 상품을 담아주세요.");
      return;
    }

    if (
      !form.recipientName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.zipCode.trim() ||
      !form.address1.trim() ||
      !form.address2.trim()
    ) {
      setErrorMessage("배송 정보를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        email: form.email,
        zipCode: form.zipCode,
        address1: form.address1,
        address2: form.address2,
        orderItems: cartProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      window.sessionStorage.setItem("last-order", JSON.stringify(order));
      window.sessionStorage.setItem("last-order-email", form.email);
      router.push("/products/payment/success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "주문 생성에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-7xl bg-[#faf9f5] px-5 pb-20 pt-28 text-[#1b1c1a] md:px-16">
        <div className="mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#7d562d]">
            Checkout
          </p>
          <h1 className="text-4xl font-bold leading-tight text-[#130805] md:text-5xl">
            상품 결제
          </h1>
          <p className="mt-3 text-[#4f4542]">
            장바구니 상품과 배송 정보를 확인하고 주문을 완료하세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <div className="space-y-10 lg:col-span-8">
            <section className="overflow-hidden rounded-xl border border-[#d2c3bf]/50 bg-white">
              <div className="border-b border-[#d2c3bf]/30 p-6">
                <h2 className="text-2xl font-semibold text-[#130805]">
                  주문 상품 정보
                </h2>
              </div>

              {cartProducts.length > 0 ? (
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
                      {cartProducts.map((item) => (
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
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(event) =>
                                handleQuantityChange(
                                  item.productId,
                                  Number(event.target.value),
                                )
                              }
                              className="h-10 w-20 rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-3 text-center outline-none focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                            />
                          </td>
                          <td className="p-4 text-right font-semibold text-[#130805]">
                            {formatPrice(item.product.price * item.quantity)}
                          </td>
                          <td className="w-24 whitespace-nowrap p-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemove(item)}
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

            <section className="rounded-xl border border-[#d2c3bf]/50 bg-white p-6 md:p-8">
              <h2 className="mb-8 text-2xl font-semibold text-[#130805]">
                배송 정보
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold text-[#4f4542]">
                      받는 분 성함
                    </span>
                    <input
                      value={form.recipientName}
                      onChange={handleChange("recipientName")}
                      className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                      placeholder="이름을 입력하세요"
                      type="text"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold text-[#4f4542]">
                      연락처
                    </span>
                    <input
                      value={form.phone}
                      onChange={handleChange("phone")}
                      className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                      placeholder="010-0000-0000"
                      type="tel"
                    />
                  </label>
                </div>

                <label className="space-y-2">
                  <span className="block text-sm font-semibold text-[#4f4542]">
                    이메일
                  </span>
                  <input
                    value={form.email}
                    onChange={handleChange("email")}
                    className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                    placeholder="example@artisan.coffee"
                    type="email"
                  />
                </label>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
                  <label className="space-y-2">
                    <span className="block text-sm font-semibold text-[#4f4542]">
                      우편번호
                    </span>
                    <input
                      value={form.zipCode}
                      onChange={handleChange("zipCode")}
                      className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                      placeholder="12345"
                      type="text"
                    />
                  </label>
                  <div className="flex items-end">
                    <button
                      type="button"
                      disabled
                      className="h-12 rounded-lg bg-[#e3e2df] px-5 text-sm font-semibold text-[#817471]"
                    >
                      주소 찾기
                    </button>
                  </div>
                </div>

                <label className="space-y-2">
                  <span className="block text-sm font-semibold text-[#4f4542]">
                    기본 주소
                  </span>
                  <input
                    value={form.address1}
                    onChange={handleChange("address1")}
                    className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                    placeholder="주소를 입력하세요"
                    type="text"
                  />
                </label>

                <label className="space-y-2">
                  <span className="block text-sm font-semibold text-[#4f4542]">
                    상세 주소
                  </span>
                  <input
                    value={form.address2}
                    onChange={handleChange("address2")}
                    className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                    placeholder="나머지 주소를 입력하세요"
                    type="text"
                  />
                </label>
              </div>
            </section>
          </div>

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
                  disabled={isSubmitting || cartProducts.length < 1}
                  className="mt-10 w-full rounded-xl bg-[#7d562d] py-4 text-xl font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-[#a67c52] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#817471]"
                >
                  {isSubmitting ? "결제 처리 중" : "결제하기"}
                </button>

                <div className="mt-6 text-center text-xs text-[#99847e]">
                  보안 결제 시스템 적용 중
                </div>
              </section>

              <div className="rounded-xl border border-[#d2c3bf]/30 bg-[#e9e8e4] p-6">
                <h3 className="mb-3 text-sm font-bold text-[#130805]">
                  배송 안내
                </h3>
                <ul className="list-disc space-y-2 pl-4 text-sm text-[#4f4542]">
                  <li>오후 2시 이전 결제 완료 시 당일 로스팅 및 출고</li>
                  <li>도서산간 지역은 배송이 지연될 수 있습니다.</li>
                  <li>신선식품 특성상 단순 변심 반품은 제한됩니다.</li>
                </ul>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <aside
        aria-live="polite"
        className={`fixed inset-x-0 bottom-0 z-[70] px-5 pb-5 transition-transform duration-300 ease-out md:px-16 ${
          pendingDeleteItem ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {pendingDeleteItem ? (
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-[#d2c3bf]/70 bg-[#f4f4f0] p-4 text-[#130805] shadow-2xl shadow-[#130805]/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 flex-none rounded-lg bg-cover bg-center"
                style={{
                  backgroundImage: `url(${pendingDeleteItem.product.imageUrl})`,
                }}
              />
              <div>
                <p className="text-sm font-semibold text-[#7d562d]">
                  이 상품을 장바구니에서 삭제할까요?
                </p>
                <p className="mt-1 font-semibold">
                  {pendingDeleteItem.product.name}
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:flex-none">
              <button
                type="button"
                onClick={handleCancelRemove}
                className="flex-1 rounded-lg border border-[#d2c3bf] px-5 py-3 text-sm font-semibold text-[#4f4542] transition-colors hover:border-[#7d562d] hover:text-[#130805] sm:flex-none"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="flex-1 rounded-lg bg-[#2c1e1a] px-5 py-3 text-sm font-semibold text-[#f9f5eb] transition-colors hover:bg-[#7d562d] sm:flex-none"
              >
                확인
              </button>
            </div>
          </div>
        ) : null}
      </aside>

      <footer className="mt-12 border-t border-[#d2c3bf]/40 bg-[#e3e2df] px-5 py-12 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <p className="font-bold text-[#130805]">Artisan Coffee Roastery</p>
            <p className="mt-2 text-sm text-[#4f4542]">
              Fresh roasted coffee for everyday rituals.
            </p>
          </div>
          <div className="flex gap-6 text-sm font-medium text-[#4f4542]">
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터</span>
          </div>
        </div>
      </footer>
    </>
  );
}
