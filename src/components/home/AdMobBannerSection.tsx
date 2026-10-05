import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  hideBanner,
  resumeBanner,
  showBannerAt,
  getSafeAreaTop,
} from '../../services/admobService';

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 배너 광고 구좌 (320x50 표준 규격)
 *
 * - Google AdMob 공식 앱 ID: ca-app-pub-3878859120989916~2898554632
 * - 배너 광고 단위 ID: ca-app-pub-3878859120989916/9433572199
 *
 * [원칙]
 * 1) PC(웹 브라우저): 불필요한 더미/텍스트 없이 깔끔한 빈 공간으로 유지.
 * 2) 모바일 앱(iOS/Android): AdMob 공식 SDK를 통해 320x50 표준 배너를 슬롯 위치에 1:1로 안착하여 노출.
 */
export const AdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const slotRef = useRef<HTMLDivElement>(null);
  const lastPlacedTopRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isNative || !slotRef.current) return;

    const slot = slotRef.current;
    const scroller = slot.closest('main') as HTMLElement | null;
    let raf = 0;

    const updateBannerPosition = () => {
      raf = 0;
      if (!slotRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      const currentScrollTop = scroller?.scrollTop ?? (typeof window !== 'undefined' ? window.scrollY : 0);
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

      // 스크롤 최상단(0) 기준 슬롯의 절대 상단 y좌표
      const absoluteTop = rect.top + currentScrollTop;

      // 슬롯이 뷰포트 내(화면 상단 -60px ~ 화면 하단 +60px)에 존재하는지 판별
      const isInViewport = rect.bottom >= -60 && rect.top <= windowHeight + 60;

      if (isInViewport) {
        const safeAreaTop = getSafeAreaTop();
        const hasPlaced = lastPlacedTopRef.current !== null;
        const positionShifted = hasPlaced && Math.abs((lastPlacedTopRef.current || 0) - absoluteTop) > 8;

        if (!hasPlaced || positionShifted) {
          lastPlacedTopRef.current = absoluteTop;
          showBannerAt(absoluteTop, safeAreaTop);
        } else {
          resumeBanner();
        }
      } else {
        // 슬롯이 뷰포트를 완전히 벗어난 경우 하단 탭바/다른 뷰 가림 방지를 위해 숨김
        hideBanner();
      }
    };

    const onScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(updateBannerPosition);
    };

    // 상단 메인 배너 및 컴포넌트 렌더링 타이밍 대응 다단계 위치 정밀 보정
    const timers = [
      setTimeout(updateBannerPosition, 80),
      setTimeout(updateBannerPosition, 250),
      setTimeout(updateBannerPosition, 600),
      setTimeout(updateBannerPosition, 1200),
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
      hideBanner();
    };
  }, [isNative]);

  // 1. PC 및 웹 환경: 더미 UI 없이 깔끔한 빈 공간으로 유지
  if (!isNative) {
    return <div className="w-full h-1" aria-hidden="true" />;
  }

  // 2. 모바일 앱 환경: AdMob 배너가 안착할 수 있는 320x50 투명 슬롯 영역 확보
  return (
    <div className="w-full flex flex-col items-center justify-center my-1">
      <div
        ref={slotRef}
        style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
        className="w-[320px] max-w-full h-[50px] bg-transparent flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};

