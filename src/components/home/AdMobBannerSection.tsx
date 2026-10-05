import React, { useEffect, useRef } from 'react';
import {
  ADMOB_CLIENT_ID,
  ADMOB_SLOT_ID,
  BANNER_HEIGHT,
  BANNER_WIDTH,
  removeBanner,
} from '../../services/admobService';

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 광고 구좌
 *
 * - PC와 앱 모두 동일하게 해당 구좌(빈 공간) 내부에 직접 AdMob 광고를 삽입하여 고정
 * - 네이티브 플로팅 오버레이를 제거하고 DOM 인라인 구좌에 1:1로 안착
 */
export const AdMobBannerSection: React.FC = () => {
  const adSlotRef = useRef<HTMLDivElement>(null);
  const isPushedRef = useRef<boolean>(false);

  useEffect(() => {
    // 혹시 떠 있을 수 있는 네이티브 플로팅 오버레이는 확실하게 정리
    removeBanner().catch(() => {});

    // DOM 내부에 AdMob / AdSense 광고 로드
    if (!isPushedRef.current) {
      isPushedRef.current = true;
      try {
        if (typeof window !== 'undefined') {
          const ads = ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
            (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []);
          ads.push({});
          console.log('[AdMob Banner] In-line banner push succeeded');
        }
      } catch (e) {
        console.warn('[AdMob Banner] In-line banner push notice:', e);
      }
    }
  }, []);

  return (
    <div className="w-full bg-white border-b border-gray-100 flex flex-col items-center py-2.5 px-4 my-1">
      {/* 1. 구좌 헤더 라벨 */}
      <div className="w-[320px] max-w-full flex items-center justify-between mb-1.5 px-1">
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

      {/* 2. 320x50 정밀 규격 인라인 광고 컨테이너 (PC 및 앱 동일하게 직접 삽입) */}
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
          data-ad-slot={ADMOB_SLOT_ID}
        />
      </div>
    </div>
  );
};




