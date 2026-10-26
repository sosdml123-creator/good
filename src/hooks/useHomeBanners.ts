import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_BANNERS } from '../data/mockProducts';
import { HOME_BANNERS } from '../constants/homeBanner';
import type { BannerItem } from '../types';

const SEED_BANNER_IDS = new Set(INITIAL_BANNERS.map(b => b.id));
const FIXED_BANNER_IDS = new Set(HOME_BANNERS.map(b => b.id));

// 앱·PC 홈이 같은 배너 목록을 보도록 공통으로 사용합니다.
// 고정 배너(이번주 신상·쿠팡) 뒤에 관리자가 등록한 배너(서버 실시간 동기화)를 이어 붙입니다.
export function useHomeBanners(): BannerItem[] {
  const { banners } = useApp();
  return useMemo(() => {
    const admin = banners
      .filter(b => b.isActive && b.image && !SEED_BANNER_IDS.has(b.id) && !FIXED_BANNER_IDS.has(b.id))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return [...HOME_BANNERS, ...admin];
  }, [banners]);
}
