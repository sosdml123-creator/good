import { supabase } from './supabase';

export type DonkiCategory = '의약품' | '화장품' | '과자·식품' | '생활용품';

export interface DonkiItem {
  id: string;
  name: string;
  nameJa: string | null;
  brand: string;
  category: DonkiCategory;
  priceYen: number | null;
  description: string;
  imageUrl: string | null;
  badge: string | null;
  pickCount: number;
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
    priceYen: r.price_yen,
    description: r.description,
    imageUrl: r.image_url,
    badge: r.badge ?? null,
    pickCount: Number(r.pick_count) || 0,
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
