import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase';
import { ECouponDetail, ECouponItem, PurchasedECoupon } from '../types';

// e쿠폰 상점 API (/api/giftishow) 클라이언트. 인증키와 포인트 차감은 모두 서버에서 처리합니다.

const endpoint = () =>
  `${Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : ''}/api/giftishow`;

export interface CouponCatalog {
  goods: ECouponItem[];
  exchangeEnabled: boolean;
  userDailyLimit: number;
}

export interface ExchangeResult {
  success: boolean;
  coupon?: PurchasedECoupon;
  balance?: number;
  error?: string;
  needLogin?: boolean;
}

const getAccessToken = async (): Promise<string | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const session = data?.session;
  if (!session?.user || session.user.is_anonymous) return null;
  return session.access_token;
};

let catalogCache: { at: number; data: CouponCatalog } | null = null;
const CATALOG_TTL_MS = 10 * 60 * 1000;
const CATALOG_STORAGE_KEY = 'sinsangpick_coupon_catalog_v1';
const CATALOG_STORAGE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** 지난 방문 때 받아 둔 목록. 화면을 먼저 그린 뒤 최신 목록으로 교체하는 용도 */
export const getStoredCouponCatalog = (): CouponCatalog | null => {
  if (catalogCache) return catalogCache.data;
  try {
    const saved = JSON.parse(localStorage.getItem(CATALOG_STORAGE_KEY) || 'null');
    if (!saved || Date.now() - saved.at > CATALOG_STORAGE_MAX_AGE_MS || !Array.isArray(saved.data?.goods)) return null;
    return saved.data;
  } catch {
    return null;
  }
};

export const fetchCouponCatalog = async (force = false): Promise<CouponCatalog> => {
  if (!force && catalogCache && Date.now() - catalogCache.at < CATALOG_TTL_MS) return catalogCache.data;
  const res = await fetch(`${endpoint()}?action=goods`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'e쿠폰 목록을 불러오지 못했습니다.');
  const data: CouponCatalog = {
    goods: json.goods || [],
    exchangeEnabled: json.exchangeEnabled === true,
    userDailyLimit: json.userDailyLimit || 0,
  };
  catalogCache = { at: Date.now(), data };
  try {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalogCache));
  } catch {
    // 저장 공간 부족 등은 무시
  }
  return data;
};

export const fetchCouponDetail = async (code: string): Promise<ECouponDetail> => {
  const res = await fetch(`${endpoint()}?action=detail&code=${encodeURIComponent(code)}`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || '상품 정보를 불러오지 못했습니다.');
  return json.detail;
};

/** 로그인하지 않은 경우 null */
export const fetchMyCoupons = async (): Promise<{ coupons: PurchasedECoupon[]; balance: number | null } | null> => {
  const token = await getAccessToken();
  if (!token) return null;
  const res = await fetch(`${endpoint()}?action=my`, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || '내 쿠폰을 불러오지 못했습니다.');
  return { coupons: json.coupons || [], balance: json.balance ?? null };
};

export interface AdRewardStatus {
  userId: string;
  enabled: boolean;
  points: number;
  dailyLimit: number;
  today: number;
  balance: number | null;
}

/** 보상형 광고 적립 현황. 로그인하지 않은 경우 null */
export const fetchAdRewardStatus = async (): Promise<AdRewardStatus | null> => {
  const token = await getAccessToken();
  const userId = token ? (await supabase!.auth.getSession()).data.session?.user.id : null;
  if (!token || !userId) return null;
  const res = await fetch(`${endpoint()}?action=adstatus`, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || '광고 적립 정보를 불러오지 못했습니다.');
  return {
    userId,
    enabled: json.enabled === true,
    points: json.points || 0,
    dailyLimit: json.dailyLimit || 0,
    today: json.today || 0,
    balance: json.balance ?? null,
  };
};

export const exchangeCoupon = async (goodsCode: string): Promise<ExchangeResult> => {
  const token = await getAccessToken();
  if (!token) return { success: false, needLogin: true };
  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action: 'exchange', goodsCode }),
  });
  const json = await res.json();
  if (res.status === 401) return { success: false, needLogin: true };
  return { success: json.success === true, coupon: json.coupon, balance: json.balance, error: json.error };
};

export const setCouponUsed = async (trId: string, isUsed: boolean): Promise<PurchasedECoupon | null> => {
  const token = await getAccessToken();
  if (!token) return null;
  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action: 'use', trId, isUsed }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || '사용 상태를 변경하지 못했습니다.');
  return json.coupon;
};

/** 기프티쇼 원본 상품 이미지는 장당 최대 400KB 라 목록에서는 Vercel 이미지 최적화로 줄인 썸네일을 씁니다. */
export const couponThumbSrc = (url: string): string => {
  if (import.meta.env.DEV || !url.startsWith('https://bizimg.giftishow.com/')) return url;
  const base = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
  return `${base}/_vercel/image?url=${encodeURIComponent(url)}&w=384&q=70`;
};

/** 기프티쇼 쿠폰 이미지는 http 로 내려오므로 https 페이지에서 보이도록 프록시를 거칩니다. */
export const couponImageSrc = (url: string): string => {
  if (!url.startsWith('http:')) return url;
  const base = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
  return `${base}/api/image-proxy?url=${encodeURIComponent(url)}`;
};
