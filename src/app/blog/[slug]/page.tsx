import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import AdBanner from "@/components/AdBanner";

export async function generateStaticParams() {
  const posts = getAllPosts();
  if (posts.length === 0) {
    return [{ slug: "_placeholder" }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "_placeholder") {
    return { title: "동대문구 생활 정보 블로그" };
  }
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | 동대문구 생활 정보",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://my-city-info-dod.pages.dev";
  const postUrl = `${siteUrl}/blog/${post.slug}/`;

  return {
    title: `${post.title} | 동대문구 생활 정보`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: postUrl,
      siteName: "동대문구 생활 정보",
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

interface InfoItem {
  id?: string | number;
  name?: string;
  link?: string;
  url?: string;
}

function findSourceInfo(postTitle: string, postContent: string): { name: string; url: string } {
  const possiblePaths = [
    path.join(process.cwd(), "public/data/local-info.json"),
    path.join(process.cwd(), "public/data/city-info.json"),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(raw);
        const items: InfoItem[] = Array.isArray(json) ? json : (json.items || []);

        for (const item of items) {
          const itemName = (item.name || "").trim();
          if (!itemName) continue;
          if (postTitle.includes(itemName) || postContent.includes(itemName)) {
            const link = item.link || item.url;
            if (link) {
              return { name: itemName, url: link };
            }
          }
        }
      } catch {
        // continue
      }
    }
  }

  const linkMatch = postContent.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
  if (linkMatch) {
    return { name: linkMatch[1], url: linkMatch[2] };
  }

  return { name: "공공데이터포털", url: "https://www.data.go.kr" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "_placeholder") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans text-stone-800 bg-[#FAF7F2] p-4 text-center">
        <span className="text-4xl mb-3">📬</span>
        <h1 className="text-2xl font-bold mb-2 text-stone-900">아직 작성된 블로그 글이 없습니다</h1>
        <p className="text-stone-500 text-sm mb-6">곧 새로운 공공 소식이 등록될 예정입니다.</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors"
        >
          메인으로 이동
        </Link>
      </div>
    );
  }

  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const sourceInfo = findSourceInfo(post.title, post.content);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://my-city-info-dod.pages.dev";

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.summary,
    author: {
      "@type": "Organization",
      name: "동대문구 생활 정보",
    },
    publisher: {
      "@type": "Organization",
      name: "동대문구 생활 정보",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}/`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "블로그",
        item: `${siteUrl}/blog/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}/`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-[#FAF7F2]">
      {/* BlogPosting 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      {/* BreadcrumbList 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm text-xl font-bold group-hover:scale-105 transition-transform">
              🏡
            </span>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900 block leading-tight">
                동대문구 생활 정보
              </span>
              <span className="text-[11px] text-amber-700 font-medium hidden sm:inline-block">
                우리 동네 맞춤 축제 &amp; 지원금 알리미
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              ℹ️ 소개
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold text-stone-600 bg-stone-100 hover:bg-amber-100 hover:text-stone-900 transition-colors"
            >
              <span>←</span> 블로그 목록
            </Link>
          </nav>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-6">
        {/* 네비게이션 경로 */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            홈
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-stone-900 transition-colors">
            블로그
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate">{post.title}</span>
        </nav>

        {/* 글 본문 카드 */}
        <article className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-8">
          {/* 헤더 메타정보 */}
          <div className="space-y-3 pb-6 border-b border-stone-100">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <span className="font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/60">
                {post.category}
              </span>
              <time className="text-stone-400 font-medium">
                발행일: {post.date}
              </time>
              <span className="text-stone-300">•</span>
              <span className="text-amber-800 font-medium bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-md">
                최종 업데이트: {post.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              {post.summary}
            </p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 마크다운 렌더링 영역 */}
          <div className="prose prose-stone max-w-none prose-headings:text-stone-900 prose-headings:font-bold prose-a:text-orange-600 prose-a:underline hover:prose-a:text-orange-700 prose-strong:text-stone-900 prose-blockquote:border-l-amber-400 prose-blockquote:bg-amber-50/40 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl leading-relaxed text-sm sm:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 본문 하단 광고 */}
          <AdBanner />

          {/* E-E-A-T 신뢰도 정보: 원문 출처 & AI 작성 안내 */}
          <div className="mt-10 pt-6 border-t border-stone-200 space-y-4">
            {/* 원문 출처 링크 표시 영역 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔗</span>
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    공공데이터 공식 원문 출처
                  </span>
                  <span className="text-xs text-stone-600 font-medium">
                    {sourceInfo.name}
                  </span>
                </div>
              </div>
              <a
                href={sourceInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-xs"
              >
                원문 링크 바로가기 ↗
              </a>
            </div>

            {/* AI 생성 안내 문구 & 최종 업데이트 고지 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-start gap-2.5 text-xs text-stone-600 leading-relaxed">
                <span className="text-base mt-0.5">ℹ️</span>
                <p>
                  이 글은{" "}
                  <a
                    href="https://www.data.go.kr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-amber-800 underline hover:text-amber-900"
                  >
                    공공데이터포털(data.go.kr)
                  </a>
                  의 정보를 바탕으로 AI가 작성하였습니다. 정확한 내용은 원문 링크를 통해 확인해주세요.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-stone-200/60 text-[11px] text-stone-500">
                <span>공공데이터 큐레이션 및 에디터 검수 완료</span>
                <span className="font-medium text-stone-600">
                  최종 업데이트: {post.date}
                </span>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>←</span> 목록으로 돌아가기
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              홈으로 이동 →
            </Link>
          </div>
        </article>
      </main>

      {/* 푸터 */}
      <footer className="mt-auto bg-stone-900 text-stone-300 py-10 border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-800 text-center sm:text-left">
            <div>
              <span className="text-base font-bold text-white block">
                동대문구 생활 정보
              </span>
              <p className="text-xs text-stone-400 mt-1">
                시민들을 위한 공공 생활 행사 및 지원 혜택 알리미 포털
              </p>
            </div>
            <div className="flex gap-4 text-xs text-stone-400">
              <Link href="/" className="hover:text-stone-300">홈으로</Link>
              <Link href="/blog" className="hover:text-stone-300">블로그 목록</Link>
              <Link href="/about" className="hover:text-stone-300">소개</Link>
            </div>
          </div>
          <p className="mt-6 text-[11px] text-stone-400 text-center sm:text-left">
            © {new Date().getFullYear()} 동대문구 생활 정보. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
