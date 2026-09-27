import React, { useEffect } from 'react';
import { HomeSectionConfig } from '../../types';
import { ADMOB_CONFIG, initAdMob } from '../../services/admobService';
import { Megaphone, ExternalLink, Sparkles } from 'lucide-react';
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
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div key="ad_banner" className="bg-white py-3.5 px-4 border-b border-gray-100 transition-all duration-300">
      {/* 구좌 헤더 (Google AdMob 정책 준수: 명확한 광고 고지) */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-300/80">
            <Megaphone className="w-3 h-3 text-amber-600" />
            {section?.badgeText || 'AD 스폰서'}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            {section?.subtitle || '신상픽 추천 맞춤 혜택'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200/60">
            광고
          </span>
          <span className="text-[9px] font-medium text-gray-400">
            AdMob
          </span>
        </div>
      </div>

      {/* 네이티브 광고 카드 UI (AdMob Unit ID: ca-app-pub-3878859120989916/3915377976) */}
      <div 
        id="admob-native-container"
        data-admob-app-id={ADMOB_CONFIG.appId}
        data-ad-unit={ADMOB_CONFIG.nativeAdUnitId}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 p-3.5 border border-amber-200/70 shadow-2xs hover:shadow-xs transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          {/* 광고 아이콘 / 이미지 썸네일 */}
          <div className="relative shrink-0 w-13 h-13 rounded-xl bg-white shadow-2xs border border-amber-200 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div className="absolute top-0 right-0 bg-amber-600 text-white text-[7px] font-black px-1 rounded-bl">
              AD
            </div>
          </div>

          {/* 광고 콘텐츠 문구 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200/60">
                추천 신상
              </span>
              <h4 className="text-[13px] font-bold text-gray-900 truncate">
                {section?.title || '주목받는 인기 신메뉴 & 특별 프로모션'}
              </h4>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 line-clamp-1 leading-tight">
              실시간 신제품 입고 정보와 편의점·마트 전용 할인 혜택을 확인해보세요.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="shrink-0">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs hover:bg-amber-600 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

