import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "성남시 생활 정보 | 행사·축제 & 지원금 혜택",
  description: "성남시민을 위한 최신 축제/행사 일정과 청년·가족 지원금 혜택을 한곳에서 쉽고 빠르게 확인하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-amber-50/40 text-stone-800 selection:bg-amber-200">
        {children}
      </body>
    </html>
  );
}
