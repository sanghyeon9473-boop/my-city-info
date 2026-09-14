import Link from "next/link";

interface HeaderProps {
  activeNav?: "events" | "benefits" | "blog" | "about";
}

export default function Header({ activeNav }: HeaderProps) {
  const isEvents = activeNav === "events";
  const isBenefits = activeNav === "benefits";
  const isBlog = activeNav === "blog";
  const isAbout = activeNav === "about";

  const getLinkClass = (isActive: boolean) =>
    isActive
      ? "px-2 sm:px-3 py-1.5 rounded-full text-orange-700 bg-orange-100/70 font-bold transition-colors whitespace-nowrap"
      : "px-2 sm:px-3 py-1.5 rounded-full text-stone-600 hover:text-orange-600 hover:bg-orange-50 transition-colors whitespace-nowrap";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm text-lg sm:text-xl font-bold group-hover:scale-105 transition-transform">
            🏡
          </span>
          <div className="hidden sm:block">
            <span className="text-xl font-bold tracking-tight text-stone-900 block leading-tight">
              동대문구 생활 정보
            </span>
            <span className="text-[11px] text-amber-700 font-medium">
              우리 동네 맞춤 축제 &amp; 지원금 알리미
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3 text-[13px] sm:text-sm font-medium">
          <Link href="/#events" className={getLinkClass(isEvents)}>
            🌸 행사·축제
          </Link>
          <Link href="/#benefits" className={getLinkClass(isBenefits)}>
            🎁 혜택·지원금
          </Link>
          <Link href="/blog" className={getLinkClass(isBlog)}>
            📝 블로그
          </Link>
          <Link href="/about" className={getLinkClass(isAbout)}>
            ℹ️ 소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
