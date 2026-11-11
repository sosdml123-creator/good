// 돈키호테 필수템 분류·테마 (상품 목록 자체는 Supabase donki_items 에서 가져옵니다)
import type { DonkiCategory, DonkiItem } from '../services/donkiService';
import { comparePrice } from './donkiGuide';

export const DONKI_CATEGORIES: DonkiCategory[] = ['의약품', '화장품', '과자·식품', '생활용품'];

/** 카테고리별 세부 분류 (매대 구분 기준) */
export const SUB_CATEGORIES: Record<DonkiCategory, string[]> = {
  '의약품': ['감기·목', '진통·해열', '위장약', '파스·근육', '눈약', '피부약', '비타민·영양제'],
  '화장품': ['선케어', '스킨케어', '클렌징', '메이크업', '헤어·바디'],
  '과자·식품': ['초콜릿', '스낵', '사탕·젤리', '라면·식품', '음료·차'],
  '생활용품': ['피로·휴식', '위생·건강', '미용도구', '문구·잡화'],
};

export type DonkiTheme = '선물' | '상비약' | '나눠주기' | '한국미판매';

export const THEMES: { id: DonkiTheme; emoji: string; title: string; desc: string }[] = [
  { id: '선물', emoji: '🎁', title: '선물하기 좋은', desc: '부모님·회사·친구 선물' },
  { id: '상비약', emoji: '💊', title: '여행 상비약', desc: '두통·배탈·감기 대비' },
  { id: '나눠주기', emoji: '🍬', title: '나눠주기 좋은', desc: '저렴하고 개별 포장' },
  { id: '한국미판매', emoji: '🇯🇵', title: '한국에 없는 템', desc: '국내 정식 판매 없음' },
];

export type DonkiSort = 'popular' | 'cheap' | 'saving';
export const SORTS: { id: DonkiSort; label: string }[] = [
  { id: 'popular', label: '인기순' },
  { id: 'cheap', label: '가격 낮은순' },
  { id: 'saving', label: '한국보다 싼 순' },
];

/** 화면에서 쓸 세부 정보 (DB 값 기준, 한국 미판매는 가격 메모로도 판단) */
export const detailOf = (item: DonkiItem): { sub: string | null; volume: string | null; tip: string | null; tags: DonkiTheme[] } => {
  const valid = THEMES.map(t => t.id) as string[];
  const tags = new Set<DonkiTheme>(item.tags.filter(t => valid.includes(t)) as DonkiTheme[]);
  if (item.krwNote?.includes('해외직구')) tags.add('한국미판매');
  return { sub: item.subCategory, volume: item.volume, tip: item.buyTip, tags: [...tags] };
};

export interface DonkiFilter {
  theme: DonkiTheme | null;
  category: '전체' | DonkiCategory;
  sub: string | null;
  keyword: string;
  sort: DonkiSort;
  rate: number | null;
}

/** 테마·분류·검색어로 거르고 정렬 (rank 는 전체 인기 순위 그대로 유지) */
export const filterDonki = <T extends { item: DonkiItem; rank: number }>(list: T[], f: DonkiFilter): T[] => {
  const kw = f.keyword.trim().toLowerCase();
  const out = list.filter(({ item }) => {
    const d = detailOf(item);
    if (f.theme && !d.tags.includes(f.theme)) return false;
    if (f.category !== '전체' && item.category !== f.category) return false;
    if (f.sub && d.sub !== f.sub) return false;
    if (kw && ![item.name, item.nameJa, item.brand, d.sub].some(v => v?.toLowerCase().includes(kw))) return false;
    return true;
  });
  if (f.sort === 'cheap') return [...out].sort((a, b) => (a.item.priceYen ?? 1e9) - (b.item.priceYen ?? 1e9));
  if (f.sort === 'saving') {
    const pct = (i: DonkiItem) => comparePrice(i.priceYen, i.priceKrw, f.rate).pct ?? -999;
    return [...out].sort((a, b) => pct(b.item) - pct(a.item));
  }
  return out;
};
