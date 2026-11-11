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

export interface DonkiDetail { sub: string; volume?: string; tip?: string; tags?: DonkiTheme[] }

/** 상품별 세부 정보 (id 기준). 관리자 탭에서 새로 넣은 상품은 여기 없으면 세부분류 없이 보여요. */
export const ITEM_DETAILS: Record<string, DonkiDetail> = {
  // 의약품
  'roihi-tsuboko': { sub: '파스·근육', volume: '156매', tip: '동전 크기라 목·어깨 뭉친 곳에 콕 붙여요. 대용량이 개당 가격이 싸요.', tags: ['선물', '한국미판매'] },
  'eve-quick': { sub: '진통·해열', volume: '20정', tip: '지정 제2류 의약품이라 1인당 구매 수량 제한이 있을 수 있어요.', tags: ['상비약', '한국미판매'] },
  'ohta-isan': { sub: '위장약', volume: '분말 75g', tip: '가루약이라 부모님 선물로 많이 사요. 작은 캔·분포 타입도 있어요.', tags: ['선물', '상비약', '한국미판매'] },
  'cabbagin': { sub: '위장약', volume: '100정', tip: '대용량(300정)이 정당 가격이 더 싸요.', tags: ['선물', '한국미판매'] },
  'salonpas': { sub: '파스·근육', volume: '140매', tip: '한국판보다 매수가 많은 일본판이에요. 피부가 약하면 소량부터 써 보세요.', tags: ['선물', '한국미판매'] },
  'lulu-attack-ex': { sub: '감기·목', volume: '18정', tip: '증상별(목·코·열)로 색이 다른 시리즈가 있어요. 목 감기는 빨간 상자예요.', tags: ['상비약', '한국미판매'] },
  'pabron-gold-a': { sub: '감기·목', volume: '28포', tip: '알약(정제) 타입도 있어요. 가루약이 부담되면 정제로 고르세요.', tags: ['상비약', '선물', '한국미판매'] },
  'bufferin-a': { sub: '진통·해열', volume: '40정', tip: '빠르게 녹는 "바파린 프리미엄"은 조금 더 비싸요.', tags: ['상비약', '한국미판매'] },
  'loxonin-s': { sub: '진통·해열', volume: '12정', tip: "'第1類医薬品'이라 약사가 있는 시간에만 살 수 있어요. 계산대에서 약사에게 물어보세요.", tags: ['상비약', '한국미판매'] },
  'sante-fx-neo': { sub: '눈약', volume: '12ml', tip: '청량감이 아주 강해요. 처음이면 순한 버전(サンテFX V)을 고르세요.', tags: ['한국미판매'] },
  'sante-beauteye': { sub: '눈약', volume: '12ml', tip: '렌즈를 낀 채로는 쓸 수 없어요. 상자째 선물하기 좋아요.', tags: ['선물', '한국미판매'] },
  'ryukakusan-direct': { sub: '감기·목', volume: '16포', tip: '민트·복숭아 맛이 있어요. 비행기 안에서 목이 마를 때도 좋아요.', tags: ['상비약', '한국미판매'] },
  'muhi-s': { sub: '피부약', volume: '18g', tip: '아이용은 순한 "무히 베비"를 고르세요.', tags: ['상비약', '한국미판매'] },
  'oronine-h': { sub: '피부약', volume: '100g', tip: '작은 튜브(11g)도 있어 여행용으로 챙기기 좋아요.', tags: ['상비약', '선물', '한국미판매'] },
  'seirogan': { sub: '위장약', volume: '100정', tip: '냄새가 싫으면 당의정(糖衣A)을 고르세요.', tags: ['상비약', '한국미판매'] },
  'chocola-bb-plus': { sub: '비타민·영양제', volume: '60정', tip: '용량이 큰 제품일수록 1정당 가격이 싸요.', tags: ['한국미판매'] },
  'alinamin-ex-plus': { sub: '비타민·영양제', volume: '60정', tip: '대용량(180정·270정)이 가성비가 좋아요. 부모님 선물 1순위예요.', tags: ['선물', '한국미판매'] },
  'hythiol-c': { sub: '비타민·영양제', volume: '120정', tip: '제3류 의약품이에요. 복용법을 지켜 드세요.', tags: ['한국미판매'] },
  // 화장품
  'biore-uv-aqua': { sub: '선케어', volume: '70g', tip: '한국보다 저렴하고 일본 한정 향이 나올 때가 있어요.', tags: ['나눠주기'] },
  'melano-cc': { sub: '스킨케어', volume: '20ml', tip: '프리미엄 버전은 노란 상자 대신 금색 포장이에요. 비교해서 고르세요.', tags: ['선물'] },
  'hadalabo-gokujyun': { sub: '스킨케어', volume: '170ml', tip: '리필(파우치)이 더 싸요. 무거우니 부치는 짐에 넣으세요.' },
  'senka-perfect-whip': { sub: '클렌징', volume: '120g', tip: '2~3개 묶음 상품이 개당 더 싸요.', tags: ['나눠주기'] },
  'anessa-milk': { sub: '선케어', volume: '60ml', tip: '면세 구매 시 개봉하지 마세요. 액체라 부치는 짐에 넣으세요.', tags: ['선물'] },
  'skin-aqua-toneup': { sub: '선케어', volume: '80g', tip: '라벤더(톤업)·민트(붉은기 커버) 색이 있어요.', tags: ['나눠주기'] },
  'keana-rice-mask': { sub: '스킨케어', volume: '10매', tip: '포장이 귀여워 친구 선물로 좋아요.', tags: ['선물', '나눠주기', '한국미판매'] },
  'lululun-pure': { sub: '스킨케어', volume: '32매', tip: '지역 한정판(오키나와·홋카이도 등)은 선물용으로 인기예요.', tags: ['선물'] },
  'fancl-cleansing-oil': { sub: '클렌징', volume: '120ml', tip: '2개 세트가 개당 더 싸요. 액체라 부치는 짐에 넣으세요.' },
  'mentholatum-melty': { sub: '스킨케어', volume: '2.4g', tip: '향이 여러 가지라 묶어서 나눠주기 좋아요.', tags: ['나눠주기'] },
  'canmake-marshmallow': { sub: '메이크업', volume: '10g', tip: '색상이 여러 개예요. 매장 테스터로 톤을 맞춰 보세요.', tags: ['선물'] },
  'kate-lip-monster': { sub: '메이크업', volume: '3g', tip: '인기 색은 자주 품절돼요. 보이면 바로 담으세요.', tags: ['선물'] },
  'heroine-make-mascara': { sub: '메이크업', volume: '6g', tip: '지울 땐 전용 리무버나 따뜻한 물을 쓰면 편해요.' },
  'fino-hair-mask': { sub: '헤어·바디', volume: '230g', tip: '무게가 꽤 나가요. 여러 개 살 땐 짐 무게를 확인하세요.' },
  'and-honey-shampoo': { sub: '헤어·바디', volume: '440ml', tip: '리필이 더 싸고 가벼워요. 액체라 부치는 짐에 넣으세요.' },
  // 과자·식품
  'kitkat-matcha': { sub: '초콜릿', volume: '미니 10개입', tip: '지역 한정 맛은 돈키보다 공항·기념품점에 많아요.', tags: ['선물', '나눠주기'] },
  'jagabee': { sub: '스낵', volume: '5봉', tip: '부서지기 쉬우니 캐리어 위쪽에 넣으세요.', tags: ['나눠주기'] },
  'black-thunder': { sub: '초콜릿', volume: '1개', tip: '대용량 봉지(개별 포장)가 나눠주기 편해요.', tags: ['나눠주기'] },
  'kororo': { sub: '사탕·젤리', volume: '48g', tip: '맛이 자주 바뀌어요. 한정 맛을 찾아보세요.', tags: ['나눠주기'] },
  'jagarico': { sub: '스낵', volume: '52g', tip: '컵이라 부피가 커요. 지역 한정 맛은 선물용 박스로도 팔아요.', tags: ['나눠주기', '한국미판매'] },
  'hi-chew': { sub: '사탕·젤리', volume: '12개입', tip: '한국에 없는 맛(머스캣·복숭아 등)을 골라 보세요.', tags: ['나눠주기'] },
  'alfort': { sub: '초콜릿', volume: '12개입', tip: '미니 사이즈 대용량 봉지가 나눠주기 좋아요.', tags: ['나눠주기', '한국미판매'] },
  'lumonde': { sub: '스낵', volume: '11개입', tip: '부서지기 쉬우니 박스 상품을 고르세요.', tags: ['나눠주기', '한국미판매'] },
  'kinoko-no-yama': { sub: '초콜릿', volume: '74g', tip: '라이벌 "타케노코노사토"와 같이 사서 비교해 보세요.', tags: ['나눠주기', '한국미판매'] },
  'happy-turn': { sub: '스낵', volume: '96g', tip: '개별 포장이라 회사에 돌리기 좋아요.', tags: ['나눠주기', '한국미판매'] },
  'pure-gummy': { sub: '사탕·젤리', volume: '56g', tip: '여름·겨울 한정 맛이 자주 나와요.', tags: ['나눠주기', '한국미판매'] },
  'donbei-kitsune': { sub: '라면·식품', volume: '1개', tip: '동일본(E)·서일본(W) 국물 맛이 달라요. 뚜껑 옆 표시를 보세요.', tags: ['한국미판매'] },
  'ichiran-ramen': { sub: '라면·식품', volume: '5식', tip: '매장보다 저렴할 때가 많아요. 상자가 커서 짐 공간을 남겨두세요.', tags: ['선물', '한국미판매'] },
  'kewpie-mayo': { sub: '라면·식품', volume: '450g', tip: '액체류로 봐서 부치는 짐에 넣어야 해요.' },
  'blendy-stick': { sub: '음료·차', volume: '30개입', tip: '말차라테·로열밀크티 맛도 있어요.', tags: ['선물', '나눠주기'] },
  // 생활용품
  'kyusoku-jikan': { sub: '피로·휴식', volume: '18매', tip: '많이 걸은 날 밤에 종아리에 붙이고 자요. 대용량이 훨씬 싸요.', tags: ['선물'] },
  'megrhythm': { sub: '피로·휴식', volume: '12매', tip: '향이 여러 가지예요. 선물용은 무향이 무난해요.', tags: ['선물', '나눠주기'] },
  'azuki-no-chikara': { sub: '피로·휴식', volume: '1개', tip: '눈용·허리용도 있어요. 부모님 선물로 반응이 좋아요.', tags: ['선물', '한국미판매'] },
  'netsusama-sheet': { sub: '위생·건강', volume: '16매', tip: '아이용(小さなお子様用)은 크기가 작아요.', tags: ['상비약'] },
  'hokkairo': { sub: '위생·건강', volume: '10개', tip: '붙이는 타입(貼る)과 주머니 타입이 있어요. 맨살엔 붙이지 마세요.' },
  'biore-powder-sheet': { sub: '위생·건강', volume: '36매', tip: '여행용 소포장(10매)도 있어요.', tags: ['나눠주기'] },
  'kai-nail-clipper': { sub: '미용도구', volume: '1개', tip: '칼날류라 기내 반입이 막힐 수 있어요. 부치는 짐에 넣으세요.', tags: ['선물'] },
  'jetstream-4and1': { sub: '문구·잡화', volume: '1자루', tip: '한국보다 저렴하고 색상이 다양해요.', tags: ['선물'] },
  'frixion-ball': { sub: '문구·잡화', volume: '0.5mm', tip: '열에 약해 뜨거운 차 안에 두면 글씨가 지워져요.', tags: ['나눠주기'] },
};

/** 화면에서 쓸 세부 정보 (한국 미판매는 가격 메모로도 판단) */
export const detailOf = (item: DonkiItem): { sub: string | null; volume: string | null; tip: string | null; tags: DonkiTheme[] } => {
  const d = ITEM_DETAILS[item.id];
  const tags = new Set<DonkiTheme>(d?.tags || []);
  if (item.krwNote?.includes('해외직구')) tags.add('한국미판매');
  return { sub: d?.sub ?? null, volume: d?.volume ?? null, tip: d?.tip ?? null, tags: [...tags] };
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
