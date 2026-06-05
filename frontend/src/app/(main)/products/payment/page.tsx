"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CartItemsTable from "../../../../../component/payment/CartItemsTable";
import DeleteConfirmBar from "../../../../../component/payment/DeleteConfirmBar";
import DeliveryForm from "../../../../../component/payment/DeliveryForm";
import PaymentSummary from "../../../../../component/payment/PaymentSummary";
import type {
  CartProduct,
  DeliveryFormState,
} from "../../../../../component/payment/types";
import Footer from "../../../../../component/Footer";
import { createOrder, getProducts } from "../../../api";
import type { Product } from "@/types/product";
import { useCartStore } from "@/stores/cartStore";

const emptyForm: DeliveryFormState = {
  recipientName: "",
  phone: "",
  email: "",
  zipCode: "",
  address1: "",
  address2: "",
};

export default function PaymentPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const cartItems = useCartStore((state) => state.items);
  const updateCartItem = useCartStore((state) => state.updateCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] =
    useState<CartProduct | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setProducts(await getProducts());
    };

    loadProducts();
  }, []);

  const cartProducts = useMemo<CartProduct[]>(() => {
    return cartItems
      .map((item) => {
        const product = products.find(
          (candidate) => candidate.id === item.productId,
        );
        return product ? { ...item, product } : null;
      })
      .filter((item): item is CartProduct => item !== null);
  }, [cartItems, products]);

  const totalPrice = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const handleChange =
    (field: keyof DeliveryFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prevForm) => ({
        ...prevForm,
        [field]: event.target.value,
      }));
    };

  const handleQuantityChange = (productId: number, quantity: number) => {
    updateCartItem(productId, Math.max(1, quantity));
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
            <CartItemsTable
              items={cartProducts}
              onQuantityChange={handleQuantityChange}
              onRemove={setPendingDeleteItem}
            />
            <DeliveryForm form={form} onChange={handleChange} />
          </div>

          <PaymentSummary
            totalPrice={totalPrice}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            disabled={cartProducts.length < 1}
          />
        </form>
      </main>

      <DeleteConfirmBar
        item={pendingDeleteItem}
        onCancel={() => setPendingDeleteItem(null)}
        onConfirm={handleConfirmRemove}
      />

      <Footer />
    </>
  );
}
