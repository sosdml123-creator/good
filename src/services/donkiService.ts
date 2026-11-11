import { supabase } from './supabase';

export type DonkiCategory = '의약품' | '화장품' | '과자·식품' | '생활용품';

export interface DonkiItem {
  id: string;
  name: string;
  nameJa: string | null;
  brand: string;
  category: DonkiCategory;
  subCategory: string | null;
  volume: string | null;
  buyTip: string | null;
  tags: string[];
  priceYen: number | null;
  description: string;
  imageUrl: string | null;
  badge: string | null;
  priceKrw: number | null;
  krwNote: string | null;
  krwCheckedOn: string | null;
  pickCount: number;
  reviewCount: number;
  avgRating: number | null;
}

/** 돈키호테 쇼핑 순위 (담은 회원 수 → 에디터 순서). 목록은 Supabase donki_items 에서만 가져옵니다. */
export const fetchDonkiRanking = async (): Promise<DonkiItem[]> => {
  if (!supabase) throw new Error('서버에 연결할 수 없어요.');
  const { data, error } = await supabase.rpc('get_donki_ranking');
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    nameJa: r.name_ja,
    brand: r.brand,
    category: r.category,
    subCategory: r.sub_category ?? null,
    volume: r.volume ?? null,
    buyTip: r.buy_tip ?? null,
    tags: Array.isArray(r.tags) ? r.tags : [],
    priceYen: r.price_yen,
    description: r.description,
    imageUrl: r.image_url,
    badge: r.badge ?? null,
    priceKrw: r.price_krw ?? null,
    krwNote: r.krw_note ?? null,
    krwCheckedOn: r.krw_checked_on ?? null,
    pickCount: Number(r.pick_count) || 0,
    reviewCount: Number(r.review_count) || 0,
    avgRating: r.avg_rating != null ? Number(r.avg_rating) : null,
  }));
};

const getUserId = async (): Promise<string | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
};

/** 내가 '살 거예요'로 담은 상품 id 목록. 로그인 전이면 null */
export const fetchMyDonkiPicks = async (): Promise<string[] | null> => {
  const uid = await getUserId();
  if (!uid || !supabase) return null;
  const { data, error } = await supabase.from('donki_picks').select('item_id').eq('user_id', uid);
  if (error) throw error;
  return (data || []).map((r: any) => r.item_id);
};

/** 담기/빼기. 로그인 전이면 'login' 을 돌려줍니다. */
export const setDonkiPick = async (itemId: string, picked: boolean): Promise<'ok' | 'login'> => {
  const uid = await getUserId();
  if (!uid || !supabase) return 'login';
  const { error } = picked
    ? await supabase.from('donki_picks').upsert({ item_id: itemId, user_id: uid }, { onConflict: 'item_id,user_id', ignoreDuplicates: true })
    : await supabase.from('donki_picks').delete().eq('item_id', itemId).eq('user_id', uid);
  if (error) throw error;
  return 'ok';
};

export interface DonkiStore {
  id: string;
  city: string;
  name: string;
  nameJa: string;
  area: string | null;
  feature: string | null;
}

/** 여행객이 많이 가는 돈키호테 매장 (관리자 탭에서 관리) */
export const fetchDonkiStores = async (): Promise<DonkiStore[]> => {
  if (!supabase) throw new Error('서버에 연결할 수 없어요.');
  const { data, error } = await supabase.from('donki_stores').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id, city: r.city, name: r.name, nameJa: r.name_ja, area: r.area, feature: r.feature,
  }));
};

export interface DonkiReview {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  rating: number;
  content: string;
  createdAt: string;
}

const mapReview = (r: any): DonkiReview => ({
  id: r.id, itemId: r.item_id, userId: r.user_id, userName: r.user_name, userAvatar: r.user_avatar,
  rating: r.rating, content: r.content, createdAt: r.created_at,
});

/** 상품 리뷰 (실제 회원이 쓴 것만) */
export const fetchDonkiReviews = async (itemId: string): Promise<DonkiReview[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('donki_reviews').select('*').eq('item_id', itemId).order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return (data || []).map(mapReview);
};

export const addDonkiReview = async (
  itemId: string, rating: number, content: string, author: { name: string; avatar?: string | null }
): Promise<DonkiReview | 'login'> => {
  const uid = await getUserId();
  if (!uid || !supabase) return 'login';
  const { data, error } = await supabase.from('donki_reviews')
    .insert({ item_id: itemId, user_id: uid, user_name: author.name || '신상픽 회원', user_avatar: author.avatar || null, rating, content: content.trim().slice(0, 500) })
    .select('*').single();
  if (error) throw error;
  return mapReview(data);
};

export const deleteDonkiReview = async (reviewId: string) => {
  if (!supabase) return;
  const { error } = await supabase.from('donki_reviews').delete().eq('id', reviewId);
  if (error) throw error;
};

export const getMyUserId = getUserId;

/** 엔→원 환율 (ECB 기준, 12시간 캐시). 못 불러오면 null */
const RATE_KEY = 'sinsangpick_jpy_krw';
export const fetchJpyKrwRate = async (): Promise<{ rate: number; date: string } | null> => {
  try {
    const cached = JSON.parse(localStorage.getItem(RATE_KEY) || 'null');
    if (cached && Date.now() - cached.savedAt < 12 * 3600 * 1000) return { rate: cached.rate, date: cached.date };
  } catch { /* 캐시 없음 */ }
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=JPY&symbols=KRW');
    const json = await res.json();
    const rate = Number(json?.rates?.KRW);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    try { localStorage.setItem(RATE_KEY, JSON.stringify({ rate, date: json.date, savedAt: Date.now() })); } catch { /* 저장 불가 */ }
    return { rate, date: json.date };
  } catch {
    return null;
  }
};
