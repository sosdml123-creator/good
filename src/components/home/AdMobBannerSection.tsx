import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { BANNER_HEIGHT, BANNER_WIDTH, hideBanner, resumeBanner, showBannerAt } from '../../services/admobService';

/**
 * iOS 노치 / 다이내믹 아일랜드 Safe Area Inset Top 측정 (pt 단위)
 */
const getSafeAreaTop = (): number => {
  try {
    const testEl = document.createElement('div');
    testEl.style.paddingTop = 'env(safe-area-inset-top, 0px)';
    testEl.style.position = 'fixed';
    testEl.style.top = '0';
    testEl.style.left = '0';
    testEl.style.visibility = 'hidden';
    testEl.style.pointerEvents = 'none';
    document.body.appendChild(testEl);
    const sat = parseFloat(window.getComputedStyle(testEl).paddingTop) || 0;
    document.body.removeChild(testEl);
    return sat > 0 ? sat : (Capacitor.getPlatform() === 'ios' ? 47 : 0);
  } catch {
    return Capacitor.getPlatform() === 'ios' ? 47 : 0;
  }
};

/**
 * 카테고리 메뉴 바로 아래 AdMob 배너 (iOS / Android 네이티브 AdMob SDK 연동)
 *
 * - 광고 단위 ID: ca-app-pub-3878859120989916/9433572199
 * - 크기: 표준 320x50 배너 (BANNER_WIDTH x BANNER_HEIGHT)
 * - 동작:
 *   1) 카테고리 바로 아래 슬롯 위치(pt)를 정밀 계산하여 네이티브 AdMob 배너를 정확한 좌표에 표시.
 *   2) 사용자가 카테고리 영역을 보고 있을 때 안정적으로 노출.
 *   3) 스크롤을 내려 카테고리 영역이 화면 상단으로 벗어나면 배너를 일시 숨김(AdMob 콘텐츠 오버랩 정책 준수).
 *   4) 다시 상단으로 스크롤하면 부드럽게 재개(resume).
 */
export const AdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const slotRef = useRef<HTMLDivElement>(null);
  const bannerCreatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isNative || !slotRef.current) return;

    const slot = slotRef.current;
    const scroller = slot.closest('main') as HTMLElement | null;
    let raf = 0;

    const updateVisibility = () => {
      raf = 0;
      if (!slotRef.current) return;

      const rect = slotRef.current.getBoundingClientRect();
      // 상단 헤더 아래(대략 50px)부터 화면 하단 사이에 카테고리 배너 슬롯이 보이는지 확인
      const isVisible = rect.bottom > 50 && rect.top < window.innerHeight - 50;

      if (isVisible) {
        if (!bannerCreatedRef.current) {
          bannerCreatedRef.current = true;
          const sat = getSafeAreaTop();
          showBannerAt(rect.top, sat);
        } else {
          resumeBanner();
        }
      } else {
        // 카테고리 영역이 화면을 벗어나면 배너를 숨겨 아래 콘텐츠를 가리지 않음
        hideBanner();
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateVisibility);
    };

    // 상단 이미지/배너 렌더링 완료 후 안정적인 좌표에 최초 표시
    const timer = setTimeout(updateVisibility, 350);
    scroller?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      scroller?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      hideBanner(); // 다른 탭 이동 시 배너 숨김
    };
  }, [isNative]);

  return (
    <div className="bg-white border-b border-gray-100 flex justify-center py-2.5 px-4">
      {/* 320x50 배너 크기에 정확히 맞춘 컨테이너 */}
      <div
        ref={slotRef}
        style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
        className="rounded-xl bg-gray-50/80 border border-dashed border-gray-200/90 flex items-center justify-center relative overflow-hidden shadow-2xs"
      >
        <div className="flex items-center gap-1.5 text-gray-400 select-none pointer-events-none">
          <span className="text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.5 rounded leading-none">
            AD
          </span>
          <span className="text-[11px] font-semibold text-gray-500">
            신상픽 추천 스폰서드
          </span>
        </div>
      </div>
    </div>
  );
};
