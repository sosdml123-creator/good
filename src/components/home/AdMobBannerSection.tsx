import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  ADMOB_BANNER_UNIT_ID,
  BANNER_HEIGHT,
  BANNER_WIDTH,
  getSafeAreaTop,
  hideBanner,
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

  useEffect(() => {
    if (!isNative) return;

    const slot = slotRef.current;
    const scroller = slot?.closest('main') as HTMLElement | null;
    let raf = 0;

    const measureAndDisplayBanner = () => {
      raf = 0;
      const currentScrollTop = scroller?.scrollTop ?? (typeof window !== 'undefined' ? window.scrollY : 0);

      // 상단 홈 카테고리 영역(스크롤 80px 이내)에 있을 때 배너 노출
      if (currentScrollTop <= 80) {
        let absoluteTop = 520; // 표준 기본값 fallback (헤더 56 + 배너 265 + 퀵메뉴 76 + 카테고리 124)
        if (slotRef.current) {
          const rect = slotRef.current.getBoundingClientRect();
          const measuredTop = rect.top + currentScrollTop;
          if (measuredTop > 250) {
            absoluteTop = measuredTop;
          }
        }
        const safeAreaTop = getSafeAreaTop();
        showBannerAt(absoluteTop, safeAreaTop, ADMOB_BANNER_UNIT_ID);
      } else {
        // 스크롤을 내려 신제품 목록을 탐색할 때는 본문 가림 방지를 위해 숨김
        hideBanner();
      }
    };

    const handleScrollOrResize = () => {
      if (!raf) raf = requestAnimationFrame(measureAndDisplayBanner);
    };

    // 마운트 즉시 및 뷰 렌더링 완료 타이밍별 순차 호출로 100% 광고 로드 보장
    measureAndDisplayBanner();
    const timers = [
      setTimeout(measureAndDisplayBanner, 150),
      setTimeout(measureAndDisplayBanner, 400),
      setTimeout(measureAndDisplayBanner, 800),
      setTimeout(measureAndDisplayBanner, 1500),
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
      hideBanner();
    };
  }, [isNative]);

  // 1. PC 웹 환경: 어떠한 텍스트나 공간도 남기지 않는 완전한 빈칸
  if (!isNative) {
    return null;
  }

  // 2. 모바일 앱 환경: "신상픽 추천 스폰서드" 텍스트 없이 320x50 투명 슬롯 영역 확보
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






