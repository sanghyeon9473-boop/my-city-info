import Link from "next/link";

interface FooterProps {
  source?: string;
  lastUpdated?: string;
}

export default function Footer({
  source = "공공데이터포털(data.go.kr)",
  lastUpdated,
}: FooterProps) {
  return (
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
              <span className="text-stone-300 font-medium">데이터 출처:</span> {source}
            </p>
            {lastUpdated && (
              <p>
                <span className="text-stone-300 font-medium">최종 업데이트:</span> {lastUpdated}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-3 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} 동대문구 생활 정보. 모든 공공데이터는 공공데이터포털(data.go.kr)에 의거하여 제공됩니다.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-stone-300">
              소개
            </Link>
            <Link href="/blog" className="hover:text-stone-300">
              블로그
            </Link>
            <a
              href="mailto:contact@dongdaemungu.com"
              className="hover:text-stone-300"
            >
              문의하기
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
