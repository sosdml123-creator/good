import type { BannerItem } from '../types';
import { COUPANG_AFFILIATE_URL, COUPANG_PARTNERS_NOTICE } from './affiliate';

// 이번 주 등록된 신상만 모아 보여주는 기획전 (상품은 화면에서 자동으로 채웁니다)
export const WEEKLY_NEW_BANNER_ID = 'weekly-new';
export const WEEKLY_NEW_BANNER: BannerItem = {
  id: WEEKLY_NEW_BANNER_ID, image: '/banners/weekly-new-v2.jpg',
  badge: 'NEW', title: '이번주 신상', subtitle: '이번 주에 새로 등록된 신상만 모았어요',
  linkType: 'collection',
  isActive: true, order: 0,
};

// Avoid stale remote campaign images in the home affiliate placement.
export const COUPANG_HOME_BANNER: BannerItem = {
  id: 'coupang-home', image: '/banners/coupang-home-v2.jpg',
  title: '쿠팡에서 먹거리 둘러보기', linkType: 'url',
  linkUrl: COUPANG_AFFILIATE_URL, disclaimer: COUPANG_PARTNERS_NOTICE,
  isActive: true, order: 1,
};

export const HOME_BANNERS: BannerItem[] = [WEEKLY_NEW_BANNER, COUPANG_HOME_BANNER];
