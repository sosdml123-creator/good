import React, { useEffect, useRef, useState } from 'react';
import { HomeSectionConfig } from '../../types';
import { Capacitor } from '@capacitor/core';
import { Sparkles, ArrowUpRight } from 'lucide-react';

interface AdMobBannerSectionProps {
  section?: HomeSectionConfig;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdMobBannerSection: React.FC<AdMobBannerSectionProps> = ({ section }) => {
  const isNative = Capacitor.isNativePlatform();
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef<boolean>(false);
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'placeholder'>('loading');

  useEffect(() => {
    // 네이티브(iOS/Android)에서는 AdMob SDK가 처리하거나 네이티브 배너가 연동됨
    if (isNative) {
      setAdStatus('placeholder');
      return;
    }

    // 1. Google AdSense / AdMob 웹 SDK 스크립트 로드
    if (typeof window !== 'undefined' && !document.getElementById('google-adsense-sdk')) {
      const script = document.createElement('script');
      script.id = 'google-adsense-sdk';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916`;
      document.head.appendChild(script);
    }

    // 2. 광고 요청 푸시
    const timer = setTimeout(() => {
      try {
        if (adRef.current && !pushedRef.current) {
          const currentStatus = adRef.current.getAttribute('data-adsbygoogle-status');
          if (!currentStatus) {
            pushedRef.current = true;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        console.warn('[AdMobBannerSection] adsbygoogle push notice:', e);
      }
    }, 300);

    // 3. 광고 슬롯 채움(Fill) 상태 감지
    // 중요: unfilled 상태가 되더라도 컴포넌트를 절대 화면에서 삭제(return null)하지 않고
    // 세련된 스폰서드 플레이스홀더를 유지하여 화면 깜빡임과 덜컥거림(CLS)을 완벽 방지합니다.
    let observer: MutationObserver | null = null;
    if (adRef.current && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(() => {
        if (!adRef.current) return;
        const status = adRef.current.getAttribute('data-ad-status');
        if (status === 'filled') {
          setAdStatus('filled');
        } else if (status === 'unfilled') {
          setAdStatus('placeholder');
        }
      });

      observer.observe(adRef.current, {
        attributes: true,
        attributeFilter: ['data-ad-status', 'data-adsbygoogle-status'],
      });
    }

    // 일정 시간(2.5초) 후에도 filled가 아니면 안정적인 플레이스홀더로 전환
    const fallbackTimer = setTimeout(() => {
      if (adStatus === 'loading') {
        setAdStatus('placeholder');
      }
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      if (observer) observer.disconnect();
    };
  }, [isNative, adStatus]);

  return (
    <div 
      key="ad_banner" 
      className="bg-white py-2 px-4 border-b border-gray-100 transition-all duration-300"
    >
      {/* AdMob 정책 준수: 명확한 광고/스폰서 라벨 표기 */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80">
            {section?.badgeText || 'AD'}
          </span>
          <span className="text-[11px] text-gray-500 font-bold">
            {section?.title || '스폰서드 맞춤 혜택'}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {section?.subtitle || '광고'}
        </span>
      </div>

      {/* 광고 메인 영역: 절대 사라지지 않고 항상 일정한 높이를 유지하여 레이아웃 시프트 방지 */}
      <div 
        className="w-full relative min-h-[58px] sm:min-h-[64px] rounded-xl overflow-hidden bg-gradient-to-r from-amber-50/50 via-orange-50/30 to-amber-50/40 border border-amber-100/70 flex items-center justify-center p-2 shadow-2xs"
      >
        {/* 1. 실제 Google 광고 슬롯 (채워졌을 때 표시) */}
        <div 
          className={`w-full flex items-center justify-center ${
            adStatus === 'filled' ? 'block' : 'hidden'
          }`}
        >
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'center',
              margin: '0 auto',
              minHeight: '50px',
            }}
            data-ad-client="ca-pub-3878859120989916"
            data-ad-slot="9433572199"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {/* 2. 광고 로딩 중 또는 대기 중일 때 보여주는 안정적인 스폰서드 카드 (사라짐 버그 완벽 해결) */}
        {adStatus !== 'filled' && (
          <div className="w-full flex items-center justify-between px-2 gap-2 text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="text-[12px] font-black text-gray-900 truncate flex items-center gap-1">
                  <span>신상픽 회원 전용 특별 제휴 혜택</span>
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  이달의 편의점·마트 신상품 할인 & 체험단 이벤트 모아보기
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center text-[10px] font-bold text-amber-700 bg-white px-2 py-1 rounded-md border border-amber-200 shadow-2xs">
              <span>둘러보기</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
