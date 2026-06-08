"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  type Product,
} from "@/app/api";
import ManagerNotice from "../../../../../component/manage/ManagerNotice";
import ManagerPageHeader from "../../../../../component/manage/ManagerPageHeader";
import ManagerPagination from "../../../../../component/manage/ManagerPagination";
import { formatPrice } from "@/lib/format";

const PAGE_SIZE = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptyForm = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
};

type ProductForm = typeof emptyForm;

function getProductCode(productId: number | null | undefined) {
  return typeof productId === "number" && Number.isFinite(productId)
    ? `PRD-${String(productId).padStart(3, "0")}`
    : "PRD-PENDING";
}

function getProductRowKey(product: Product, index: number) {
  return `${product.id ?? "pending"}-${product.name}-${index}`;
}

function validateForm(form: ProductForm) {
  if (!form.name.trim()) {
    return "상품명을 입력해주세요.";
  }

  if (!form.price || Number(form.price) <= 0) {
    return "가격을 올바르게 입력해주세요.";
  }

  if (!form.description.trim()) {
    return "상품 설명을 입력해주세요.";
  }

  if (!form.imageUrl.trim()) {
    return "상품 이미지를 업로드하거나 이미지 URL을 입력해주세요.";
  }

  return "";
}

export default function ManageProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = useMemo(
    () =>
      products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, products],
  );

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setProducts(await getProducts());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const animationId = window.requestAnimationFrame(() => {
      void loadProducts();
    });

    return () => window.cancelAnimationFrame(animationId);
  }, [loadProducts]);

  const handleChange =
    (field: keyof ProductForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prevForm) => ({
        ...prevForm,
        [field]: event.target.value,
      }));
    };

  const handleImageFile = (file: File | undefined) => {
    setMessage("");
    setErrorMessage("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMessage("이미지는 최대 5MB까지 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prevForm) => ({
        ...prevForm,
        imageUrl: typeof reader.result === "string" ? reader.result : "",
      }));
    };

    reader.onerror = () => {
      setErrorMessage("이미지를 읽는 중 문제가 발생했습니다.");
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleImageFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleImageFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const validationMessage = validateForm(form);

    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      await createProduct({
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      });

      await loadProducts();
      setForm(emptyForm);
      setPage(1);
      setMessage("상품이 등록되었습니다.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "상품 등록에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: number) => {
    setMessage("");
    setErrorMessage("");

    try {
      await deleteProduct(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId),
      );
      setMessage("상품이 삭제되었습니다.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "상품 삭제에 실패했습니다.",
      );
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 text-[#1b1c1a] md:px-10 lg:px-16">
      <ManagerPageHeader
        title="상품 관리"
        description="장인 정신이 담긴 원두 상품을 등록하고, 현재 상품 목록을 관리합니다."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-5">
          <div className="rounded-lg border border-[#d2c3bf]/50 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffca98] text-lg font-bold text-[#7a532a]">
                +
              </span>
              <h2 className="text-2xl font-semibold text-[#130805]">
                새 상품 등록
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[#4f4542]">
                  상품명
                </span>
                <input
                  value={form.name}
                  onChange={handleChange("name")}
                  className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                  placeholder="예: 에티오피아 예가체프 G1"
                  type="text"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[#4f4542]">
                  가격
                </span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#817471]">
                    ₩
                  </span>
                  <input
                    value={form.price}
                    onChange={handleChange("price")}
                    className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] pl-10 pr-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                    placeholder="25000"
                    type="number"
                    min="1"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[#4f4542]">
                  상품 설명
                </span>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  className="min-h-32 w-full resize-none rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 py-3 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                  placeholder="원산지, 향미 프로필, 로스팅 단계 등 상세 설명을 입력하세요."
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-semibold text-[#4f4542]">
                  상품 이미지
                </span>
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                    isDragging
                      ? "border-[#7d562d] bg-[#ffca98]/15"
                      : "border-[#d2c3bf] bg-[#faf9f5] hover:border-[#7d562d] hover:bg-[#ffca98]/10"
                  }`}
                >
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="상품 이미지 미리보기"
                      className="mb-4 h-36 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e9e8e4] text-2xl font-bold text-[#7d562d]">
                      ↑
                    </span>
                  )}
                  <span className="text-sm font-semibold text-[#4f4542]">
                    클릭하거나 파일을 드래그하여 업로드
                  </span>
                  <span className="mt-1 text-xs text-[#817471]">
                    PNG, JPG, WEBP 최대 5MB
                  </span>
                  <input
                    className="absolute inset-0 cursor-pointer opacity-0"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-[#4f4542]">
                  이미지 URL
                </span>
                <input
                  value={form.imageUrl}
                  onChange={handleChange("imageUrl")}
                  className="h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 text-sm outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
                  placeholder="https://example.com/image.png"
                  type="url"
                />
              </label>

              <ManagerNotice message={message} />
              <ManagerNotice message={errorMessage} tone="error" />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#130805] py-4 text-sm font-semibold text-white shadow-lg shadow-[#130805]/10 transition-all hover:bg-[#7d562d] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#817471]"
              >
                {isSubmitting ? "등록 중" : "상품 등록하기"}
              </button>
            </form>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-[#2c1e1a] p-6 text-[#f9f5eb]">
            <div>
              <p className="text-sm text-[#dac1bb]">현재 운영 상품</p>
              <p className="mt-1 text-3xl font-bold">{products.length} Items</p>
            </div>
          </div>
        </section>

        <section className="xl:col-span-7">
          <div className="overflow-hidden rounded-lg border border-[#d2c3bf]/50 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#d2c3bf]/30 bg-white px-6 py-5 md:px-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#130805]">
                  상품 목록
                </h2>
                <p className="mt-1 text-sm text-[#4f4542]">
                  등록된 상품을 확인하고 삭제할 수 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={loadProducts}
                className="rounded-lg border border-[#d2c3bf] px-4 py-2 text-sm font-semibold text-[#4f4542] transition-colors hover:border-[#7d562d] hover:text-[#130805]"
              >
                새로고침
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#f4f4f0] text-xs font-bold uppercase tracking-wider text-[#4f4542]">
                    <th className="px-6 py-4">이미지</th>
                    <th className="px-6 py-4">상품명</th>
                    <th className="px-6 py-4">가격</th>
                    <th className="px-6 py-4 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d2c3bf]/30">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-[#4f4542]"
                      >
                        상품 목록을 불러오는 중입니다.
                      </td>
                    </tr>
                  ) : visibleProducts.length > 0 ? (
                    visibleProducts.map((product, index) => (
                      <tr
                        key={getProductRowKey(product, index)}
                        className="group transition-colors hover:bg-[#f4f4f0]/70"
                      >
                        <td className="px-6 py-4">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-16 w-16 rounded-lg bg-[#efeeea] object-cover"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#130805]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs text-[#817471]">
                            ID: {getProductCode(product.id)}
                          </p>
                          <p className="mt-2 line-clamp-1 text-sm text-[#4f4542]">
                            {product.description}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#4f4542]">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            disabled={!Number.isFinite(product.id)}
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
                        colSpan={4}
                        className="px-6 py-12 text-center text-[#4f4542]"
                      >
                        등록된 상품이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <ManagerPagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              totalItems={products.length}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
