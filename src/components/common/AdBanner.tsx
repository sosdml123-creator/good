import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdBannerProps {
  className?: string;
  adSlot?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className = '',
  adSlot = '1040251860',
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const { setActiveTab } = useApp();

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('[AdBanner] Google Ads initialization notice:', e);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden rounded-2xl ${className}`}>
      {/* 1. Google AdSense / AdMob Web Ad Container */}
      <div ref={adRef} className="w-full relative">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3878859120989916"
          data-ad-slot={adSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />

        {/* 2. Seamless Responsive Sponsored Banner (광고 규격에 딱 맞는 모던 디자인) */}
        <div
          onClick={() => {
            // 클릭 시 랭킹/신제품 할인 소식으로 부드럽게 이동
            setActiveTab('calendar');
          }}
          className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white px-3.5 py-3 rounded-2xl shadow-xs flex items-center justify-between relative overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
        >
          {/* Subtle Glow Background Effect */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
          
          <div className="flex items-center gap-2.5 z-10 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/25 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] bg-white/25 backdrop-blur-md text-white font-black px-1.5 py-0.2 rounded border border-white/30 tracking-tight">
                  AD
                </span>
                <span className="text-[10px] text-purple-200 font-semibold truncate">
                  신상픽 공식 스폰서
                </span>
              </div>
              <p className="text-xs font-bold text-white tracking-tight truncate">
                지금 가장 핫한 신제품 단독 특가 & 혜택
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2 z-10">
            <span className="text-[11px] font-bold text-white bg-white/20 px-2.5 py-1.2 rounded-xl border border-white/25 hover:bg-white/30 transition-colors flex items-center gap-0.5 shadow-2xs">
              보기 <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
