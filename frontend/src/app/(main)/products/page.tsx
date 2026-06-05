import Footer from "../../../../component/Footer";
import ProductCard from "../../../../component/ProductCard";
import { getProducts } from "../../api";

export const dynamic = "force-dynamic";

const productBadges = ["Best Seller", "New Arrival", "Limited Edition"];

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <main className="bg-[#faf9f5] px-5 pb-24 pt-32 text-[#1b1c1a] md:px-16">
        <header className="mx-auto mb-12 max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#7d562d]">
            Coffee Selection
          </p>
          <h1 className="text-4xl font-bold leading-tight text-[#130805] md:text-5xl">
            상품 목록
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#4f4542]">
            장인 정신으로 로스팅된 전 세계의 특별한 원두를 만나보세요.
            각 산지의 독특한 테루아와 정성이 담긴 풍미를 집에서 경험할 수
            있습니다.
          </p>
        </header>

        <section className="mx-auto max-w-7xl">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={index < productBadges.length ? productBadges[index] : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] p-8 text-[#4f4542]">
              등록된 상품이 없습니다.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
