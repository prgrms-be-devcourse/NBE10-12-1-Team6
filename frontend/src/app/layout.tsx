import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team6 | 육성",
  description: "로스터리 카페 원두 상품 및 메뉴 관리 서비스"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="overflow-x-hidden">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
