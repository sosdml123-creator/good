import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  ADMOB_CLIENT_ID,
  ADMOB_BANNER_UNIT_ID,
  ADMOB_HOME_SLOT_ID,
  BANNER_HEIGHT,
  BANNER_WIDTH,
  getSafeAreaTop,
  hideBanner,
  removeBanner,
  showBannerAt,
} from '../../services/admobService';

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 광고 구좌
 *
 * 1) PC(웹): 애드몹 광고가 없으므로 어떠한 텍스트나 공간도 남기지 않는 완전한 빈칸(null) 반환
 * 2) 앱(iOS/Android): "신상픽 추천 스폰서드" 텍스트 없이 실제 애드몹 배너(320x50)가 카테고리 아래 정위치에 안정적으로 노출
 */
export const AdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const slotRef = useRef<HTMLDivElement>(null);
  const isWebPushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isNative) {
      if (isWebPushedRef.current) return;
      isWebPushedRef.current = true;

      try {
        if (typeof window !== 'undefined') {
          const ads = ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
            (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []);
          ads.push({});
        }
      } catch (e) {
        console.warn('[HomeAdMobBanner] Web ad notice:', e);
      }

      return;
    }

    const slot = slotRef.current;
    const scroller = slot?.closest('main') as HTMLElement | null;
    let raf = 0;

    const syncBannerPosition = () => {
      raf = 0;
      if (!slotRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const bottomNavReserve = 84;
      const isSlotVisible =
        rect.bottom > 0 &&
        rect.top < viewportHeight - bottomNavReserve &&
        rect.width > 0 &&
        rect.height > 0;

      if (isSlotVisible) {
        const safeAreaTop = getSafeAreaTop();
        showBannerAt(rect.top, safeAreaTop, ADMOB_BANNER_UNIT_ID);
      } else {
        hideBanner();
      }
    };

    const handleScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(syncBannerPosition);
    };

    syncBannerPosition();
    const timers = [
      setTimeout(syncBannerPosition, 80),
      setTimeout(syncBannerPosition, 250),
      setTimeout(syncBannerPosition, 500),
      setTimeout(syncBannerPosition, 1000),
    ];

    scroller?.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    const resizeObserver = new ResizeObserver(() => {
      handleScrollOrResize();
    });
    if (slot?.parentElement) {
      resizeObserver.observe(slot.parentElement);
    }

    return () => {
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
      scroller?.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      resizeObserver.disconnect();
      removeBanner().catch(() => {});
    };
  }, [isNative]);

  return (
    <div className="w-full flex flex-col items-center justify-center bg-white py-2 border-b border-gray-100">
      <div
        ref={slotRef}
        style={{ width: `${BANNER_WIDTH}px`, height: `${BANNER_HEIGHT}px` }}
        className="w-[320px] max-w-full h-[50px] min-h-[50px] bg-white flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        {!isNative && (
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





