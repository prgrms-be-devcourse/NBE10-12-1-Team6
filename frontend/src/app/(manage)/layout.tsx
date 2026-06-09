"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Team6 | 육성";

const navItems = [
  {
    href: "/manager/manageproduct",
    label: "상품 관리",
    icon: "P",
  },
  {
    href: "/manager/manageorder",
    label: "주문 관리",
    icon: "O",
  },
];

type ManageLayoutProps = {
  children: ReactNode;
};

export default function ManageLayout({ children }: ManageLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#1b1c1a]">
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col border-r border-[#d2c3bf]/30 bg-[#f4f4f0] p-6 md:flex">
        <div className="mb-10">
          <Link href="/" className="text-2xl font-bold text-[#130805]">
            {SITE_NAME}
          </Link>
          <p className="mt-2 text-sm font-medium text-[#4f4542]/75">
            로스터리 운영
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#ffca98] text-[#7a532a] shadow-sm shadow-[#7d562d]/10"
                    : "text-[#4f4542] hover:bg-[#e9e8e4] hover:text-[#130805]"
                }`}
              >
                <span
                  className={`absolute left-0 h-6 w-1 rounded-r-full bg-[#7d562d] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-current/20 text-xs font-bold">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#d2c3bf]/40 pt-6">
          <p className="text-sm font-bold text-[#130805]">관리자 포털</p>
          <p className="mt-1 text-xs text-[#4f4542]">admin@team6.coffee</p>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#d2c3bf]/40 bg-[#faf9f5]/95 px-5 py-4 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#130805]">
            {SITE_NAME}
          </Link>
          <div className="flex gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-[#ffca98] text-[#7a532a] shadow-sm shadow-[#7d562d]/10"
                      : "text-[#4f4542] hover:bg-[#e9e8e4]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <div className="pt-16 md:pl-64 md:pt-0">{children}</div>
    </div>
  );
}
