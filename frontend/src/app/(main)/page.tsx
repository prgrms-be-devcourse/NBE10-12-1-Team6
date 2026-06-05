import Link from "next/link";
import { getProducts, type Product } from "../api";

export const dynamic = "force-dynamic";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDWCJ97nc2t7UfrdZhpZaUFu9QzDt4caaEVq7u6oAcMIK-QGku3c-B_F7rfwjmxkNwbPrrFip3xJNUYcLE3A2QuSTiiJM45ozQIF_SLDwWmJ19DBfBhPByh4X_8C4lCEnlPMGCL-qjtC39mkJBcA4qEvfntM_WX-RQ20KZGQ_CcNwKBTGV4A5gpcOm7ny3NXRI_2Lkm_pRvCPoUfmxvBC4zJjV8HY-ZlK234AbLQhAc5K_oR4aA9BVUwnHr_9p4KXJRImdPQTRdRpw";

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);
}

function getRandomProducts(products: Product[]) {
  return [...products].sort(() => Math.random() - 0.5).slice(0, 3);
}

export default async function Home() {
  const products = getRandomProducts(await getProducts());
  const [featured, ...secondaryProducts] = products;

  return (
    <>
      <main className="bg-[#faf9f5] text-[#1b1c1a]">
        <section
          className="relative flex min-h-[760px] items-center overflow-hidden bg-cover bg-center px-5 pt-20 md:px-16"
          style={{
            backgroundImage: `linear-gradient(rgba(19, 8, 5, 0.34), rgba(19, 8, 5, 0.48)), url(${heroImage})`,
          }}
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl space-y-6 text-white">
              <h1 className="text-5xl font-bold leading-tight md:text-6xl">
                좋은 커피, 좋은 하루
              </h1>
              <p className="text-lg leading-8 text-[#f9f5eb] md:text-xl">
                선선한 원두 향으로 시작하는 하루. 원하는 커피를 선택하고
                간편하게 주문하세요.
              </p>
              <Link
                href="/products"
                className="inline-flex rounded-xl bg-[#7d562d] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#a67c52]"
              >
                쇼핑하기
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 md:px-16">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7d562d]">
                Our Selection
              </p>
              <h2 className="mt-3 text-3xl font-semibold">추천 상품</h2>
            </div>
            <Link
              href="/products"
              className="font-semibold text-[#4f4542] transition-colors hover:text-[#7d562d]"
            >
              전체보기
            </Link>
          </div>

          {featured ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <Link
                href={`/products/${featured.id}`}
                className="group overflow-hidden rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] md:col-span-7"
              >
                <div
                  className="aspect-[16/9] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url(${featured.imageUrl})` }}
                  aria-label={featured.name}
                />
                <div className="p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold">
                        {featured.name}
                      </h3>
                      <p className="mt-2 leading-7 text-[#4f4542]">
                        {featured.description}
                      </p>
                    </div>
                    <p className="text-2xl font-semibold text-[#7d562d]">
                      {formatPrice(featured.price)}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="grid gap-6 md:col-span-5">
                {secondaryProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group flex gap-5 rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] p-5 transition-colors hover:border-[#a67c52]"
                  >
                    <div
                      className="h-28 w-28 flex-none rounded-lg bg-cover bg-center md:h-32 md:w-32"
                      style={{ backgroundImage: `url(${product.imageUrl})` }}
                      aria-label={product.name}
                    />
                    <div className="flex min-w-0 flex-col justify-center">
                      <p className="mb-1 text-sm font-semibold text-[#7d562d]">
                        Specialty Beans
                      </p>
                      <h3 className="text-xl font-semibold leading-tight">
                        {product.name}
                      </h3>
                      <p className="mt-2 font-medium text-[#4f4542]">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-[#d2c3bf]/50 bg-[#f4f4f0] p-8 text-[#4f4542]">
              추천 상품을 불러올 수 없습니다.
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-[#d2c3bf]/40 bg-[#e3e2df] px-5 py-12 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <p className="font-bold text-[#130805]">Artisan Coffee</p>
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
