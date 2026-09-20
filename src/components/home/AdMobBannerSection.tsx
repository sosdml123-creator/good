import React, { useEffect } from 'react';
import { HomeSectionConfig } from '../../types';
import { ADMOB_CONFIG, initAdMob } from '../../services/admobService';
import { Megaphone, ChevronRight } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface AdMobBannerSectionProps {
  section?: HomeSectionConfig;
}

export const AdMobBannerSection: React.FC<AdMobBannerSectionProps> = ({ section }) => {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Non-blocking initialization in background after first paint
      const timer = setTimeout(() => {
        initAdMob().catch((err) => {
          console.warn('[AdMobBannerSection] Non-critical init notice:', err);
        });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div key="ad_banner" className="bg-white py-3.5 px-4 border-b border-gray-100 transition-all duration-300">
      {/* 구좌 헤더 */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-200">
            <Megaphone className="w-3 h-3 text-amber-500" />
            {section?.badgeText || 'AD 스폰서'}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            {section?.subtitle || '신상픽 추천 맞춤 혜택'}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100/80 px-1.5 py-0.5 rounded text-center">
          Google AdMob
        </span>
      </div>

      {/* 네이티브 광고 카드 UI (AdMob Unit ID: ca-app-pub-3878859120989916/3915377976) */}
      <div 
        id="admob-native-container"
        data-ad-unit={ADMOB_CONFIG.nativeAdUnitId}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 p-3.5 border border-amber-200/60 shadow-xs hover:shadow-sm transition-all"
      >
        <div className="flex items-center gap-3.5">
          {/* 광고 아이콘 / 이미지 썸네일 */}
          <div className="relative shrink-0 w-14 h-14 rounded-xl bg-white shadow-2xs border border-amber-100 flex items-center justify-center overflow-hidden">
            <img 
              src="/brands/스타벅스.png" 
              alt="스폰서" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                // fallback 아이콘
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-bl">
              AD
            </div>
          </div>

          {/* 광고 콘텐츠 문구 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-amber-600 bg-amber-100/70 px-1.5 py-0.2 rounded">
                신상 추천
              </span>
              <h4 className="text-[13px] font-bold text-gray-900 truncate">
                지금 주목받는 인기 신메뉴 & 특별 프로모션
              </h4>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 leading-tight">
              가장 빠른 실시간 신상 소식과 편의점·카페 할인 혜택을 만나보세요!
            </p>
          </div>

          {/* 확인 버튼 */}
          <div className="shrink-0">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs hover:bg-amber-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
