import React, { useEffect, useRef } from 'react';
import {
  ADMOB_CLIENT_ID,
  ADMOB_SEARCH_SLOT_ID,
  BANNER_HEIGHT,
  BANNER_WIDTH,
  removeBanner,
} from '../../services/admobService';

/**
 * 검색창 내부 AdMob 배너 광고 구좌
 * - 단위 ID: ca-app-pub-3878859120989916/1040251860 (슬롯 ID: 1040251860)
 * - 화면 플로팅/오버레이 없이 본문 스크롤에 맞춰 자연스럽게 함께 움직이는 일반 인라인 구좌
 */
export const SearchAdMobBannerSection: React.FC = () => {
  const adSlotRef = useRef<HTMLDivElement>(null);
  const isPushedRef = useRef<boolean>(false);

  useEffect(() => {
    // 화면에 떠 있는 네이티브 플로팅 오버레이 완전 제거 (움직일 때마다 따라다니지 않도록 방지)
    removeBanner().catch(() => {});

    // DOM 내부에 AdMob / AdSense 광고 인라인 로드
    if (!isPushedRef.current) {
      isPushedRef.current = true;
      try {
        if (typeof window !== 'undefined') {
          const ads = ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
            (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []);
          ads.push({});
          console.log('[Search AdMob Banner] In-line banner push succeeded');
        }
      } catch (e) {
        console.warn('[Search AdMob Banner] In-line banner push notice:', e);
      }
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-1">
      {/* 1. 구좌 헤더 라벨 */}
      <div className="w-[320px] max-w-full flex items-center justify-between mb-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.5 rounded leading-none shadow-2xs">
            AD
          </span>
          <span className="text-[12px] font-bold text-gray-800 tracking-tight">
            스폰서 추천
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          신상 맞춤 제휴
        </span>
      </div>

      {/* 2. 320x50 정밀 규격 인라인 광고 컨테이너 (스크롤 시 함께 자연스럽게 이동하는 일반 구좌) */}
      <div
        ref={adSlotRef}
        style={{ width: `${BANNER_WIDTH}px`, height: `${BANNER_HEIGHT}px` }}
        className="w-[320px] max-w-full h-[50px] min-h-[50px] rounded-xl bg-gray-50/80 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative shadow-2xs"
      >
        <ins
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: `${BANNER_WIDTH}px`,
            height: `${BANNER_HEIGHT}px`,
          }}
          data-ad-client={ADMOB_CLIENT_ID}
          data-ad-slot={ADMOB_SEARCH_SLOT_ID}
        />
      </div>
    </div>
  );
};
