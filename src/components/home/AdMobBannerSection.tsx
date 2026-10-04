import React, { useEffect, useRef } from 'react';
import { BANNER_HEIGHT, BANNER_WIDTH, removeBanner } from '../../services/admobService';

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 배너 광고 구좌 (인라인 DOM 320x50 규격)
 *
 * - Google AdMob 앱 ID: ca-app-pub-3878859120989916~2898554632
 * - 광고 단위 ID: ca-app-pub-3878859120989916/9433572199
 * - 클라이언트 ID: ca-pub-3878859120989916
 * - 규격: 320x50 표준 배너 (BANNER_WIDTH x BANNER_HEIGHT)
 *
 * [핵심 해결]
 * 1) 하단 탭바 위에 고정되어 화면을 가리던 네이티브 플로팅 배너를 완전 제거(removeBanner)
 * 2) 카테고리 바로 아래 '신상픽 추천 스폰서드' 슬롯 내부에 Google WebView API for Ads / AdSense를 1:1 직접 임베드
 * 3) 콘텐츠 스크롤 시 해당 구좌와 함께 자연스럽게 이동하며 화면 덮임 및 왜곡 0건 보장
 */
export const AdMobBannerSection: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);
  const isPushedRef = useRef(false);

  useEffect(() => {
    // 1. 기존 화면 하단 메뉴 위에 남아있던 네이티브 플로팅 배너 즉시 정리
    removeBanner().catch(() => {});

    // 2. DOM 슬롯 안착 후 Google Ads SDK로 320x50 배너 로드
    const renderAd = () => {
      if (!adRef.current || isPushedRef.current) return;
      const adStatus = adRef.current.getAttribute('data-adsbygoogle-status');
      if (adStatus) return;

      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        isPushedRef.current = true;
      } catch (err) {
        console.warn('[AdMob Web Slot] adsbygoogle push notice:', err);
      }
    };

    const timer = setTimeout(renderAd, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white border-b border-gray-100 flex flex-col items-center py-2 px-4 my-1">
      {/* 1. 구좌 헤더 라벨 */}
      <div className="w-[320px] max-w-full flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.5 rounded leading-none shadow-2xs">
            AD
          </span>
          <span className="text-[12px] font-bold text-gray-800 tracking-tight">
            신상픽 추천 스폰서드
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          맞춤 제휴 혜택
        </span>
      </div>

      {/* 2. 320x50 정밀 규격 광고 구좌 컨테이너 */}
      <div
        style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
        className="rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden shadow-2xs"
      >
        {/* Google AdMob 공식 웹뷰 인라인 배너 태그 */}
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: `${BANNER_WIDTH}px`,
            height: `${BANNER_HEIGHT}px`,
          }}
          data-ad-client="ca-pub-3878859120989916"
          data-ad-slot="9433572199"
          data-ad-format="horizontal"
          data-full-width-responsive="false"
        />

        {/* 광고 로딩 전 / 미노출 시 안정적인 플레이스홀더 (배경 레이어) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 bg-gray-50">
          <div className="flex items-center gap-1.5 text-gray-400 select-none">
            <span className="text-[11px] font-semibold text-gray-400">
              신상픽 추천 스폰서드 배너
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

