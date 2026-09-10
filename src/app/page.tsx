import cityDataRaw from "../../public/data/city-info.json";
import Link from "next/link";

interface InfoItem {
  id: string;
  name: string;
  category: "event" | "benefit";
  categoryLabel: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  badge?: string;
  url: string;
}

interface CityData {
  lastUpdated: string;
  source: string;
  items: InfoItem[];
}

const cityData = cityDataRaw as CityData;

export default function Home() {
  // 오늘 날짜 기준으로 행사 상태(D-Day, 진행 중, 행사 종료)를 계산하는 직관적인 함수
  const getEventStatus = (startDate: string, endDate: string, defaultBadge?: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const today = new Date(todayStr).getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const oneDay = 1000 * 60 * 60 * 24;

    if (today > end) {
      return {
        label: "행사 종료",
        className: "bg-stone-100 text-stone-500 border-stone-200",
        isPast: true,
      };
    }

    if (today >= start && today <= end) {
      return {
        label: "진행 중",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold",
        isPast: false,
      };
    }

    const diffDays = Math.ceil((start - today) / oneDay);
    if (diffDays === 0) {
      return {
        label: "오늘 진행",
        className: "bg-rose-50 text-rose-600 border-rose-200 font-bold",
        isPast: false,
      };
    } else if (diffDays <= 7) {
      return {
        label: `D-${diffDays} 임박`,
        className: "bg-rose-50 text-rose-600 border-rose-200 font-bold",
        isPast: false,
      };
    } else {
      return {
        label: defaultBadge || "진행 예정",
        className: "bg-orange-50 text-orange-700 border-orange-200 font-medium",
        isPast: false,
      };
    }
  };

  // 진행 중이거나 예정된 행사를 먼저 보여주고, 종료된 행사는 뒤로 정렬
  const events = cityData.items
    .filter((item) => item.category === "event")
    .map((item) => ({
      ...item,
      status: getEventStatus(item.startDate, item.endDate, item.badge),
    }))
    .sort((a, b) => {
      if (a.status.isPast !== b.status.isPast) {
        return a.status.isPast ? 1 : -1;
      }
      return a.startDate.localeCompare(b.startDate);
    });

  const benefits = cityData.items.filter((item) => item.category === "benefit");
  const upcomingEventsCount = events.filter((item) => !item.status.isPast).length;

  const formatDate = (start: string, end: string) => {
    if (start === end) {
      return start;
    }
    return `${start} ~ ${end}`;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-[#FAF7F2]">
      {/* 1. 상단 네비게이션 & 헤더 */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm text-xl font-bold">
              🏡
            </span>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 block leading-tight">
                동대문구 생활 정보
              </span>
              <span className="text-[11px] text-amber-700 font-medium hidden sm:inline-block">
                우리 동네 맞춤 축제 &amp; 지원금 알리미
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <a
              href="#events"
              className="px-3 py-1.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              🌸 행사·축제
            </a>
            <a
              href="#benefits"
              className="px-3 py-1.5 rounded-full text-stone-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              🎁 지원금·혜택
            </a>
            <Link
              href="/blog"
              className="px-3 py-1.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              📝 블로그
            </Link>
            <Link
              href="/about"
              className="px-3 py-1.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              ℹ️ 소개
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. 메인 히어로 배너 */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-100/60 via-orange-50/40 to-[#FAF7F2] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium mb-4 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            동대문구 최신 공공데이터 연동 중
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight sm:leading-snug">
            우리 동네 <span className="text-orange-600 underline decoration-amber-300 decoration-wavy decoration-2">동대문</span>의
            <br className="hidden sm:inline" /> 알찬 생활 소식을 한눈에!
          </h1>

          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
            놓치면 아쉬운 이번 달 주요 문화 축제·행사 소식부터 
            꼭 챙겨야 할 청년 월세 지원 및 출산지원금 혜택까지 편리하게 확인하세요.
          </p>

          {/* 주요 통계 카드 */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block">진행·예정 축제·행사</span>
              <span className="text-2xl font-bold text-orange-600 mt-1 block">
                {upcomingEventsCount}건
              </span>
            </div>
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block">지원금·혜택 소식</span>
              <span className="text-2xl font-bold text-amber-600 mt-1 block">
                {benefits.length}건
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white/90 p-4 rounded-2xl border border-amber-100 shadow-xs flex sm:flex-col justify-between items-center sm:items-start">
              <span className="text-xs font-medium text-stone-500">정보 업데이트</span>
              <span className="text-sm font-semibold text-stone-700 mt-1">
                {cityData.lastUpdated}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 본문 컨텐츠 영역 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-16">
        {/* 섹션 1: 행사/축제 카드 목록 */}
        <section id="events" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-stone-200/80 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌸</span>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                  이번 달 행사 &amp; 축제
                </h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">
                가족, 연인, 친구와 함께 즐길 수 있는 동대문구 주요 축제 일정입니다.
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-orange-100 text-orange-800 self-start sm:self-auto">
              총 {events.length}개의 행사 ({upcomingEventsCount}개 진행·예정)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((item) => (
              <article
                key={item.id}
                className={`group flex flex-col bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                  item.status.isPast
                    ? "border-stone-200/70 opacity-80"
                    : "border-stone-200/80 shadow-xs hover:shadow-md hover:border-orange-200"
                }`}
              >
                {/* Event 구조화 데이터 */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "Event",
                      name: item.name,
                      startDate: item.startDate,
                      endDate: item.endDate,
                      location: {
                        "@type": "Place",
                        name: item.location,
                      },
                      description: item.summary,
                    }),
                  }}
                />

                {/* 카드 상단 배지 */}
                <div className="p-6 pb-4 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/60">
                    {item.categoryLabel}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.status.className}`}>
                    {item.status.label}
                  </span>
                </div>

                {/* 제목 & 요약 */}
                <div className="px-6 flex-1">
                  <Link href="/blog" className="block">
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="mt-2 text-sm text-stone-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* 상세 메타 정보 */}
                <div className="p-6 pt-4 mt-4 bg-stone-50/70 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-stone-700 shrink-0 w-10">🗓️ 기간</span>
                    <span className="text-stone-800 font-medium">
                      {formatDate(item.startDate, item.endDate)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-stone-700 shrink-0 w-10">📍 장소</span>
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-stone-700 shrink-0 w-10">👥 대상</span>
                    <span className="truncate">{item.target}</span>
                  </div>
                </div>

                {/* 버튼 */}
                <div className="px-6 py-3.5 bg-white border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-400">참가비 무료/상세확인</span>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    자세히 보기
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 섹션 2: 지원금/혜택 카드 목록 */}
        <section id="benefits" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-stone-200/80 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                  지원금 &amp; 복지 혜택
                </h2>
              </div>
              <p className="text-sm text-stone-500 mt-1">
                동대문구민이라면 누릴 수 있는 맞춤형 경제 지원 및 복지 혜택 정보입니다.
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-800 self-start sm:self-auto">
              총 {benefits.length}개의 혜택
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {benefits.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 overflow-hidden"
              >
                {/* GovernmentService 구조화 데이터 */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "GovernmentService",
                      name: item.name,
                      description: item.summary,
                      provider: {
                        "@type": "GovernmentOrganization",
                        name: "동대문구청",
                      },
                    }),
                  }}
                />

                {/* 상단 혜택 뱃지 */}
                <div className="p-6 pb-4 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/60">
                    {item.categoryLabel}
                  </span>
                  {item.badge && (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                      ✨ {item.badge}
                    </span>
                  )}
                </div>

                {/* 제목 & 요약 */}
                <div className="px-6 flex-1">
                  <Link href="/blog" className="block">
                    <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* 상세 조건 정보 */}
                <div className="p-6 pt-4 mt-4 bg-amber-50/40 border-t border-amber-100/60 space-y-2 text-xs text-stone-600">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-stone-700 shrink-0 w-14">🗓️ 신청기간</span>
                    <span className="text-stone-800 font-medium">
                      {formatDate(item.startDate, item.endDate)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-stone-700 shrink-0 w-14">👥 지원대상</span>
                    <span className="text-stone-800">{item.target}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-stone-700 shrink-0 w-14">🏢 신청방법</span>
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                {/* 버튼 */}
                <div className="px-6 py-4 bg-white border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-amber-700 font-medium">예산 소진 시 조기 마감 가능</span>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-xs"
                  >
                    자세히 보기
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. 안내 배너 */}
        <section className="rounded-3xl bg-linear-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-stone-900">
              우리 동네 새로운 소식을 놓치지 마세요! 📬
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              공공데이터포털을 통해 매일 최신 행사와 지원금 정보를 수집하여 업데이트하고 있습니다.
            </p>
          </div>
          <a
            href="#events"
            className="shrink-0 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            소식 다시 둘러보기
          </a>
        </section>
      </main>

      {/* 5. 하단 푸터 */}
      <footer className="mt-auto bg-stone-900 text-stone-300 py-10 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-800 text-center sm:text-left">
            <div>
              <span className="text-base font-bold text-white block">
                동대문구 생활 정보
              </span>
              <p className="text-xs text-stone-400 mt-1">
                시민들을 위한 공공 생활 행사 및 지원 혜택 알리미 포털
              </p>
            </div>
            <div className="text-xs text-stone-400 text-center sm:text-right space-y-1">
              <p>
                <span className="text-stone-300 font-medium">데이터 출처:</span> {cityData.source}
              </p>
              <p>
                <span className="text-stone-300 font-medium">최종 업데이트:</span> {cityData.lastUpdated}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-3 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} 동대문구 생활 정보. 모든 공공데이터는 공공데이터포털(data.go.kr)에 의거하여 제공됩니다.
            </p>
            <div className="flex gap-4">
              <span className="hover:text-stone-300 cursor-pointer">이용약관</span>
              <span className="hover:text-stone-300 cursor-pointer">개인정보처리방침</span>
              <span className="hover:text-stone-300 cursor-pointer">문의하기</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
