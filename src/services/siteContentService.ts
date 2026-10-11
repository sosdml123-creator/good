import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase';
import { BannerItem, Product, HomeSectionConfig, SalePromotionItem, PromotionEvent, BrandInfo, StoreChannelInfo, ReleaseCalendarItem, BattleConfig } from '../types';
import { fetchWithTimeout, withTimeout } from '../utils/networkUtils';
import { getAdminAuthHeaders, isAdminSession } from './adminAuth';

export const SYSTEM_BANNER_RECORD_ID = '__sinsangpick_system_banners__';

export interface RemoteContentPayload {
  banners?: BannerItem[];
  homeSections?: HomeSectionConfig[];
  salePromotions?: SalePromotionItem[];
  events?: PromotionEvent[];
  brands?: BrandInfo[];
  storeChannels?: StoreChannelInfo[];
  calendarItems?: ReleaseCalendarItem[];
  battleConfig?: BattleConfig;
  /** 관리자 기기에 남아 있던 수정분을 서버로 올린 시각 (이후로는 서버 값이 기준) */
  adminLocalSyncedAt?: string;
  products?: Product[];
  deletedProductIds?: string[];
  deletedBannerIds?: string[];
  deletedEventIds?: string[];
}

export interface RemoteContentResult {
  banners: BannerItem[] | null;
  homeSections: HomeSectionConfig[] | null;
  salePromotions: SalePromotionItem[] | null;
  events: PromotionEvent[] | null;
  brands: BrandInfo[] | null;
  storeChannels: StoreChannelInfo[] | null;
  calendarItems: ReleaseCalendarItem[] | null;
  battleConfig: BattleConfig | null;
  products: Product[];
  deletedProductIds: string[] | null;
  deletedBannerIds: string[] | null;
  deletedEventIds: string[] | null;
  lastUpdated: string | null;
}

/**
 * Fetch remote banners, home sections, and products directly from Supabase / API
 * Works consistently across both Web browsers and Capacitor Mobile Apps (iOS/Android).
 */
export const fetchRemoteContent = async (): Promise<RemoteContentResult> => {
  let banners: BannerItem[] | null = null;
  let homeSections: HomeSectionConfig[] | null = null;
  let salePromotions: SalePromotionItem[] | null = null;
  let events: PromotionEvent[] | null = null;
  let brands: BrandInfo[] | null = null;
  let storeChannels: StoreChannelInfo[] | null = null;
  let calendarItems: ReleaseCalendarItem[] | null = null;
  let battleConfig: BattleConfig | null = null;
  let products: Product[] = [];
  let deletedProductIds: string[] | null = null;
  let deletedBannerIds: string[] | null = null;
  let deletedEventIds: string[] | null = null;
  let lastUpdated: string | null = null;

  // 1. Direct Supabase Query (Fastest and works identically on both Web & Native App)
  if (supabase) {
    try {
      // Query system banners record with 7-second timeout
      const { data: sysData, error: sysErr } = await withTimeout(
        supabase
          .from('products')
          .select('*')
          .eq('id', SYSTEM_BANNER_RECORD_ID)
          .maybeSingle(),
        7000,
        { data: null, error: null } as any
      );

      if (!sysErr && sysData && sysData.nutrition) {
        if (Array.isArray(sysData.nutrition.banners)) {
          banners = sysData.nutrition.banners;
        }
        if (Array.isArray(sysData.nutrition.homeSections)) {
          homeSections = sysData.nutrition.homeSections;
        }
        if (Array.isArray(sysData.nutrition.salePromotions)) {
          salePromotions = sysData.nutrition.salePromotions;
        }
        if (Array.isArray(sysData.nutrition.events)) {
          events = sysData.nutrition.events;
        }
        if (Array.isArray(sysData.nutrition.brands)) brands = sysData.nutrition.brands;
        if (Array.isArray(sysData.nutrition.storeChannels)) storeChannels = sysData.nutrition.storeChannels;
        if (Array.isArray(sysData.nutrition.calendarItems)) calendarItems = sysData.nutrition.calendarItems;
        if (sysData.nutrition.battleConfig && typeof sysData.nutrition.battleConfig === "object") battleConfig = sysData.nutrition.battleConfig;
        if (Array.isArray(sysData.nutrition.deletedProductIds)) {
          deletedProductIds = sysData.nutrition.deletedProductIds;
        }
        if (Array.isArray(sysData.nutrition.deletedBannerIds)) {
          deletedBannerIds = sysData.nutrition.deletedBannerIds;
        }
        if (Array.isArray(sysData.nutrition.deletedEventIds)) {
          deletedEventIds = sysData.nutrition.deletedEventIds;
        }
        lastUpdated = sysData.updated_at || null;
      }
    } catch (e) {
      console.warn('[fetchRemoteContent] Supabase system record fetch warning:', e);
    }
  }

  // 2. Fallback to /api/site-content if Supabase didn't return banners record
  if (banners === null) {
    try {
      const apiEndpoint = Capacitor.isNativePlatform() 
        ? 'https://www.sinsangpick.kr/api/site-content' 
        : '/api/site-content';
      const apiRes = await fetchWithTimeout(apiEndpoint, {
        headers: { 'Accept': 'application/json' }
      }, 5000);
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.banners !== undefined && Array.isArray(json.banners)) {
          banners = json.banners;
        }
        if (json.homeSections !== undefined && Array.isArray(json.homeSections)) {
          homeSections = json.homeSections;
        }
        if (json.salePromotions !== undefined && Array.isArray(json.salePromotions)) {
          salePromotions = json.salePromotions;
        }
        if (json.events !== undefined && Array.isArray(json.events)) {
          events = json.events;
        }
        if (Array.isArray(json.brands)) brands = json.brands;
        if (Array.isArray(json.storeChannels)) storeChannels = json.storeChannels;
        if (Array.isArray(json.calendarItems)) calendarItems = json.calendarItems;
        if (json.battleConfig && typeof json.battleConfig === "object") battleConfig = json.battleConfig;
        if (json.deletedProductIds !== undefined && Array.isArray(json.deletedProductIds)) {
          deletedProductIds = json.deletedProductIds;
        }
        if (json.deletedBannerIds !== undefined && Array.isArray(json.deletedBannerIds)) {
          deletedBannerIds = json.deletedBannerIds;
        }
        if (json.deletedEventIds !== undefined && Array.isArray(json.deletedEventIds)) {
          deletedEventIds = json.deletedEventIds;
        }
        if (json.lastUpdated) {
          lastUpdated = json.lastUpdated;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return { banners, homeSections, salePromotions, events, brands, storeChannels, calendarItems, battleConfig, products, deletedProductIds, deletedBannerIds, deletedEventIds, lastUpdated };
};

export interface AdminApiResult<T = any> {
  ok: boolean;
  error?: string;
  code?: string;
  /** 저장은 됐지만 일부(마이그레이션 전 컬럼·테이블)는 건너뜀 */
  partial?: boolean;
  data?: T;
}

const adminApiUrl = () =>
  (Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : '') + '/api/site-content';

// 시스템 레코드는 읽고-합쳐-쓰는 방식이라, 요청이 겹치면 나중 응답이 앞선 저장을 덮어씁니다.
// 관리자 쓰기는 한 줄로 세워 순서대로 보냅니다.
let adminWriteQueue: Promise<unknown> = Promise.resolve();

const sendAdminRequest = async (action: string, payload: Record<string, unknown>): Promise<AdminApiResult> => {
  try {
    const authHeaders = await getAdminAuthHeaders();
    if (!authHeaders.Authorization) {
      return { ok: false, code: 'SIGNED_OUT', error: '관리자 로그인이 필요합니다. 다시 로그인해주세요.' };
    }
    const res = await fetchWithTimeout(adminApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ action, ...payload }),
    }, 25000);

    let json: any = null;
    try { json = await res.json(); } catch { /* non-JSON error page */ }

    if (res.ok && json?.success) {
      return { ok: true, partial: Boolean(json.partial), data: json };
    }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, code: 'UNAUTHORIZED', error: '관리자 권한을 확인하지 못했습니다. 다시 로그인해주세요.' };
    }
    if (res.status === 413) {
      return { ok: false, code: 'TOO_LARGE', error: '첨부한 이미지가 너무 큽니다. 더 작은 이미지나 이미지 주소(URL)를 사용해주세요.' };
    }
    return { ok: false, code: json?.code, error: json?.error || `서버 오류 (${res.status})` };
  } catch (e) {
    console.warn(`[adminApi] ${action} failed:`, e);
    return { ok: false, code: 'NETWORK', error: '서버에 연결하지 못했습니다. 네트워크 상태를 확인해주세요.' };
  }
};

/**
 * 관리자 쓰기 요청 (/api/site-content, service role 로 실행). 실패하면 ok:false 와 사유를 돌려줍니다.
 */
export const adminApi = <T = any>(action: string, payload: Record<string, unknown> = {}): Promise<AdminApiResult<T>> => {
  const run = () => sendAdminRequest(action, payload);
  const next = adminWriteQueue.then(run, run);
  adminWriteQueue = next;
  return next as Promise<AdminApiResult<T>>;
};

/**
 * 배너·홈 구좌·행사·체험단·브랜드·판매처·캘린더 설정 저장. 넘긴 키만 바뀌고 나머지는 서버 값이 유지됩니다.
 */
export const saveRemoteContent = (
  changes: Omit<RemoteContentPayload, 'products'>
): Promise<AdminApiResult> => adminApi('save_content', changes as Record<string, unknown>);

export const saveRemoteProducts = (products: Product[]): Promise<AdminApiResult> =>
  adminApi('upsert_products', { products });

/** 상품 삭제 — DB 행 삭제와 삭제 목록(deletedProductIds) 기록을 함께 처리 */
export const deleteRemoteProducts = (productIds: string[]): Promise<AdminApiResult> =>
  productIds.length === 0 ? Promise.resolve({ ok: true }) : adminApi('delete_products', { ids: productIds });

/**
 * 리뷰·게시글 수정/삭제 — 본인 글은 RLS 로 직접 처리하고, 남의 글은 관리자일 때만 서버로 처리합니다.
 */
const writeOwnOrAdmin = async (
  table: 'reviews' | 'community_posts',
  id: string,
  dbUpdates: Record<string, unknown> | null,
  adminAction: string,
  adminPayload: Record<string, unknown>
): Promise<AdminApiResult> => {
  if (supabase) {
    try {
      const query = dbUpdates
        ? supabase.from(table).update(dbUpdates).eq('id', id).select('id')
        : supabase.from(table).delete().eq('id', id).select('id');
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) return { ok: true };
    } catch (e) {
      console.warn(`[${table}] direct write warning:`, e);
    }
  }
  if (!(await isAdminSession())) return { ok: true };
  return adminApi(adminAction, { id, ...adminPayload });
};

export const deleteRemoteReview = (reviewId: string) =>
  writeOwnOrAdmin('reviews', reviewId, null, 'delete_review', {});

export const deleteRemoteCommunityPost = (postId: string) =>
  writeOwnOrAdmin('community_posts', postId, null, 'delete_post', {});

export const updateRemoteReview = (reviewId: string, dbUpdates: Record<string, unknown>) =>
  writeOwnOrAdmin('reviews', reviewId, dbUpdates, 'update_review', { updates: dbUpdates });

export const updateRemoteCommunityPost = (postId: string, dbUpdates: Record<string, unknown>) =>
  writeOwnOrAdmin('community_posts', postId, dbUpdates, 'update_post', { updates: dbUpdates });
