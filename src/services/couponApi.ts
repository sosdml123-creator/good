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

/** 기프티쇼 쿠폰 이미지는 http 로 내려오므로 https 페이지에서 보이도록 프록시를 거칩니다. */
export const couponImageSrc = (url: string): string => {
  if (!url.startsWith('http:')) return url;
  const base = Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '';
  return `${base}/api/image-proxy?url=${encodeURIComponent(url)}`;
};
