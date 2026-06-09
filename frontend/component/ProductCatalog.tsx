"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getProductsByPaging, type Product, type ProductSale } from "@/app/api";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 8;

type ProductCatalogProps = {
  initialProducts: Product[];
  initialTotalElements: number;
  initialProductSales: ProductSale[];
};

type SortMode = "latest" | "popular";

export default function ProductCatalog({
  initialProducts,
  initialTotalElements,
  initialProductSales,
}: ProductCatalogProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalItems, setTotalItems] = useState(initialTotalElements);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isInitialMount = useRef(true);

  const productSalesMap = useMemo(
    () =>
      new Map(
        initialProductSales.map((sale, index) => [
          sale.id,
          { ...sale, rank: index + 1 },
        ]),
      ),
    [initialProductSales],
  );

  const loadProducts = useCallback(
    async (query: string, currentPage: number) => {
      // 초기 렌더링(SSR) 시 이미 데이터가 있으므로 첫 번째 fetch는 스킵합니다.
      if (isInitialMount.current) {
        isInitialMount.current = false;
        if (query === "" && currentPage === 1) return;
      }

      setIsLoading(true);
      setErrorMessage("");
      try {
        const data = await getProductsByPaging(query, currentPage - 1, PAGE_SIZE);
        setProducts(data.content);
        setTotalItems(data.totalElements);
      } catch (error) {
        setErrorMessage("서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
    },
    [], // 의존성 배열에서 products를 제거하여 무한 루프 및 깜빡임 방지
  );

  useEffect(() => {
    void loadProducts(searchTerm, page);
  }, [searchTerm, page, loadProducts]);

  // 현재 페이지의 상품을 선택된 정렬 기준에 따라 정렬
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortMode === "latest") {
      // ID 내림차순 (최신순)
      return list.sort((a, b) => b.id - a.id);
    }
    // 인기순 (판매량 랭크 기준, 랭크가 없으면 뒤로 보냄)
    return list.sort((a, b) => {
      const aRank = productSalesMap.get(a.id)?.rank ?? 999;
      const bRank = productSalesMap.get(b.id)?.rank ?? 999;
      return aRank - bRank;
    });
  }, [products, sortMode, productSalesMap]);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-[#d2c3bf]/50 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:p-5">
        <form onSubmit={handleSearch} className="flex flex-1 gap-3 sm:flex-row flex-nowrap">
          <label className="sr-only" htmlFor="product-search">
            상품 검색
          </label>
          <input
            id="product-search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="h-12 flex-1 rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all placeholder:text-[#817471] focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]"
            placeholder="상품명 또는 설명으로 검색"
            type="search"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-12 rounded-lg bg-[#130805] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#7d562d] active:scale-95"
            >
              검색
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-12 rounded-lg border border-[#d2c3bf] px-5 text-sm font-semibold text-[#4f4542] transition-colors hover:border-[#7d562d] hover:text-[#130805]"
            >
              초기화
            </button>
          </div>
        </form>
        <p className="text-sm font-medium text-[#4f4542]">
          총 {totalItems}개 상품
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        {(["latest", "popular"] as SortMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setSortMode(mode);
              setPage(1);
            }}
            className={`h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${
              sortMode === mode
                ? "bg-[#130805] text-white"
                : "border border-[#d2c3bf] bg-white text-[#4f4542] hover:border-[#7d562d] hover:text-[#130805]"
            }`}
          >
            {mode === "latest" ? "최신순" : "인기순"}
          </button>
        ))}
        <span className="text-sm font-medium text-[#817471]">
          인기순 정렬은 현재 페이지 내에서 적용됩니다.
        </span>
      </div>

      {isLoading ? (
        <div className="flex min-h-[540px] items-center justify-center rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0]">
          <p className="text-[#4f4542]">상품을 불러오는 중입니다...</p>
        </div>
      ) : errorMessage ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#ba1a1a]/30 bg-[#ffdad6]/20 p-8 text-[#93000a]">
          <p>{errorMessage}</p>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid min-h-[400px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => {
            const salesRank = productSalesMap.get(product.id)?.rank;

            return (
              <ProductCard
                key={product.id}
                product={product}
                badge={
                  salesRank && salesRank <= 3
                    ? `Best seller ${salesRank}등`
                    : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] p-8 text-[#4f4542]">
          {products.length > 0
            ? "검색 결과가 없습니다."
            : "등록된 상품이 없습니다."}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
          disabled={page === 1}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-[#d2c3bf] px-3 text-sm font-semibold text-[#4f4542] transition-colors hover:border-[#7d562d] hover:text-[#130805] disabled:cursor-not-allowed disabled:opacity-40"
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                page === pageNumber
                  ? "bg-[#130805] text-white"
                  : "border border-[#d2c3bf] text-[#4f4542] hover:border-[#7d562d] hover:text-[#130805]"
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => setPage((prevPage) => Math.min(totalPages, prevPage + 1))}
          disabled={page === totalPages}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-[#d2c3bf] px-3 text-sm font-semibold text-[#4f4542] transition-colors hover:border-[#7d562d] hover:text-[#130805] disabled:cursor-not-allowed disabled:opacity-40"
        >
          다음
        </button>
      </div>
    </section>
  );
}
