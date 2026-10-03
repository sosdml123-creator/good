import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { BANNER_HEIGHT, hideBanner, showBannerAt } from '../../services/admobService';

/**
 * 카테고리 메뉴 바로 아래 AdMob 배너 (iOS/Android 네이티브 전용)
 *
 * 네이티브 AdMob 배너는 웹뷰 위에 떠 있는 네이티브 뷰라 스크롤을 따라오지 않습니다.
 * 그래서 웹뷰에는 배너와 같은 크기(320x50)의 자리(placeholder)를 확보하고,
 * 그 자리가 처음 위치에 있을 때(스크롤 최상단)만 배너를 정확히 그 위에 표시합니다.
 * 스크롤하면 배너를 숨겨 콘텐츠를 가리지 않습니다(AdMob 정책 준수).
 */
export const AdMobBannerSection: React.FC = () => {
  const isNative = Capacitor.isNativePlatform();
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNative || !slotRef.current) return;

    const slot = slotRef.current;
    const scroller = slot.closest('main') as HTMLElement | null;
    let anchorTop: number | null = null;
    let raf = 0;

    const update = () => {
      raf = 0;
      const top = slot.getBoundingClientRect().top;
      const atRest = !scroller || scroller.scrollTop <= 2;

      if (atRest) {
        anchorTop = top;
        showBannerAt(top);
      } else if (anchorTop !== null && Math.abs(top - anchorTop) <= 1) {
        showBannerAt(top);
      } else {
        hideBanner();
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // 레이아웃(배너 이미지 등) 안정화 후 최초 표시
    const t = setTimeout(update, 400);
    scroller?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
      scroller?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      hideBanner(); // 홈을 벗어나면 숨김
    };
  }, [isNative]);

  // 웹에서는 AdMob(앱 전용 SDK)이 동작하지 않으므로 표시하지 않음
  if (!isNative) return null;

  return (
    <div className="bg-white border-b border-gray-100 flex justify-center py-2">
      <div ref={slotRef} style={{ width: 320, height: BANNER_HEIGHT }} />
    </div>
  );
};
