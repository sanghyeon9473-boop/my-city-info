import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 동대문구 생활 정보",
  description:
    "동대문구 생활 정보 포털의 개인정보 수집 및 이용, 쿠키(Cookie) 정책, 구글 애드센스(Google AdSense) 광고 파트너십 및 이용자 권리 보호에 관한 안내입니다.",
  openGraph: {
    title: "개인정보처리방침 | 동대문구 생활 정보",
    description:
      "동대문구 생활 정보 포털의 개인정보 수집 및 이용, 쿠키(Cookie) 정책, 구글 애드센스(Google AdSense) 광고 파트너십 및 이용자 권리 보호에 관한 안내입니다.",
    url: "https://dongdaemungu.com/privacy/",
    siteName: "동대문구 생활 정보",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-[#FAF7F2]">
      {/* 1. 상단 네비게이션 & 헤더 */}
      <Header activeNav="privacy" />

      {/* 헤더 배너 */}
      <section className="bg-linear-to-b from-amber-100/60 via-orange-50/40 to-[#FAF7F2] py-12 sm:py-16 border-b border-amber-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium mb-3 shadow-xs">
            <span>🛡️</span> 개인정보 및 이용자 보호 정책
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            개인정보<span className="text-orange-600">처리방침</span>
          </h1>
          <p className="mt-3 text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            &apos;동대문구 생활 정보&apos;는 이용자의 개인정보를 소중히 여기며, 관련 법령 및 구글 광고 정책을 준수하여 이용자 권익을 적극 보호합니다.
          </p>
        </div>
      </section>

      {/* 본문 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full space-y-8 text-stone-700 leading-relaxed">
        {/* 요약 박스 */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-amber-900 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-amber-950">
            <span>📌</span> 핵심 요약
          </p>
          <ul className="list-disc list-inside space-y-1 text-amber-900/90">
            <li>본 사이트는 별도의 회원가입 없이 누구나 무료로 자유롭게 이용하실 수 있습니다.</li>
            <li>이용 과정에서 이용자를 식별할 수 있는 주민번호, 연락처 등의 민감한 개인정보를 직접 수집하지 않습니다.</li>
            <li>서비스 품질 개선 및 맞춤형 광고 게재(구글 애드센스 등)를 위해 쿠키(Cookie) 및 접속 로그가 활용될 수 있으며, 이용자는 이를 언제든지 거부할 수 있습니다.</li>
          </ul>
        </div>

        {/* 제1조 총칙 및 수집하는 정보 */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span className="text-orange-600">제1조</span> 총칙 및 수집 항목
          </h2>
          <p className="text-sm sm:text-base">
            &apos;동대문구 생활 정보&apos;(이하 &apos;사이트&apos;)는 이용자의 자유와 기본권을 보장하기 위해 「개인정보 보호법」 및 정보통신망법 등 관련 법령을 철저히 준수합니다.
          </p>
          <div className="pt-2 space-y-2">
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">1. 수집하는 정보 항목</h3>
            <p className="text-xs sm:text-sm text-stone-600">
              사이트 이용 과정에서 다음과 같은 비식별 정보가 서비스 환경 개선 및 통계 분석을 위해 자동으로 생성되어 수집될 수 있습니다.
            </p>
            <ul className="list-disc list-inside text-xs sm:text-sm text-stone-600 pl-2 space-y-1">
              <li>접속 IP 주소, 방문 일시, 브라우저 종류 및 OS 정보</li>
              <li>방문 페이지(URL), 이전 방문 웹사이트(Referrer)</li>
              <li>쿠키(Cookie) 및 세션 데이터</li>
            </ul>
          </div>
        </section>

        {/* 제2조 구글 애드센스 및 제3자 광고 게재 (애드센스 승인 필수 조항) */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4 border-l-4 border-l-orange-500">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span className="text-orange-600">제2조</span> 구글 애드센스 및 맞춤형 광고 정책 (중요)
          </h2>
          <p className="text-sm sm:text-base">
            본 사이트는 지속적이고 안정적인 무료 정보 제공을 위하여 <strong>Google Inc.(구글)를 비롯한 제3자 광고 서비스(구글 애드센스 등)</strong>를 이용하고 있습니다.
          </p>
          <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">1. 제3자 공급업체의 쿠키 사용</h3>
              <p>
                Google을 포함한 제3자 공급업체는 사용자가 본 사이트 또는 다른 웹사이트에 이전에 방문한 기록을 바탕으로 광고를 게재하기 위해 <strong>쿠키(Cookie)</strong>를 사용합니다.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">2. 맞춤형 광고 및 DoubleClick 쿠키</h3>
              <p>
                Google의 광고 쿠키를 사용하면 Google 및 Google 파트너는 사용자의 본 사이트 및 인터넷의 다른 사이트 방문 기록을 기반으로 사용자에게 가장 적합한 <strong>맞춤형 광고</strong>를 게재할 수 있습니다.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">3. 맞춤형 광고 수신 거부(Opt-out) 방법</h3>
              <p>
                이용자는 원하지 않을 경우 언제든지 맞춤형 광고 수신을 거부할 권리가 있습니다.
              </p>
              <ul className="list-disc list-inside pl-2 space-y-1.5 pt-1">
                <li>
                  <strong>구글 광고 설정:</strong> 이용자는{" "}
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-bold underline hover:text-orange-700"
                  >
                    Google 광고 설정(adssettings.google.com)
                  </a>
                  에 접속하여 맞춤형 광고를 사용 중지할 수 있습니다.
                </li>
                <li>
                  <strong>제3자 쿠키 관리:</strong> 이용자는{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-bold underline hover:text-orange-700"
                  >
                    www.aboutads.info
                  </a>
                  에 방문하여 제3자 공급업체의 맞춤 광고 게재용 쿠키 사용을 선택 해제할 수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 제3조 쿠키(Cookie)의 운용 및 거부 방법 */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span className="text-orange-600">제3조</span> 쿠키(Cookie)의 운용 및 브라우저 차단 방법
          </h2>
          <p className="text-sm sm:text-base">
            쿠키는 웹사이트를 운영하는 데 이용되는 서버가 이용자의 웹 브라우저에 보내는 아주 작은 텍스트 파일로, 이용자의 PC 또는 모바일 디바이스에 저장됩니다.
          </p>
          <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-600">
            <p>
              이용자는 웹 브라우저 설정을 통해 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있는 선택권을 가집니다. 단, 쿠키 저장을 거부할 경우 일부 서비스 이용에 불편이 있을 수 있습니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                <strong className="block text-stone-900 mb-1">Chrome(크롬)</strong>
                <span className="text-stone-500 text-xs">설정 &gt; 개인정보 및 보안 &gt; 서드 파티 쿠키 차단</span>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                <strong className="block text-stone-900 mb-1">Safari(사파리)</strong>
                <span className="text-stone-500 text-xs">환경설정 &gt; 개인정보 보호 &gt; 모든 쿠키 차단</span>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
                <strong className="block text-stone-900 mb-1">Edge(엣지)</strong>
                <span className="text-stone-500 text-xs">설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 데이터 관리 및 삭제</span>
              </div>
            </div>
          </div>
        </section>

        {/* 제4조 외부 링크 및 공공데이터 연결 면책 */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span className="text-orange-600">제4조</span> 외부 링크 및 제3자 사이트 면책
          </h2>
          <p className="text-sm sm:text-base">
            본 사이트는 동대문구민의 편의를 위해 정부24, 복지로, 공공데이터포털, 동대문구청 등 외부 공공기관 웹사이트로 연결되는 링크를 제공하고 있습니다.
          </p>
          <p className="text-xs sm:text-sm text-stone-600">
            링크를 클릭하여 외부 웹사이트로 이동하실 경우, 해당 웹사이트의 개인정보처리방침 및 서비스 이용약관이 적용되므로 방문하시는 외부 웹사이트의 정책을 별도로 확인하시기 바랍니다.
          </p>
        </section>

        {/* 제5조 개인정보의 파기 및 보유 기간 */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span className="text-orange-600">제5조</span> 개인정보의 파기 및 보유 기간
          </h2>
          <p className="text-sm sm:text-base">
            본 사이트는 원칙적으로 개인 식별 정보를 수집·보관하지 않으며, 목적이 달성된 임시 로그 데이터 등은 관계 법령에 따른 보존 의무가 없는 한 지체 없이 안전하게 파기됩니다.
          </p>
        </section>

        {/* 제6조 개인정보 보호책임자 및 문의처 */}
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span className="text-orange-600">제6조</span> 개인정보 보호책임자 및 고충 처리 문의처
          </h2>
          <p className="text-sm sm:text-base">
            본 사이트는 이용자의 개인정보 관련 문의 및 의견, 불만 사항 처리를 위해 아래와 같이 담당 창구를 운영하고 있습니다.
          </p>
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm space-y-1.5 text-stone-700">
            <p><strong>서비스명:</strong> 동대문구 생활 정보 (비공식 공공정보 포털)</p>
            <p><strong>개인정보 관리 책임:</strong> 동대문구 생활 정보 운영팀</p>
            <p>
              <strong>문의 전자우편:</strong>{" "}
              <a href="mailto:contact@dongdaemungu.com" className="text-orange-600 font-bold underline">
                contact@dongdaemungu.com
              </a>
            </p>
          </div>
        </section>

        {/* 제7조 방침 변경 및 시행일자 */}
        <section className="bg-stone-100 rounded-2xl p-5 sm:p-6 text-xs text-stone-500 space-y-1 border border-stone-200">
          <p className="font-bold text-stone-700 text-sm mb-1">제7조 개정 및 고지 의무</p>
          <p>현 개인정보처리방침은 정부의 법령 및 지침 변경이나 서비스의 변경 사항에 따라 수정될 수 있습니다.</p>
          <p>내용의 추가, 삭제 및 수정이 있을 시에는 웹사이트를 통해 공지할 것입니다.</p>
          <p className="pt-2 font-medium text-stone-600">
            <strong>공고일자:</strong> 2026년 9월 14일 | <strong>시행일자:</strong> 2026년 9월 14일
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
            href="/about"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-sm font-semibold transition-colors shadow-xs"
          >
            ℹ️ 서비스 소개 보기
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
