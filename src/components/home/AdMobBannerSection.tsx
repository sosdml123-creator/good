import React, { useEffect, useRef } from 'react';
import {
  ADMOB_BANNER_UNIT_ID,
  ADMOB_CLIENT_ID,
  ADMOB_HOME_SLOT_ID,
  BANNER_HEIGHT,
  BANNER_WIDTH,
  removeBanner,
  supportsInlineBanner,
  trackInlineBanner,
} from '../../services/admobService';

/**
 * 공식 AdMob 고정형 인라인 광고 구좌 (홈: 카테고리·신제품 구좌 사이 / 상품 상세: 가격 아래 / 리뷰 작성: 상품 선택 아래)
 * - 화면 플로팅/오버레이 없이 본문 스크롤에 맞춰 자연스럽게 함께 움직이는 일반 인라인 구좌
 * - iOS·안드로이드 앱: 네이티브 AdMob 배너를 이 구좌 위치에 붙여 함께 스크롤 (웹뷰 안에서는 AdSense가 송출되지 않음)
 * - slot: 구좌 식별 키. 화면마다 다르게 줘서 같은 화면의 네이티브 배너끼리 덮어쓰지 않게 함 (기본값 'home')
 */
export const AdMobBannerSection: React.FC<{ slot?: string }> = ({ slot = 'home' }) => {
  const useInlineBanner = supportsInlineBanner();
  const adSlotRef = useRef<HTMLDivElement>(null);
  const isPushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (useInlineBanner) {
      if (!adSlotRef.current) return;
      return trackInlineBanner(slot, ADMOB_BANNER_UNIT_ID, adSlotRef.current);
    }

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
          console.log('[Home AdMob Banner] In-line banner push succeeded');
        }
      } catch (e) {
        console.warn('[Home AdMob Banner] In-line banner push notice:', e);
      }
    }
  }, [useInlineBanner, slot]);

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white py-2 border-b border-gray-100">
      {/* 320x50 정밀 규격 인라인 광고 컨테이너 (스크롤 시 함께 자연스럽게 이동하는 일반 구좌) */}
      <div
        ref={adSlotRef}
        style={{ width: `${BANNER_WIDTH}px`, height: `${BANNER_HEIGHT}px` }}
        className="w-[320px] max-w-full h-[50px] min-h-[50px] rounded-xl bg-gray-50/80 border border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative shadow-2xs"
      >
        {!useInlineBanner && (
          <ins
            className="adsbygoogle"
            style={{
              display: 'inline-block',
              width: `${BANNER_WIDTH}px`,
              height: `${BANNER_HEIGHT}px`,
            }}
            data-ad-client={ADMOB_CLIENT_ID}
            data-ad-slot={ADMOB_HOME_SLOT_ID}
          />
        )}
      </div>
    </div>
  );
};
