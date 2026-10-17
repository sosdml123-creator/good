import { Capacitor } from '@capacitor/core';
import { PendingProduct } from '../types';
import { getAdminAuthHeaders } from './adminAuth';

/**
 * 신제품 수집·승인 대기함 API 클라이언트 (/api/pending-products)
 * 수집·저장·승인은 모두 서버(service role)에서 처리합니다.
 */
const API_URL = `${Capacitor.isNativePlatform() ? 'https://www.sinsangpick.kr' : ''}/api/pending-products`;

export type CollectSource = 'all' | 'stores' | 'cu' | 'seven' | 'starbucks' | 'mega' | 'paik' | 'news' | 'blog' | 'mfds';

export interface CollectReport {
  source: string;
  label: string;
  ok: boolean;
  found: number;
  inserted: number;
  duplicates: number;
  /** 확인된 제품 사진이 없어 담지 않은 건수 */
  noImage?: number;
  warning?: string;
  error?: string;
  code?: string;
}

export class PendingApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

const mapRow = (row: any): PendingProduct => ({
  id: row.id,
  name: row.name,
  brand: row.brand,
  category: row.category,
  subCategory: row.sub_category || undefined,
  itemType: row.item_type || 'packaged',
  image: row.image || '',
  releaseDate: row.release_date || '',
  price: row.price || 0,
  discountRate: row.discount_rate || 0,
  stores: row.stores || [],
  description: row.description || '',
  sourceName: row.source_name || undefined,
  sourceUrl: row.source_url || undefined,
  crawledAt: row.crawled_at || '',
  status: row.status || 'pending',
  calories: row.calories || undefined,
  volume: row.volume || undefined,
  nutrition: row.nutrition || undefined,
  ingredients: row.ingredients || undefined,
  allergens: row.allergens || undefined,
});

async function request<T = any>(init: { method: 'GET' | 'POST'; query?: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${init.query || ''}`, {
      method: init.method,
      headers: { 'Content-Type': 'application/json', ...(await getAdminAuthHeaders()) },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new PendingApiError('서버에 연결하지 못했습니다. 네트워크 상태를 확인해주세요.', 'NETWORK');
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // JSON이 아닌 응답 (배포 전 404 페이지 등)
  }

  if (!res.ok || !data?.success) {
    throw new PendingApiError(data?.error || `요청에 실패했습니다. (HTTP ${res.status})`, data?.code);
  }
  return data as T;
}

export const fetchPendingProducts = async (
  status: 'pending' | 'rejected' = 'pending'
): Promise<{ items: PendingProduct[]; naverConfigured: boolean }> => {
  const data = await request({ method: 'GET', query: `?status=${status}` });
  return { items: (data.items || []).map(mapRow), naverConfigured: Boolean(data.naverConfigured) };
};

export const collectPendingProducts = async (source: CollectSource, query?: string): Promise<CollectReport[]> => {
  const data = await request({ method: 'POST', body: { action: 'collect', source, query } });
  return data.reports || [];
};

export const addPendingItems = async (items: PendingProduct[]): Promise<void> => {
  await request({ method: 'POST', body: { action: 'add', items } });
};

export const updatePendingItem = async (id: string, patch: Partial<PendingProduct>): Promise<void> => {
  await request({ method: 'POST', body: { action: 'update', id, patch } });
};

export const setPendingStatus = async (ids: string[], status: 'pending' | 'rejected'): Promise<void> => {
  await request({ method: 'POST', body: { action: 'set_status', ids, status } });
};

export const approvePendingItems = async (
  items: { pendingId: string; productId: string }[]
): Promise<{ pendingId: string; productId: string }[]> => {
  const data = await request({ method: 'POST', body: { action: 'approve', items } });
  return data.approved || [];
};
