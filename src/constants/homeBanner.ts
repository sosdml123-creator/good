import type { BannerItem } from '../types';
import { COUPANG_AFFILIATE_URL, COUPANG_PARTNERS_NOTICE } from './affiliate';

// Avoid stale remote campaign images in the home affiliate placement.
export const COUPANG_HOME_BANNER: BannerItem = {
  id: 'coupang-home', image: '/banners/coupang-home.svg',
  title: '쿠팡에서 먹거리 둘러보기', linkType: 'url',
  linkUrl: COUPANG_AFFILIATE_URL, disclaimer: COUPANG_PARTNERS_NOTICE,
  isActive: true, order: 1,
};
