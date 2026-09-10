"use client";

import { useEffect } from "react";

interface AdBannerProps {
  slot?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

export default function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // 값이 없거나 "나중에_입력" 이거나 비어있으면 빈 공간 없이 null 반환
  if (!adsenseId || adsenseId.trim() === "" || adsenseId.trim() === "나중에_입력") {
    return null;
  }

  const clientPublisherId = adsenseId.startsWith("ca-")
    ? adsenseId
    : `ca-${adsenseId}`;

  useEffect(() => {
    try {
      // @ts-ignore
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      // 에드센스 스크립트 로드 전 오류 방지
    }
  }, []);

  return (
    <aside
      aria-label="광고"
      className={`w-full overflow-hidden text-center my-6 flex justify-center items-center ${className}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "90px", width: "100%" }}
        data-ad-client={clientPublisherId}
        data-ad-slot={slot || undefined}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </aside>
  );
}
