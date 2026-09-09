import cityDataRaw from "../../../../public/data/city-info.json";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  detail?: string;
  badge?: string;
  url: string;
}

interface CityData {
  lastUpdated: string;
  source: string;
  items: InfoItem[];
}

const cityData = cityDataRaw as CityData;

export async function generateStaticParams() {
  return cityData.items.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = cityData.items.find((i) => i.id === id);

  if (!item) {
    return {
      title: "정보를 찾을 수 없습니다 | 성남시 생활 정보",
    };
  }

  return {
    title: `${item.name} | 성남시 생활 정보`,
    description: item.summary,
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = cityData.items.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const isEvent = item.category === "event";

  const formatDate = (start: string, end: string) => {
    if (start === end) {
      return start;
    }
    return `${start} ~ ${end}`;
  };

  const paragraphs = (item.detail || item.summary).split("\n\n");

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-[#FAF7F2]">
      {/* 1. 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm text-xl font-bold group-hover:scale-105 transition-transform">
              🏡
            </span>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900 block leading-tight">
                성남시 생활 정보
              </span>
              <span className="text-[11px] text-amber-700 font-medium hidden sm:inline-block">
                우리 동네 맞춤 축제 &amp; 지원금 알리미
              </span>
            </div>
          </Link>

          <Link
            href={isEvent ? "/#events" : "/#benefits"}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-stone-600 bg-stone-100 hover:bg-amber-100 hover:text-stone-900 transition-colors"
          >
            <span>←</span> 목록으로
          </Link>
        </div>
      </header>

      {/* 2. 본문 상세 영역 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-6">
        {/* 브레드크럼 (현재 위치 안내) */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            홈
          </Link>
          <span>/</span>
          <Link
            href={isEvent ? "/#events" : "/#benefits"}
            className="hover:text-stone-900 transition-colors"
          >
            {item.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate">
            {item.name}
          </span>
        </nav>

        {/* 상세 메인 카드 */}
        <article className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-8">
          {/* 상단 태그 & 배지 */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                isEvent
                  ? "bg-orange-50 text-orange-700 border-orange-200/60"
                  : "bg-amber-50 text-amber-800 border-amber-200/60"
              }`}
            >
              {isEvent ? "🌸 " : "🎁 "}
              {item.categoryLabel}
            </span>

            {item.badge && (
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full text-white shadow-xs ${
                  isEvent
                    ? "bg-linear-to-r from-rose-500 to-orange-500"
                    : "bg-linear-to-r from-amber-500 to-orange-500"
                }`}
              >
                ✨ {item.badge}
              </span>
            )}
          </div>

          {/* 행사 / 혜택 이름 (크게) */}
          <div className="space-y-3 pb-6 border-b border-stone-100">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {item.name}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* 주요 핵심 정보 박스 (기간, 장소, 대상) */}
          <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>📋</span> 핵심 요약 정보
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <dt className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <span>🗓️</span> {isEvent ? "행사 기간" : "신청 기간"}
                </dt>
                <dd className="font-bold text-stone-900">
                  {formatDate(item.startDate, item.endDate)}
                </dd>
              </div>

              <div className="space-y-1">
                <dt className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <span>📍</span> {isEvent ? "행사 장소" : "신청처 및 방법"}
                </dt>
                <dd className="font-bold text-stone-900">
                  {item.location}
                </dd>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <dt className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <span>👥</span> {isEvent ? "참여 대상" : "지원 자격 및 대상"}
                </dt>
                <dd className="font-bold text-stone-900">
                  {item.target}
                </dd>
              </div>
            </dl>
          </div>

          {/* 상세 설명 전문 */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <span>📌</span> 상세 설명 안내
            </h2>

            <div className="space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
              {paragraphs.map((para, idx) => (
                <p key={idx} className="bg-stone-50/60 p-4 sm:p-5 rounded-2xl border border-stone-100">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* 하단 유의사항 알림 박스 */}
          <div className="rounded-2xl bg-stone-50 border border-stone-200/70 p-4 text-xs text-stone-500 space-y-1">
            <p className="font-bold text-stone-700">💡 꼭 확인해 주세요!</p>
            <p>
              본 페이지의 정보는 공공데이터포털(data.go.kr)의 공공누리 제공 자료를 기초로 작성되었습니다. 
              주관 기관의 일정 변동이나 예산 사정에 따라 조기 마감될 수 있으므로, 신청 및 방문 전 공식 사이트의 최신 공지를 확인하시기 바랍니다.
            </p>
          </div>

          {/* 버튼 영역 (원본 사이트 링크 & 목록으로 돌아가기) */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href={isEvent ? "/#events" : "/#benefits"}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 text-sm font-semibold transition-colors text-center inline-flex items-center justify-center gap-2"
            >
              <span>←</span> 목록으로 돌아가기
            </Link>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold shadow-sm hover:shadow-md transition-all text-center inline-flex items-center justify-center gap-2"
            >
              자세히 보기 →
            </a>
          </div>
        </article>
      </main>

      {/* 3. 하단 푸터 */}
      <footer className="mt-auto bg-stone-900 text-stone-300 py-10 border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-800 text-center sm:text-left">
            <div>
              <span className="text-base font-bold text-white block">
                성남시 생활 정보
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
              © {new Date().getFullYear()} 성남시 생활 정보. 모든 공공데이터는 공공데이터포털(data.go.kr)에 의거하여 제공됩니다.
            </p>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-stone-300">홈으로</Link>
              <Link href="/#events" className="hover:text-stone-300">행사목록</Link>
              <Link href="/#benefits" className="hover:text-stone-300">지원금목록</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
