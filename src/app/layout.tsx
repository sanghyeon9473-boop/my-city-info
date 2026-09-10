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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://my-city-info.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "동대문구 생활 정보 | 행사·혜택·지원금 안내",
  description: "동대문구 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "동대문구 생활 정보 | 행사·혜택·지원금 안내",
    description: "동대문구 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: siteUrl,
    siteName: "동대문구 생활 정보",
    locale: "ko_KR",
    type: "website",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "동대문구 생활 정보",
  url: siteUrl,
  description: "동대문구 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "홈",
      "item": `${siteUrl}/`,
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "블로그",
      "item": `${siteUrl}/blog/`,
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "글 제목",
      "item": `${siteUrl}/blog/`,
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-amber-50/40 text-stone-800 selection:bg-amber-200">
        {children}
      </body>
    </html>
  );
}
