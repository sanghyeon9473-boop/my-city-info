import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "지원금·복지 소식 블로그 | 동대문구 생활 정보",
  description: "동대문구민을 위한 최신 정부 지원금, 복지 혜택 및 신청 가이드를 알기 쉽게 전해드립니다.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-[#FAF7F2]">
      {/* 상단 헤더 */}
      <Header activeNav="blog" />

      {/* 헤더 배너 */}
      <section className="bg-linear-to-b from-amber-100/60 via-orange-50/40 to-[#FAF7F2] py-10 sm:py-14 border-b border-amber-100/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium mb-3 shadow-xs">
            <span>📝</span> 우리 동네 혜택 알리미
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            동대문구 지원금 &amp; 복지 <span className="text-orange-600">블로그</span>
          </h1>
          <p className="mt-2.5 text-stone-600 text-base sm:text-lg max-w-2xl">
            동대문구민을 위한 최신 지원금 신청 가이드와 유용한 복지 혜택 소식을 확인해 보세요.
          </p>
        </div>
      </section>

      {/* 블로그 글 목록 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <span className="text-4xl block">📬</span>
            <h2 className="text-xl font-bold text-stone-800">
              아직 등록된 블로그 글이 없습니다
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              매일 공공데이터와 새로운 소식을 바탕으로 유익한 글이 업데이트될 예정입니다. 조금만 기다려 주세요!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors mt-2"
            >
              <span>←</span> 메인으로 돌아가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/60">
                      {post.category}
                    </span>
                    <time className="text-xs text-stone-400 font-medium">
                      {post.date}
                    </time>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mt-2.5 text-sm text-stone-600 line-clamp-3 leading-relaxed flex-1">
                    {post.summary}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-stone-100">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-stone-50/50 border-t border-stone-100 flex items-center justify-end">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    글 읽기
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 푸터 직전 광고 배너 */}
        <div className="mt-10">
          <AdBanner />
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
