"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const activeLinkClass =
  "border-b-2 border-[#7d562d] py-2 font-medium text-[#7d562d]";
const inactiveLinkClass =
  "border-b-2 border-transparent py-2 font-medium text-[#4f4542] transition-colors hover:text-[#7d562d]";

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/products/payment") {
    return pathname.startsWith("/products/payment");
  }

  return pathname.startsWith(href) && !pathname.startsWith("/products/payment");
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-[#d2c3bf]/40 bg-[#faf9f5]/90 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-16">
          <Link href="/" className="text-2xl font-bold text-[#130805]">
            Artisan Coffee
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className={isActivePath(pathname, "/") ? activeLinkClass : inactiveLinkClass}
            >
              홈
            </Link>
            <Link
              href="/products"
              className={
                isActivePath(pathname, "/products")
                  ? activeLinkClass
                  : inactiveLinkClass
              }
            >
              상품
            </Link>
            <Link
              href="/products/payment"
              className={
                isActivePath(pathname, "/products/payment")
                  ? activeLinkClass
                  : inactiveLinkClass
              }
            >
              장바구니
            </Link>
          </div>
          <Link
            href="/products/payment"
            aria-label="장바구니"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d2c3bf] text-[#130805] transition-colors hover:border-[#7d562d] hover:text-[#7d562d]"
          >
            Cart
          </Link>
        </nav>
      </header>
      {children}
    </>
  );
}
