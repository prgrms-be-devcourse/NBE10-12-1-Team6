"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Product } from "@/app/api";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 8;
const productBadges = ["Best Seller", "New Arrival", "Limited Edition"];

type ProductCatalogProps = {
  products: Product[];
};

export default function ProductCatalog({ products }: ProductCatalogProps) {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = `${product.name} ${product.description}`.toLowerCase();
      return searchableText.includes(normalizedSearchTerm);
    });
  }, [products, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchInput);
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
        <form onSubmit={handleSearch} className="flex flex-1 flex-col gap-3 sm:flex-row">
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
          총 {filteredProducts.length}개 상품
        </p>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              badge={
                currentPage === 1 && index < productBadges.length
                  ? productBadges[index]
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] p-8 text-[#4f4542]">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
          disabled={currentPage === 1}
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
                currentPage === pageNumber
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
          disabled={currentPage === totalPages}
          className="flex h-10 min-w-10 items-center justify-center rounded-lg border border-[#d2c3bf] px-3 text-sm font-semibold text-[#4f4542] transition-colors hover:border-[#7d562d] hover:text-[#130805] disabled:cursor-not-allowed disabled:opacity-40"
        >
          다음
        </button>
      </div>
    </section>
  );
}
