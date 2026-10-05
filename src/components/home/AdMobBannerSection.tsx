import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  getSafeAreaTop,
  hideBanner,
  resumeBanner,
  showBannerAtSlot,
} from '../../services/admobService';

/**
 * 카테고리 구좌와 신제품 구좌 사이 공식 AdMob 배너 광고 구좌
 *
 * 1) PC(웹 브라우저): 불필요한 더미/텍스트 없이 깔끔한 빈 공간으로 유지.
 * 2) 모바일 앱(iOS/Android): AdMob 공식 네이티브 배너를 카테고리 아래 슬롯 위치에 1:1로 정확히 안착.
 *    신제품 목록으로 스크롤 시 숨김 처리하여 본문을 가리지 않고, 상단 복귀 시 원래 자리에 재노출.
 */
export const AdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const slotRef = useRef<HTMLDivElement>(null);
  const isPlacedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isNative || !slotRef.current) return;

    const slot = slotRef.current;
    const scroller = slot.closest('main') as HTMLElement | null;
    let raf = 0;

    const syncBanner = () => {
      raf = 0;
      if (!slotRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      const currentScrollTop = scroller?.scrollTop ?? (typeof window !== 'undefined' ? window.scrollY : 0);

      // 상단 홈 카테고리 영역(스크롤 0~60px 이내)에 있을 때만 슬롯 위치에 배너 노출
      const isNearTop = currentScrollTop <= 60;

      if (isNearTop) {
        // 스크롤 최상단 기준 슬롯 Y좌표 계산
        const absoluteTop = rect.top + currentScrollTop;
        const safeAreaTop = getSafeAreaTop();

        // 메인 배너와 카테고리가 렌더링된 정상 높이(300px 이상)일 때 배치
        if (absoluteTop >= 300) {
          if (!isPlacedRef.current) {
            isPlacedRef.current = true;
            showBannerAtSlot(absoluteTop, safeAreaTop);
          } else {
            resumeBanner();
          }
        }
      } else {
        // 스크롤을 내려 신제품 목록 및 행사 소식을 탐색할 때는 본문 가림 방지를 위해 배너 숨김
        hideBanner();
      }
    };

    const handleScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(syncBanner);
    };

    // 상단 롤링 배너 및 카테고리 이미지 렌더링 시점에 맞춘 순차 위치 측정
    const timers = [
      setTimeout(syncBanner, 100),
      setTimeout(syncBanner, 300),
      setTimeout(syncBanner, 700),
      setTimeout(syncBanner, 1400),
    ];

    scroller?.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);

    const resizeObserver = new ResizeObserver(() => {
      handleScrollOrResize();
    });
    if (slot.parentElement) {
      resizeObserver.observe(slot.parentElement);
    }

    return () => {
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
      scroller?.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      resizeObserver.disconnect();
      hideBanner();
    };
  }, [isNative]);

  // 1. PC 및 웹 환경: 더미 박스나 텍스트 없이 깔끔한 빈 공간으로 유지
  if (!isNative) {
    return <div className="w-full h-1" aria-hidden="true" />;
  }

  // 2. 모바일 앱 환경: 카테고리 아래 ~ 신제품 위에 320x50 규격 슬롯 영역 확보
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
};



