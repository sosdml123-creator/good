import React, { useState, useEffect } from 'react';
import { HomeSectionConfig, ProductCategory } from '../../types';
import { ADMOB_CONFIG, initAdMob, removeHomeBannerAd } from '../../services/admobService';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../brand/BrandLogo';
import { Megaphone, Info, ChevronRight } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface AdMobBannerSectionProps {
  section?: HomeSectionConfig;
}

interface SponsoredAdItem {
  id: string;
  brandName: string;
  advertiser: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  cta: string;
  ctaBg: string;
  targetCategory: ProductCategory;
}

const SPONSORED_ADS: SponsoredAdItem[] = [
  {
    id: 'ad-sp-1',
    brandName: '스타벅스',
    advertiser: '스타벅스 코리아',
    title: '봄 시즌 신메뉴 슈크림 라떼 & 신상 음료',
    description: '달콤한 바닐라 풍미와 부드러운 슈크림의 완벽한 조화',
    cta: '메뉴 보기',
    badge: 'NEW 시즌',
    badgeColor: 'bg-amber-100 text-amber-800',
    ctaBg: 'bg-amber-500 hover:bg-amber-600 text-white',
    targetCategory: '음료',
  },
  {
    id: 'ad-sp-2',
    brandName: 'CU',
    advertiser: 'CU 편의점',
    title: '연세우유 밤티라미수 생크림빵 1+1',
    description: 'SNS 화제의 쫀득 달콤 디저트를 지금 가까운 CU에서 만나보세요',
    cta: '행사 확인',
    badge: '1+1 특가',
    badgeColor: 'bg-purple-100 text-purple-800',
    ctaBg: 'bg-purple-600 hover:bg-purple-700 text-white',
    targetCategory: '빵·디저트',
  },
  {
    id: 'ad-sp-3',
    brandName: '농심',
    advertiser: '농심 신라면',
    title: '신라면 똠얌 & 투움바 신제품 출시',
    description: '세계의 맛을 담은 얼큰 매콤 이색 라면 리뷰와 평가 확인하기',
    cta: '신상 리뷰',
    badge: '화제 신상',
    badgeColor: 'bg-red-100 text-red-800',
    ctaBg: 'bg-red-600 hover:bg-red-700 text-white',
    targetCategory: '간편식',
  },
  {
    id: 'ad-sp-4',
    brandName: '배스킨라빈스',
    advertiser: '배스킨라빈스',
    title: '이달의 신상 아이스크림 & 블록팩 출시',
    description: '시원 달콤한 디저트 타임! 실시간 인기 순위와 솔직 리뷰',
    cta: '순위 보기',
    badge: '인기 디저트',
    badgeColor: 'bg-pink-100 text-pink-800',
    ctaBg: 'bg-pink-500 hover:bg-pink-600 text-white',
    targetCategory: '아이스크림',
  },
  {
    id: 'ad-sp-5',
    brandName: '오리온',
    advertiser: '오리온 초코파이',
    title: '초코파이 하우스 프리미엄 한정판',
    description: '더 깊고 진한 카카오와 입안 가득 사르르 녹는 마시멜로',
    cta: '자세히 보기',
    badge: '한정 출시',
    badgeColor: 'bg-amber-100 text-amber-800',
    ctaBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    targetCategory: '과자',
  },
  {
    id: 'ad-sp-6',
    brandName: 'GS25',
    advertiser: 'GS25 편의점',
    title: '혜자로운 집밥 도시락 & 갓생기획 신상',
    description: '가성비 최강 든든한 편의점 신상 도시락과 간편식 혜택',
    cta: '신상 보기',
    badge: '가성비 신상',
    badgeColor: 'bg-blue-100 text-blue-800',
    ctaBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    targetCategory: '간편식',
  },
];

export const AdMobBannerSection: React.FC<AdMobBannerSectionProps> = ({ section }) => {
  const { setActiveTab, setSelectedCategory } = useApp();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Native iOS / Android: Remove any bottom-pinned banner and initialize SDK in background
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      removeHomeBannerAd().catch(() => {});
      initAdMob().catch((err) => {
        console.warn('[AdMobBannerSection] Init notice:', err);
      });
    }
  }, []);

  // Auto rotate sponsored cards every 5.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % SPONSORED_ADS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered]);

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
            Google AdMob
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

      {/* 배너 광고 카드 컨테이너 (Google AdMob / AdSense 슬롯 연동 메타데이터 탑재) */}
      <div
        id="admob-banner-container"
        data-admob-app-id={ADMOB_CONFIG.appId}
        data-ad-unit={ADMOB_CONFIG.bannerAdUnitId}
        data-ad-client="ca-pub-3878859120989916"
        data-ad-slot="6084323850"
        onClick={() => handleAdClick(currentAd)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 p-3.5 border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          {/* 브랜드 로고 */}
          <div className="relative shrink-0">
            <BrandLogo brandName={currentAd.brandName} size="md" />
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[7px] font-black px-1 rounded-full shadow-2xs">
              AD
            </div>
          </div>

          {/* 광고 콘텐츠 문구 */}
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
          <div className="shrink-0 flex items-center justify-center">
            <div className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-0.5 shadow-2xs transition-all ${currentAd.ctaBg}`}>
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
