import React, { useState, useEffect } from 'react';
import { HomeSectionConfig, ProductCategory } from '../../types';
import { ADMOB_CONFIG, initAdMob } from '../../services/admobService';
import { Megaphone, ChevronRight, Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useApp } from '../../context/AppContext';

interface AdMobBannerSectionProps {
  section?: HomeSectionConfig;
}

interface SponsoredAdItem {
  id: string;
  advertiser: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  cta: string;
  ctaBg: string;
  image: string;
  fallbackEmoji: string;
  targetCategory?: ProductCategory;
}

// 실제 식음료 신상 & 편의점 제휴 맞춤형 스폰서드 광고 데이터셋
const SPONSORED_ADS: SponsoredAdItem[] = [
  {
    id: 'ad_1',
    advertiser: '스타벅스 코리아',
    badge: '시즌 한정',
    badgeColor: 'bg-emerald-500 text-white',
    title: '봄 시즌 신메뉴 & MD 특별 프로모션',
    description: '달콤한 스프링 블렌드와 벚꽃 테마 신메뉴를 지금 바로 만나보세요!',
    cta: '메뉴 보기',
    ctaBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=160&auto=format&fit=crop&q=80',
    fallbackEmoji: '☕',
    targetCategory: '음료',
  },
  {
    id: 'ad_2',
    advertiser: 'GS25 & CU 편의점 신상',
    badge: '1+1 특가',
    badgeColor: 'bg-rose-500 text-white',
    title: '이달의 편의점 단독 입고 신상 1+1 혜택',
    description: '화제의 신상 간식과 디저트, 전국 매장 입고 현황을 실시간 확인하세요.',
    cta: '혜택 확인',
    ctaBg: 'bg-rose-500 hover:bg-rose-600 text-white',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=160&auto=format&fit=crop&q=80',
    fallbackEmoji: '🍰',
    targetCategory: '빵·디저트',
  },
  {
    id: 'ad_3',
    advertiser: '오리온 신제품 연구소',
    badge: 'NEW 출시',
    badgeColor: 'bg-amber-500 text-white',
    title: '바삭함이 2배! 신상 스낵 컬렉션 런칭',
    description: '출시 직후 품절 대란! 솔직한 시식 평가단 리뷰를 확인해보세요.',
    cta: '리뷰 보기',
    ctaBg: 'bg-amber-500 hover:bg-amber-600 text-white',
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=160&auto=format&fit=crop&q=80',
    fallbackEmoji: '🍪',
    targetCategory: '과자',
  },
];

export const AdMobBannerSection: React.FC<AdMobBannerSectionProps> = ({ section }) => {
  const { setActiveTab, setSelectedCategory } = useApp();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // Background initialization of AdMob on native devices
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const timer = setTimeout(() => {
        initAdMob().catch((err) => {
          console.warn('[AdMobBannerSection] Init notice:', err);
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto rotate sponsored cards every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % SPONSORED_ADS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentAd = SPONSORED_ADS[currentAdIndex];

  const handleAdClick = (ad: SponsoredAdItem) => {
    if (ad.targetCategory) {
      setSelectedCategory(ad.targetCategory);
      setActiveTab('category');
    }
  };

  return (
    <div key="ad_banner" className="bg-white py-3.5 px-4 border-b border-gray-100 transition-all duration-300">
      {/* 구좌 헤더 (Google AdMob 가이드라인 준수: 명확한 광고/스폰서 고지) */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-300">
            <Megaphone className="w-3 h-3 text-amber-600 animate-pulse" />
            {section?.badgeText || '스폰서드'}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            {section?.subtitle || '신상픽 맞춤 추천'}
          </span>
        </div>

        {/* 광고 라벨 및 정보 버튼 */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-gray-600 bg-gray-100/90 px-1.5 py-0.5 rounded border border-gray-200/80 transition-colors"
            title="광고 정보"
          >
            <span>AD</span>
            <Info className="w-2.5 h-2.5" />
          </button>
          <span className="text-[9px] font-bold text-gray-400">
            AdMob
          </span>
        </div>
      </div>

      {/* 광고 안내 팝업 (선택 토글) */}
      {showInfo && (
        <div className="mb-2.5 p-2 rounded-xl bg-gray-50 border border-gray-200 text-[10px] text-gray-500 flex items-center justify-between animate-fadeIn">
          <span>이 영역은 Google AdMob 및 신상픽 공식 제휴 스폰서 광고 구좌입니다.</span>
          <button 
            onClick={() => setShowInfo(false)}
            className="text-[10px] font-bold text-gray-600 underline ml-2 shrink-0"
          >
            닫기
          </button>
        </div>
      )}

      {/* 네이티브 광고 카드 컨테이너 (AdMob Unit ID: ca-app-pub-3878859120989916/3915377976) */}
      <div
        id="admob-native-container"
        data-admob-app-id={ADMOB_CONFIG.appId}
        data-ad-unit={ADMOB_CONFIG.nativeAdUnitId}
        onClick={() => handleAdClick(currentAd)}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 p-3.5 border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          {/* 광고 이미지 썸네일 & 뱃지 */}
          <div className="relative shrink-0 w-15 h-15 rounded-xl bg-white shadow-2xs border border-amber-200 flex items-center justify-center overflow-hidden">
            <img
              src={currentAd.image}
              alt={currentAd.advertiser}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // 이미지 로드 실패 시 이모지 대체
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute top-0 right-0 bg-amber-600 text-white text-[7px] font-black px-1 py-0.2 rounded-bl">
              AD
            </div>
          </div>

          {/* 광고 텍스트 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${currentAd.badgeColor}`}>
                {currentAd.badge}
              </span>
              <span className="text-[11px] font-bold text-gray-500 truncate">
                {currentAd.advertiser}
              </span>
            </div>
            <h4 className="text-[13px] font-extrabold text-gray-900 truncate leading-snug">
              {currentAd.title}
            </h4>
            <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5 leading-tight">
              {currentAd.description}
            </p>
          </div>

          {/* CTA 액션 버튼 */}
          <div className="shrink-0 flex flex-col items-center justify-center">
            <div className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all ${currentAd.ctaBg}`}>
              <span>{currentAd.cta}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 하단 인디케이터 닷 (여러 광고 카드 전환 안내) */}
        <div className="flex items-center justify-center gap-1 mt-2.5 pt-1 border-t border-amber-200/40">
          {SPONSORED_ADS.map((ad, idx) => (
            <button
              key={ad.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentAdIndex(idx);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentAdIndex ? 'w-5 bg-amber-500' : 'w-1.5 bg-amber-200'
              }`}
              aria-label={`광고 ${idx + 1} 보기`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
