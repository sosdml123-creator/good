import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  ADMOB_CLIENT_ID,
  ADMOB_SEARCH_BANNER_UNIT_ID,
  ADMOB_SEARCH_SLOT_ID,
  BANNER_HEIGHT,
  BANNER_WIDTH,
  getSafeAreaTop,
  hideBanner,
  resumeBanner,
  showBannerAt,
  removeBanner,
} from '../../services/admobService';

/**
 * 검색창 내부 공식 AdMob 배너 광고 구좌
 * - 단위 ID: ca-app-pub-3878859120989916/1040251860
 * - 규격: 320x50 표준 모바일 배너
 * - 모바일 네이티브 앱(iOS/Android): 슬롯 정위치에 AdMob 배너를 오버레이 안착
 * - 웹(PC/모바일 웹): AdSense/AdMob 인라인 배너 렌더링
 */
export const SearchAdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const slotRef = useRef<HTMLDivElement>(null);
  const isPlacedRef = useRef<boolean>(false);
  const isWebPushedRef = useRef<boolean>(false);

  useEffect(() => {
    // 1. 네이티브 앱 환경: 슬롯 Y좌표 계산 후 네이티브 배너 안착
    if (isNative) {
      const slot = slotRef.current;
      if (!slot) return;

      const scroller = slot.closest('main') as HTMLElement | null;
      let raf = 0;

      const syncBannerPosition = () => {
        raf = 0;
        if (!slotRef.current) return;

        const rect = slotRef.current.getBoundingClientRect();
        const currentScrollTop =
          scroller?.scrollTop ?? (typeof window !== 'undefined' ? window.scrollY : 0);

        // 검색창 상단 슬롯 영역에 있을 때만 배너 노출
        const isNearTop = currentScrollTop <= 100;

        if (isNearTop) {
          const absoluteTop = rect.top + currentScrollTop;
          const safeAreaTop = getSafeAreaTop();

          if (absoluteTop >= 40) {
            if (!isPlacedRef.current) {
              isPlacedRef.current = true;
              showBannerAt(absoluteTop, safeAreaTop, ADMOB_SEARCH_BANNER_UNIT_ID);
            } else {
              resumeBanner();
            }
          }
        } else {
          hideBanner();
        }
      };

      const onScrollOrResize = () => {
        if (!raf) raf = requestAnimationFrame(syncBannerPosition);
      };

      const timers = [
        setTimeout(syncBannerPosition, 80),
        setTimeout(syncBannerPosition, 250),
        setTimeout(syncBannerPosition, 500),
      ];

      scroller?.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize);

      const resizeObserver = new ResizeObserver(() => {
        onScrollOrResize();
      });
      if (slot.parentElement) {
        resizeObserver.observe(slot.parentElement);
      }

      return () => {
        timers.forEach(clearTimeout);
        if (raf) cancelAnimationFrame(raf);
        scroller?.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
        resizeObserver.disconnect();
        removeBanner().catch(() => {});
      };
    }

    // 2. 웹(PC / 브라우저) 환경: adsbygoogle 인라인 로드
    if (!isNative && !isWebPushedRef.current) {
      isWebPushedRef.current = true;
      try {
        if (typeof window !== 'undefined') {
          const ads = ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
            (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []);
          ads.push({});
          console.log('[SearchAdMobBanner] Web ad push succeeded');
        }
      } catch (e) {
        console.warn('[SearchAdMobBanner] Web ad notice:', e);
      }
    }
  }, [isNative]);

  // 모바일 앱 환경: 배너가 위치할 320x50 투명 슬롯 영역 확보
  if (isNative) {
    return (
      <div className="w-full flex flex-col items-center justify-center my-1">
        <div
          ref={slotRef}
          style={{ width: `${BANNER_WIDTH}px`, height: `${BANNER_HEIGHT}px` }}
          className="w-[320px] max-w-full h-[50px] min-h-[50px] bg-transparent flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  }

  // PC 웹 환경: 320x50 정규 배너 컨테이너
  return (
    <div className="w-full flex flex-col items-center justify-center my-1">
      <div className="w-[320px] max-w-full flex items-center justify-between mb-1 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.5 rounded leading-none shadow-2xs">
            AD
          </span>
          <span className="text-[11px] font-bold text-gray-700 tracking-tight">
            스폰서 추천
          </span>
        </div>
      </div>
      <div
        ref={slotRef}
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
