import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개 | 동대문구 생활 정보",
  description: "동대문구 생활 정보 포털의 운영 목적, 공공데이터포털 데이터 출처, AI 기반 콘텐츠 생성 방식 및 투명성 안내입니다.",
  openGraph: {
    title: "소개 | 동대문구 생활 정보",
    description: "동대문구 생활 정보 포털의 운영 목적, 공공데이터포털 데이터 출처, AI 기반 콘텐츠 생성 방식 및 투명성 안내입니다.",
    url: "https://dongdaemungu.com/about/",
    siteName: "동대문구 생활 정보",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-[#FAF7F2]">
      {/* 1. 상단 네비게이션 & 헤더 */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
            <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm text-base sm:text-xl font-bold group-hover:scale-105 transition-transform shrink-0">
              🏡
            </span>
            <div className="min-w-0">
              <span className="text-sm sm:text-xl font-bold tracking-tight text-stone-900 block leading-tight whitespace-nowrap truncate">
                동대문구 생활 정보
              </span>
              <span className="text-[11px] text-amber-700 font-medium hidden sm:inline-block">
                우리 동네 맞춤 축제 &amp; 지원금 알리미
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-3 text-xs sm:text-sm font-medium shrink-0">
            <Link
              href="/#events"
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              🌸 행사<span className="hidden sm:inline">·축제</span>
            </Link>
            <Link
              href="/#benefits"
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-stone-600 hover:text-amber-600 hover:bg-amber-50 transition-colors whitespace-nowrap"
            >
              🎁 혜택<span className="hidden sm:inline">·지원금</span>
            </Link>
            <Link
              href="/blog"
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              📝 블로그
            </Link>
            <Link
              href="/about"
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-orange-700 bg-orange-100/70 font-bold transition-colors whitespace-nowrap"
            >
              ℹ️ 소개
            </Link>
          </nav>
        </div>
      </header>

      {/* 헤더 배너 */}
      <section className="bg-linear-to-b from-amber-100/60 via-orange-50/40 to-[#FAF7F2] py-12 sm:py-16 border-b border-amber-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium mb-3 shadow-xs">
            <span>ℹ️</span> 서비스 소개 및 운영 안내
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            동대문구 생활 정보 <span className="text-orange-600">서비스 안내</span>
          </h1>
          <p className="mt-3 text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            동대문구민 여러분께 꼭 필요한 생활 밀착형 정보와 복지 지원금 혜택을 알기 쉽게 큐레이션하여 전달합니다.
          </p>
        </div>
      </section>

      {/* 본문 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full space-y-10">
        {/* 1. 운영 목적 */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-600 text-xl font-bold">
              🎯
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              사이트 운영 목적
            </h2>
          </div>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            지자체와 정부 부처에서는 시민들을 위한 수많은 문화 행사, 체육 축제, 복지 지원금 및 청년·육아 혜택을 매일 발표하고 있습니다.
            하지만 정보가 여러 기관 사이트에 흩어져 있어 많은 시민분들이 자신에게 주어지는 소중한 혜택을 미처 알지 못해 놓치는 경우가 많습니다.
          </p>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            <strong>&apos;동대문구 생활 정보&apos;</strong>는 이러한 문제를 해결하고자 시작되었습니다.
            동대문구민과 인근 주민분들이 복잡한 행정 용어 대신 친근하고 명확한 가이드를 통해,
            내가 받을 수 있는 지원금과 우리 가족이 함께 즐길 수 있는 축제 일정을 한눈에 확인하실 수 있도록 돕습니다.
          </p>
        </section>

        {/* 2. 데이터 출처 */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700 text-xl font-bold">
              🏛️
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              공식 데이터 출처
            </h2>
          </div>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            본 사이트에서 제공하는 모든 공공서비스 및 행사 정보는 대한민국 정부가 운영하는{" "}
            <a
              href="https://www.data.go.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-bold underline hover:text-orange-700"
            >
              공공데이터포털 (data.go.kr)
            </a>
            의 공식 오픈 API 및 지자체 공개 데이터를 기반으로 수집됩니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-lg block mb-1">🌐</span>
              <strong className="text-xs sm:text-sm font-bold text-stone-900 block">공공데이터포털</strong>
              <p className="text-xs text-stone-500 mt-1">행정안전부 공공데이터 개방 API</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-lg block mb-1">📋</span>
              <strong className="text-xs sm:text-sm font-bold text-stone-900 block">정부24 &amp; 복지로</strong>
              <p className="text-xs text-stone-500 mt-1">중앙부처·지자체 맞춤 복지 혜택</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <span className="text-lg block mb-1">🏢</span>
              <strong className="text-xs sm:text-sm font-bold text-stone-900 block">동대문구청 &amp; 산하기관</strong>
              <p className="text-xs text-stone-500 mt-1">지역 특화 문화·축제 및 일자리 공고</p>
            </div>
          </div>
        </section>

        {/* 3. 콘텐츠 생성 방식 및 AI 활용 안내 */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-700 text-xl font-bold">
              🤖
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              콘텐츠 생성 방식 (AI 활용 안내)
            </h2>
          </div>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            원문 공공데이터는 서식과 행정 용어가 복잡하여 바쁜 일상 속에서 핵심을 빠르게 파악하기 어려울 때가 많습니다.
            본 포털은 독자의 가독성을 극대화하기 위해 다음과 같은 자동화 및 검수 프로세스를 거쳐 콘텐츠를 발행합니다.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <span className="text-base font-bold text-blue-600">1</span>
              <div className="text-xs sm:text-sm text-stone-700">
                <strong>공공 API 데이터 실시간 수집:</strong> 공식 인증키를 통해 검증된 최신 공공서비스 데이터를 자동 수집합니다.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <span className="text-base font-bold text-blue-600">2</span>
              <div className="text-xs sm:text-sm text-stone-700">
                <strong>생성형 AI(Gemini) 요약 가공:</strong> 지원 대상, 혜택 내용, 신청 기간, 추천 포인트를 시민 눈높이에 맞게 친근한 블로그 글로 재구성합니다.
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <span className="text-base font-bold text-blue-600">3</span>
              <div className="text-xs sm:text-sm text-stone-700">
                <strong>원문 링크 및 소관 기관 투명 공개:</strong> 각 게시글마다 원문 공고 링크와 문의처를 항상 제공하여 누구나 사실 여부를 즉시 교차 검증할 수 있도록 지원합니다.
              </div>
            </div>
          </div>
        </section>

        {/* 4. 면책 고지 & 신뢰성 안내 */}
        <section className="bg-amber-50/50 rounded-3xl border border-amber-200/80 p-6 sm:p-8 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
            <span>⚠️</span> 유의사항 및 면책 고지
          </h3>
          <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
            &apos;동대문구 생활 정보&apos;는 동대문구민 및 이용자의 편의를 돕기 위해 공공데이터를 큐레이션하는 비공식 민간 정보 포털입니다.
            공공기관의 정책 변경, 예산 소진, 조기 마감 등에 따라 최신 정보와 차이가 발생할 수 있으므로,
            중요한 지원금 신청이나 행사 참여 전에는 반드시 각 글 하단에 제공된 <strong>공식 원문 링크</strong>를 통해 최종 확인하시기 바랍니다.
          </p>
        </section>

        {/* 하단 바로가기 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors shadow-xs"
          >
            ← 메인 홈으로 가기
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-colors shadow-xs"
          >
            📝 최신 블로그 글 보기
          </Link>
        </div>
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
              <Link href="/about" className="text-amber-400 font-semibold">소개</Link>
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
