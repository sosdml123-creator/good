import type { Product, Review } from '../../types';
import type { MarketCategory, MarketPriceRow, MarketQuote } from '../../pc/useMarketPrices';

/* ───────────── 분류 ───────────── */

export type Group = 'agri' | 'sea' | 'meat';
export const GROUPS: { id: Group; label: string }[] = [
  { id: 'agri', label: '농산물' },
  { id: 'sea', label: '수산물' },
];
export const groupOf = (c: MarketCategory): Group => (c === '수산물' ? 'sea' : c === '축산물' ? 'meat' : 'agri');

export const SHORT_CAT: Record<MarketCategory, string> = {
  채소류: '채소', 과일류: '과일', 식량작물: '곡물', 축산물: '축산', 수산물: '수산',
};

/* ───────────── 품목 묶기 ───────────── */

/** 같은 품목·품종·단위를 한 줄로 묶고, 등급(상품/중품, 大/中/小)은 비교용으로 둡니다. */
export interface Item {
  id: string;
  rep: MarketPriceRow;
  grades: MarketPriceRow[];
}

const REP_ORDER = ['상품', '中', '중품', '大', '1등급', '-'];

export const buildItems = (rows: MarketPriceRow[]): Item[] => {
  const map = new Map<string, MarketPriceRow[]>();
  for (const r of rows) {
    if (r.today === null) continue;
    const k = `${r.category}|${r.itemCode}|${r.kindCode}|${r.unit}`;
    map.set(k, [...(map.get(k) || []), r]);
  }
  return [...map.values()].map(g => {
    const rep = REP_ORDER.map(o => g.find(r => r.rank === o)).find(Boolean) || g[0];
    return { id: rep.key, rep, grades: g };
  });
};

/** KAMIS 품종명 "국산(신선 냉장)" → ['국산', '신선 냉장'] */
export const kindTokens = (r: MarketPriceRow): string[] =>
  (r.kindName || '')
    .split(/[()]/)
    .map(s => s.trim())
    .filter(s => s && s !== r.itemName);

export const gradeLabel = (rank: string) =>
  rank === '-' || !rank ? '' : rank === '大' ? '대' : rank === '中' ? '중' : rank === '小' ? '소' : rank;

/** 품목 이름. 축산물은 부위까지 붙여야 구분돼요 (돼지 삼겹살, 소 안심). */
export const itemTitle = (r: MarketPriceRow) => {
  const first = kindTokens(r)[0];
  return r.category === '축산물' && first ? `${r.itemName} ${first}` : r.itemName;
};

/** 목록 둘째 줄: 품종 · 등급/크기 (이름에 이미 들어간 말은 빼고, 같은 말은 한 번만) */
export const itemSpec = (r: MarketPriceRow) => {
  const title = itemTitle(r);
  const g = gradeLabel(r.rank);
  const sizeWord = ['대', '중', '소'].includes(g) ? `크기 ${g}` : g;
  const parts = [...kindTokens(r), sizeWord].filter(t => t && !title.split(' ').includes(t));
  return [...new Set(parts)].join(' · ');
};

/** 수산물 상태 (활어·선어·냉동·염장·건어물) */
export const seafoodState = (r: MarketPriceRow): string | null => {
  if (r.category !== '수산물') return null;
  const k = `${r.itemName} ${r.kindName}`;
  if (/활/.test(k)) return '활어';
  if (/냉동/.test(k)) return '냉동';
  if (/염장/.test(k)) return '염장';
  if (/마른|건|구운|젓|액젓|천일염|굴비/.test(k)) return '건어물·가공';
  if (/냉장|신선/.test(k)) return '선어(냉장)';
  return null;
};

export const originOf = (r: MarketPriceRow): string | null => {
  const k = `${r.itemName} ${r.kindName}`;
  if (/수입/.test(k)) return '수입';
  if (/원양/.test(k)) return '원양';
  if (/연근해/.test(k)) return '연근해';
  if (/국산|한우|국내/.test(k)) return '국산';
  return null;
};

/** 목록 칩 필터 */
export const SUB_FILTERS: Record<Group, { id: string; label: string; test: (r: MarketPriceRow) => boolean }[]> = {
  agri: [
    { id: 'all', label: '전체', test: () => true },
    { id: 'veg', label: '채소', test: r => r.category === '채소류' },
    { id: 'fruit', label: '과일', test: r => r.category === '과일류' },
    { id: 'grain', label: '곡물', test: r => r.category === '식량작물' },
  ],
  sea: [
    { id: 'all', label: '전체', test: () => true },
    { id: 'fresh', label: '선어·냉장', test: r => seafoodState(r) === '선어(냉장)' || seafoodState(r) === '활어' || seafoodState(r) === null },
    { id: 'frozen', label: '냉동', test: r => seafoodState(r) === '냉동' },
    { id: 'dry', label: '건어물·염장', test: r => seafoodState(r) === '건어물·가공' || seafoodState(r) === '염장' },
  ],
  meat: [
    { id: 'all', label: '전체', test: () => true },
    { id: 'kr', label: '국산', test: r => !/수입/.test(r.itemName + r.kindName) },
    { id: 'imp', label: '수입', test: r => /수입/.test(r.itemName + r.kindName) },
  ],
};

/* ───────────── 사진 · 관련 상품 ───────────── */

/** KAMIS 품목명 → 앱 상품 소분류(subCategory). 실제 판매 상품 사진을 품목 사진으로 씁니다. */
const ITEM_TO_SUB: Record<string, string> = {
  사과: '사과', 배: '배', 복숭아: '복숭아', 딸기: '딸기', 수박: '수박', 참외: '참외', 감귤: '귤',
  포도: '포도', 바나나: '바나나', 소: '소고기', 돼지: '돼지고기', 닭: '닭고기', 계란: '계란',
  감자: '감자', 고구마: '고구마', 양파: '양파', 쌀: '쌀·잡곡', 고등어: '고등어', 갈치: '갈치',
  물오징어: '오징어', 전복: '전복',
};

export const isFreshProduct = (p: Product) =>
  p.itemType === 'fresh' || Boolean(p.produceDetails) || ['과일', '식재료', '고기·수산'].includes(p.category as string);

/** 농수산물 품목 상품 (id: kamis-품목코드[-품종코드], 소분류 = KAMIS 품목명) */
export const isMarketItemProduct = (p: Product) => p.id.startsWith('kamis-');

export const relatedProducts = (itemName: string, products: Product[]): Product[] => {
  const sub = ITEM_TO_SUB[itemName];
  return products.filter(p =>
    isMarketItemProduct(p) ? p.subCategory === itemName : Boolean(sub) && isFreshProduct(p) && p.subCategory === sub);
};

/** 시세 한 줄에 맞는 상품: 같은 품목 중 부위·품종 이름이 맞는 품목 상품을 먼저 고릅니다 (돼지 삼겹살 / 돼지 목심). */
export const productForRow = (r: MarketPriceRow, products: Product[]): Product | undefined => {
  const list = relatedProducts(r.itemName, products);
  // kamis-품목코드-품종코드 상품은 그 품종 행에만 붙입니다 (돼지 삼겹살 / 돼지 목심, 한우 등심).
  const market = list.filter(isMarketItemProduct).filter(p => { const k = p.id.split('-')[2]; return !k || k === r.kindCode; });
  if (list.some(isMarketItemProduct)) return market[0];
  return list[0];
};

export const photoFor = (r: MarketPriceRow, products: Product[]): string | null => {
  const current = productForRow(r, products)?.image;
  // Preserve existing locally generated product photos; replace externally hosted/crawled photos with our local set.
  return current?.startsWith('/produce-img/') ? current : fallbackProducePhoto(r.itemName, r.category);
};

// KAMIS 조사 품목 대부분은 별도 상품 카탈로그가 없어도 사진을 보여 주도록 준비한 품목별 실사 사진.
const PRODUCE_PHOTOS: Record<string, string> = {
  사과:'apple.jpg', 배:'pear.jpg', 복숭아:'generated-koreanmelon.jpg', 딸기:'generated-strawberry.jpg', 수박:'generated-watermelon.jpg', 참외:'generated-koreanmelon.jpg',
  감귤:'tangerine.jpg', 포도:'generated-grapes.jpg', 바나나:'banana.jpg', 감자:'potato.jpg', 고구마:'sweetpotato.jpg', 양파:'onion.jpg',
  배추:'generated-napa.jpg', 무:'radish.jpg', 토마토:'tomato.jpg', 방울토마토:'generated-cherrytomato.jpg', 오이:'generated-cucumber.jpg', 애호박:'generated-zucchini.jpg',
  풋고추:'generated-greenchili.jpg', 고추:'generated-greenchili.jpg', 브로콜리:'generated-broccoli.jpg', 가지:'generated-eggplant.jpg', 깻잎:'generated-minari.jpg', 미나리:'generated-minari.jpg', 파:'greenonion.jpg',
  고등어:'mackerel.jpg', 갈치:'hairtail.jpg', 명태:'pollock.jpg', 전복:'abalone.jpg', 굴:'oyster.jpg', 꽃게:'crab.jpg', 새우:'shrimp.jpg', 오징어:'squid.jpg', 물오징어:'squid.jpg',
  소:'beefsirloin.jpg', 등심:'generated-ribeye.jpg', 한우:'beefsirloin.jpg', 돼지:'porkbelly.jpg', 닭:'chicken.jpg', 계란:'egg.jpg', 쌀:'rice.jpg',
};
const fallbackProducePhoto = (name: string, category: MarketCategory) => {
  const key = Object.keys(PRODUCE_PHOTOS).sort((a,b)=>b.length-a.length).find(k=>name.includes(k));
  const file = key ? PRODUCE_PHOTOS[key] : category === '수산물' ? PRODUCE_PHOTOS['고등어'] : category === '축산물' ? PRODUCE_PHOTOS['소'] : PRODUCE_PHOTOS['토마토'];
  return `/produce-img/${file}`;
};

/** 로컬 품목 사진은 실제 판매 상품 사진이 아닌 품목 참고 이미지입니다. */
export const isGeneratedPhoto = (_src: string | null | undefined) => false;

/* ───────────── 후기 ───────────── */

/** 숨김·신고 숨김·차단한 작성자의 후기는 뺍니다 (기존 후기 목록과 같은 기준, App Store UGC 요건). */
const visibleReview = () => {
  const blocked = read<string[]>('sinsangpick_blocked_users', []);
  const hidden = read<string[]>('sinsangpick_hidden_ids', []);
  return (r: Review) => !r.isHidden && !hidden.includes(r.id) && !blocked.includes(r.userName);
};

export const freshReviews = (reviews: Review[], products: Product[]): Review[] => {
  const ids = new Set(products.filter(p => isFreshProduct(p) || isMarketItemProduct(p)).map(p => p.id));
  const ok = visibleReview();
  return reviews.filter(r => ok(r) && ids.has(r.productId));
};

export const reviewsForItem = (itemName: string, reviews: Review[], products: Product[]): Review[] => {
  const ids = new Set(relatedProducts(itemName, products).map(p => p.id));
  return reviews.filter(r => ids.has(r.productId));
};

/** 후기의 상품 → KAMIS 품목명 (시세 화면으로 연결) */
export const itemNameForProduct = (p: Product | undefined): string | null => {
  if (!p?.subCategory) return null;
  if (isMarketItemProduct(p)) return p.subCategory;
  const hit = Object.entries(ITEM_TO_SUB).find(([, sub]) => sub === p.subCategory);
  return hit ? hit[0] : null;
};

/**
 * 후기 항목별 평가. 농수산물 후기 작성 화면은 detailed_rating 에
 * taste=맛, value=신선도, portion=식감, repurchase=재구매 로 저장합니다. (예전 fresh_metrics 형식도 읽어요)
 */
export const reviewMetrics = (r: Review): [string, number][] => {
  const m = r.freshMetrics;
  if (m && (m.freshness || m.texture || m.sweetness || m.value)) {
    return ([['신선도', m.freshness], ['식감', m.texture], ['맛', m.sweetness], ['가성비', m.value]] as [string, number][]).filter(([, v]) => v > 0);
  }
  const d = r.detailedRating;
  if (!d) return [];
  return ([['맛', d.taste], ['신선도', d.value], ['식감', d.portion], ['재구매', d.repurchase]] as [string, number][]).filter(([, v]) => v > 0);
};

/* ───────────── 등락 · 가격 판단 ───────────── */

export const pctChange = (now: number | null, base: number | null): number | null =>
  now && base ? ((now - base) / base) * 100 : null;

export interface Verdict {
  tone: 'cheap' | 'normal' | 'pricey';
  diff: number;
  baseLabel: string;
  basePrice: number;
  text: string;
}

/** 평년 → 1년 전 → 1개월 전 순으로 기준을 잡아 지금 가격이 싼지 판단합니다 (±5% 이내는 보통). */
export const judgePrice = (r: MarketPriceRow): Verdict | null => {
  const bases: [string, number | null][] = [['평년', r.normal], ['1년 전', r.yearAgo], ['1개월 전', r.monthAgo]];
  const found = bases.find(([, v]) => v);
  if (!found || !r.today) return null;
  const [baseLabel, basePrice] = found as [string, number];
  const diff = ((r.today - basePrice) / basePrice) * 100;
  const tone = diff <= -5 ? 'cheap' : diff >= 5 ? 'pricey' : 'normal';
  const abs = Math.abs(diff).toFixed(0);
  const text = tone === 'cheap' ? `${baseLabel}보다 ${abs}% 싸요` : tone === 'pricey' ? `${baseLabel}보다 ${abs}% 비싸요` : `${baseLabel}과 비슷해요`;
  return { tone, diff, baseLabel, basePrice, text };
};

/* ───────────── 지역·시장 ───────────── */

/** KAMIS 조사처 중 "E-유통" 처럼 익명 처리된 곳은 대형 유통업체, 나머지는 전통시장입니다. */
export const isChainStore = (market: string) => /유통$/.test(market);

export interface RegionPrice { region: string; traditional: number | null; chain: number | null; count: number; min: number }

export const summarizeRegions = (quotes: MarketQuote[]): RegionPrice[] => {
  const by = new Map<string, MarketQuote[]>();
  quotes.forEach(q => by.set(q.region, [...(by.get(q.region) || []), q]));
  const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
  return [...by.entries()].map(([region, qs]) => ({
    region,
    traditional: avg(qs.filter(q => !isChainStore(q.market)).map(q => q.price)),
    chain: avg(qs.filter(q => isChainStore(q.market)).map(q => q.price)),
    count: qs.length,
    min: Math.min(...qs.map(q => q.price)),
  }));
};

export const marketLabel = (market: string) =>
  isChainStore(market) ? `대형유통 ${market.replace(/[-`'′]*유통$/, '').replace(/[`'′]/g, '')}` : /시장$/.test(market) ? market : `${market}시장`;

/* ───────────── 제철 · 구매 팁 (일반 참고 정보) ───────────── */

export const SEASONS: Record<number, string[]> = {
  1: ['감귤', '딸기', '시금치', '굴', '꼬막', '명태'],
  2: ['딸기', '시금치', '굴', '꼬막', '바지락'],
  3: ['딸기', '미나리', '바지락', '부추'],
  4: ['참외', '미나리', '바지락', '부추', '꽃게'],
  5: ['참외', '양파', '꽃게', '깐마늘(국산)'],
  6: ['수박', '감자', '오이', '깐마늘(국산)'],
  7: ['수박', '복숭아', '토마토', '전복', '오이'],
  8: ['포도', '복숭아', '전복', '풋고추'],
  9: ['사과', '배', '포도', '꽃게', '갈치'],
  10: ['사과', '배', '단감', '고구마', '꽃게', '갈치'],
  11: ['배추', '무', '감귤', '굴', '고등어', '단감', '사과'],
  12: ['감귤', '배추', '무', '굴', '꼬막', '명태'],
};

export const seasonMonths = (itemName: string): number[] =>
  Object.entries(SEASONS).filter(([, names]) => names.includes(itemName)).map(([m]) => Number(m));

export const currentMonth = () => Number(new Intl.DateTimeFormat('en', { month: 'numeric', timeZone: 'Asia/Seoul' }).format(new Date()));

const ITEM_TIPS: Record<string, string[]> = {
  수박: ['꼭지 주변이 살짝 움푹하고 꼭지 자국이 작은 것을 고르세요. 꼭지가 마른 정도만으로 숙도를 단정하긴 어려워요.', '껍질 무늬가 선명하고 줄무늬가 이어지며, 같은 크기라면 들었을 때 묵직한 것을 고르세요.', '밑동의 배꼽은 작고 단단한 편이 좋습니다. 두드리는 소리는 품종·두께에 따라 달라 보조 기준으로만 보세요.'],
  등심: ['등심 단면에 새우 모양으로 보이는 새우살이 또렷하고 넓게 붙은 부위는 풍미와 부드러움이 좋은 편입니다.', '근내지방은 고르게 퍼졌는지 확인하고, 지나치게 큰 지방 덩어리나 단단한 힘줄이 많은 단면은 용도에 맞춰 고르세요.', '포장 라벨의 한우·육우·젖소 구분, 등급, 도축·포장일과 100g당 가격을 함께 비교하세요.'],
  한우: ['등급 숫자가 높다고 모든 요리에 더 좋은 것은 아니에요. 구이는 마블링, 국거리·불고기는 가격과 부위 용도를 우선 비교하세요.', '등심은 새우살의 모양과 크기, 고기색의 선명함, 지방의 분포를 함께 확인하세요.'],
  수산물: ['생물은 눈이 맑고 살이 탄탄하며 비린내보다 바다 향이 약하게 나는지 확인하세요.', '얼음·손질 포함 무게인지, 원산지와 활어·선어·냉동 여부가 같은 조건인지 비교하세요.'],
  사과: ['꼭지가 마르지 않고 단단하며, 들었을 때 묵직한 것이 좋아요.', '다른 과일과 따로 비닐에 싸서 냉장 보관하세요.'],
  배: ['껍질이 매끄럽고 꼭지 반대쪽이 넓게 퍼진 것이 달아요.', '하나씩 신문지에 싸서 서늘한 곳에 두면 오래가요.'],
  감귤: ['껍질이 얇고 꼭지가 작은 것이 당도가 높아요.', '눌린 곳이 있으면 금방 무르니 따로 골라 두세요.'],
  배추: ['겉잎이 짙은 초록이고 들었을 때 묵직한 것을 고르세요.', '김장철에는 산지·크기별 가격 차이가 커요.'],
  무: ['껍질이 매끈하고 잔뿌리가 적으며 단단한 것이 좋아요.'],
  양파: ['껍질이 잘 말라 있고 눌렀을 때 단단한 것을 고르세요.'],
  감자: ['싹이나 푸른빛이 도는 것은 피하세요.', '햇빛이 들지 않는 서늘한 곳에 보관해요.'],
  고구마: ['표면이 매끄럽고 상처가 없는 것을 고르세요.', '냉장고보다 상온 보관이 좋아요.'],
  고등어: ['눈이 맑고 아가미가 선홍색인 것이 신선해요.', '국산 냉장과 수입 염장은 단위(1마리·1손)가 달라요.'],
  갈치: ['은빛 비늘이 고르게 남아 있고 몸이 단단한 것이 좋아요.', '크기(대·중·소)에 따라 가격 차이가 커요.'],
  물오징어: ['몸통이 투명하고 탄력 있는 것이 신선해요.', '연근해와 원양, 냉장과 냉동 가격을 따로 보세요.'],
  굴: ['살이 통통하고 유백색이며 가장자리가 검고 선명한 것을 고르세요.'],
  전복: ['살아 있다면 만졌을 때 움츠러드는 것이 신선해요.'],
  꽃게: ['들었을 때 묵직하고 배딱지가 단단한 것이 살이 많아요.'],
  계란: ['포장 날짜(산란일)를 확인하고 금이 간 것은 피하세요.'],
};

const CATEGORY_TIPS: Record<MarketCategory, string[]> = {
  채소류: ['시세는 전국 평균 소매가라 동네 가게·마트 가격과 차이가 있어요.', '잎채소는 날씨 영향으로 며칠 사이에도 가격이 크게 바뀌어요.'],
  과일류: ['선물용·가정용은 크기와 등급이 달라 같은 품목이라도 가격 차이가 커요.', '단위(개·kg·상자)를 맞춰서 비교하세요.'],
  식량작물: ['포장 단위(kg)와 생산 연도를 함께 확인하세요.'],
  축산물: ['부위·등급에 따라 가격이 달라요. 등급별 가격을 함께 보세요.', '수입산은 원산지 표시를 확인하세요.'],
  수산물: ['원산지와 활어·선어·냉동 여부를 꼭 확인하세요.', '손질 전후 무게와 손질비를 포함한 총액으로 비교하세요.'],
};

export const tipsFor = (r: MarketPriceRow): string[] => [...(ITEM_TIPS[r.itemName] || []), ...CATEGORY_TIPS[r.category]];

/* ───────────── 이 기기에 저장 (관심 · 알림 · 최근 본 · 저장한 후기) ───────────── */

export interface Watch { key: string; savedPrice: number | null; savedAt: string; alertBelow: number | null; alertOn: boolean }

const WATCH_KEY = 'sinsangpick-agri-watch-v2';
const LEGACY_FAV_KEY = 'sinsangpick-market-favorites-v1';
const RECENT_KEY = 'sinsangpick-agri-recent-v1';
const SAVED_REVIEW_KEY = 'sinsangpick-agri-saved-reviews-v1';

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
};

export const loadWatches = (): Watch[] => {
  const list = read<Watch[] | null>(WATCH_KEY, null);
  if (Array.isArray(list)) return list.filter(w => w && typeof w.key === 'string');
  // 이전 장보기 도우미의 하트 목록을 옮겨 옵니다.
  const legacy = read<unknown>(LEGACY_FAV_KEY, []);
  const keys = Array.isArray(legacy) ? legacy.filter((x): x is string => typeof x === 'string') : [];
  return keys.map(key => ({ key, savedPrice: null, savedAt: '', alertBelow: null, alertOn: true }));
};
export const saveWatches = (list: Watch[]) => write(WATCH_KEY, list);

export const loadRecent = (): string[] => read<string[]>(RECENT_KEY, []).filter(x => typeof x === 'string');
export const pushRecent = (key: string) => {
  const next = [key, ...loadRecent().filter(k => k !== key)].slice(0, 12);
  write(RECENT_KEY, next);
  return next;
};

export const loadSavedReviews = (): string[] => read<string[]>(SAVED_REVIEW_KEY, []).filter(x => typeof x === 'string');
export const saveSavedReviews = (ids: string[]) => write(SAVED_REVIEW_KEY, ids);

/** 알림 조건 충족 여부: 목표가 이하, 또는 (목표가가 없으면) 관심 등록 때보다 내려감 */
export const alertHit = (w: Watch, r: MarketPriceRow | undefined): boolean => {
  if (!w.alertOn || !r?.today) return false;
  if (w.alertBelow) return r.today <= w.alertBelow;
  return w.savedPrice !== null && r.today < w.savedPrice;
};

/* ───────────── 표시 ───────────── */

export const won = (n: number | null | undefined) => (n ? `${n.toLocaleString('ko-KR')}원` : '-');
export const num = (n: number | null | undefined) => (n ? n.toLocaleString('ko-KR') : '-');

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
export const fmtDate = (iso: string) => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso || '';
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return `${Number(m[2])}월 ${Number(m[3])}일(${WEEK[d.getDay()]})`;
};
export const fmtDot = (iso: string) => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : iso || '';
};

export const relTime = (iso: string) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
  return fmtDot(new Date(t).toISOString());
};

export const SOURCE_NOTE = 'KAMIS(한국농수산식품유통공사) 전국 평균 소매가';
export const NORMAL_NOTE = '평년: 최근 5년 같은 날 가격 중 최고·최저를 뺀 3년 평균 (KAMIS 기준)';
