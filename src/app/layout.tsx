import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XM Global | 超過 2,000 萬名交易者信賴",
  description:
    "XM Global 提供卓越的交易環境，低點差、快速執行，助您輕鬆交易全球金融市場。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
