"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import StoreBar from "../../../component/StoreBar";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Team6";

const navLinkBaseClass =
  "group relative py-2 font-medium transition-colors duration-300 ease-out";

function getNavLinkClass(isActive: boolean) {
  return `${navLinkBaseClass} ${
    isActive ? "text-[#7d562d]" : "text-[#4f4542] hover:text-[#7d562d]"
  }`;
}

function NavUnderline({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-[#7d562d] transition-transform duration-300 ease-out ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

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
  const isHomeActive = isActivePath(pathname, "/");
  const isProductsActive = isActivePath(pathname, "/products");
  const isCartActive = isActivePath(pathname, "/products/payment");

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-[#d2c3bf]/40 bg-[#faf9f5]/90 backdrop-blur-md">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-16">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-bold text-[#130805]"
          >
            <span
              aria-hidden="true"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#2c1e1a] shadow-sm shadow-[#130805]/15"
            >
              <span className="h-6 w-3.5 rotate-12 rounded-full bg-[#f0bd8b]" />
              <span className="absolute h-5 w-0.5 rotate-12 rounded-full bg-[#2c1e1a]/75" />
            </span>
            {SITE_NAME}
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className={getNavLinkClass(isHomeActive)}
            >
              홈
              <NavUnderline isActive={isHomeActive} />
            </Link>
            <Link
              href="/products"
              className={getNavLinkClass(isProductsActive)}
            >
              상품
              <NavUnderline isActive={isProductsActive} />
            </Link>
            <Link
              href="/products/payment"
              className={getNavLinkClass(isCartActive)}
            >
              장바구니
              <NavUnderline isActive={isCartActive} />
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <StoreBar />
    </>
  );
}
