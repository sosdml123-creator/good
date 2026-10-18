// 떡집 기획전 — 요즘 유행하는 떡 소개와 파는 곳 안내 (모바일 TteokView · PC PcTteok 공용)
// 가격·재고는 가게마다 달라서 싣지 않고, 파는 곳은 검색 링크로 바로 연결합니다.

export type TteokSeason = '사계절' | '가을' | '겨울' | '봄' | '여름';

export interface TteokItem {
  id: string;
  name: string;
  emoji: string;
  /** 카드 배경 (tailwind 클래스) */
  tone: string;
  tag: string;
  season: TteokSeason;
  /** 한 줄 소개 */
  summary: string;
  /** 어떤 떡인지 */
  desc: string;
  taste: string;
  goodFor: string;
  tip: string;
  /** 검색에 쓰는 말 */
  keyword: string;
}

export const TTEOK_ITEMS: TteokItem[] = [
  {
    id: 'pizza-seolgi',
    name: '피자설기',
    emoji: '🍕',
    tone: 'bg-orange-50',
    tag: '요즘 대세',
    season: '사계절',
    summary: '쌀 설기 위에 치즈·야채가 올라간 짭짤한 떡',
    desc: '폭신한 쌀 설기에 모짜렐라 치즈와 피망·올리브·옥수수 같은 피자 토핑을 얹어 쪄낸 떡이에요. 달지 않아서 간식 겸 식사 대용으로 인기예요.',
    taste: '짭짤고소 · 쫀득한 치즈',
    goodFor: '아이 간식, 도시락, 가벼운 브런치',
    tip: '식으면 굳기 쉬워요. 전자레인지 20~30초 데우면 치즈가 다시 늘어나요.',
    keyword: '피자설기',
  },
  {
    id: 'cream-cheese-seolgi',
    name: '크림치즈 설기',
    emoji: '🧀',
    tone: 'bg-amber-50',
    tag: '디저트 떡',
    season: '사계절',
    summary: '크림치즈가 층층이 들어간 달콤한 설기',
    desc: '설기 사이에 크림치즈와 견과류·건과일을 넣은 퓨전 떡이에요. 케이크처럼 잘라 먹는 모양이라 선물용으로 많이 찾아요.',
    taste: '달콤새콤 · 부드러움',
    goodFor: '선물, 티타임, 손님 간식',
    tip: '냉장 보관하면 더 쫀득해요. 먹기 30분 전에 꺼내 두세요.',
    keyword: '크림치즈 설기',
  },
  {
    id: 'anbutter-tteok',
    name: '앙버터 떡',
    emoji: '🧈',
    tone: 'bg-yellow-50',
    tag: '단짠 조합',
    season: '사계절',
    summary: '팥앙금과 버터를 넣은 단짠 떡',
    desc: '앙버터 빵의 인기를 떡으로 옮긴 메뉴예요. 쫀득한 찹쌀 떡피 안에 팥앙금과 버터가 들어 있어요.',
    taste: '단짠단짠 · 쫀득',
    goodFor: '커피와 함께, 디저트',
    tip: '버터가 들어가서 실온에 오래 두지 마세요. 당일 먹는 게 가장 맛있어요.',
    keyword: '앙버터 떡',
  },
  {
    id: 'matcha-cream-tteok',
    name: '말차·쑥 크림떡',
    emoji: '🍵',
    tone: 'bg-green-50',
    tag: '말차 열풍',
    season: '사계절',
    summary: '말차·쑥 반죽에 생크림을 넣은 쫀득한 떡',
    desc: '말차나 쑥으로 색을 낸 찹쌀떡에 생크림·앙금을 채운 퓨전 떡이에요. 쌉싸름한 맛과 부드러운 크림의 조합이 인기예요.',
    taste: '쌉싸름 · 부드러운 크림',
    goodFor: '디저트 카페 느낌의 선물',
    tip: '생크림이 들어간 떡은 냉장 보관, 구매 당일~다음 날까지 드시는 게 안전해요.',
    keyword: '말차 크림떡',
  },
  {
    id: 'tteok-cake',
    name: '떡케이크',
    emoji: '🎂',
    tone: 'bg-pink-50',
    tag: '기념일',
    season: '사계절',
    summary: '설기 위에 앙금 꽃을 올린 케이크 모양 떡',
    desc: '생일·돌잔치·어버이날에 케이크 대신 쓰는 떡이에요. 앙금 플라워나 견과류로 장식하고 레터링을 넣어 주는 곳도 많아요.',
    taste: '은은한 단맛 · 쫀득',
    goodFor: '생일, 어버이날, 돌잔치, 답례',
    tip: '대부분 주문 제작이에요. 최소 2~3일 전에 예약하고, 날짜·문구·크기를 꼭 확인하세요.',
    keyword: '떡케이크',
  },
  {
    id: 'strawberry-mochi',
    name: '딸기 모찌 (딸기 찹쌀떡)',
    emoji: '🍓',
    tone: 'bg-rose-50',
    tag: '겨울 한정',
    season: '겨울',
    summary: '생딸기를 통째로 넣은 찹쌀떡',
    desc: '앙금과 통딸기를 얇은 찹쌀떡피로 감싼 겨울 한정 간식이에요. 딸기 철(12월~4월)에만 만나는 곳이 많아요.',
    taste: '상큼달콤 · 말랑',
    goodFor: '겨울 디저트, 선물',
    tip: '생과일이 들어 있어 당일 소비가 원칙이에요. 택배보다 매장 픽업을 추천해요.',
    keyword: '딸기모찌',
  },
  {
    id: 'chestnut-pumpkin-seolgi',
    name: '밤·단호박 설기',
    emoji: '🌰',
    tone: 'bg-orange-50',
    tag: '가을 한정',
    season: '가을',
    summary: '밤과 단호박이 듬뿍 든 가을 설기',
    desc: '햇밤과 단호박이 제철인 가을에 가장 맛있는 설기예요. 달지 않고 고소해서 어르신 선물로도 좋아요.',
    taste: '고소 · 은은한 단맛',
    goodFor: '가을 간식, 부모님 선물',
    tip: '제철 재료를 쓰는 곳이 많아요. 한 번에 많이 사면 냉동했다가 쪄서 드세요.',
    keyword: '밤 단호박 설기',
  },
  {
    id: 'ssuk-injeolmi',
    name: '쑥 인절미 (콩가루 듬뿍)',
    emoji: '🌿',
    tone: 'bg-lime-50',
    tag: '봄 한정',
    season: '봄',
    summary: '봄 쑥으로 만든 향긋한 인절미',
    desc: '봄에 나는 어린 쑥을 넣어 반죽한 인절미예요. 쑥 향이 진하고 콩가루를 넉넉히 묻혀 고소해요.',
    taste: '향긋 · 고소',
    goodFor: '봄 간식, 아침 대용',
    tip: '쑥 철(3~5월)에 가장 맛있어요. 남은 건 낱개 포장해 냉동하세요.',
    keyword: '쑥 인절미',
  },
  {
    id: 'black-sesame-mochi',
    name: '흑임자 찹쌀떡',
    emoji: '⚫',
    tone: 'bg-slate-100',
    tag: '고소한 인기템',
    season: '사계절',
    summary: '흑임자 앙금을 넣은 고소한 찹쌀떡',
    desc: '볶은 흑임자를 곱게 갈아 만든 앙금을 넣은 찹쌀떡이에요. 단맛이 과하지 않아 꾸준히 사랑받는 메뉴예요.',
    taste: '깊고 고소한 맛',
    goodFor: '디저트, 어른 선물',
    tip: '냉동 보관 후 실온에 10분 두면 말랑하게 먹을 수 있어요.',
    keyword: '흑임자 찹쌀떡',
  },
];

export interface TteokChannel {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  /** {q} 자리에 검색어가 들어갑니다 */
  url: string;
  kind: '매장' | '택배';
}

export const TTEOK_CHANNELS: TteokChannel[] = [
  { id: 'naver-map', name: '네이버 지도', emoji: '📍', kind: '매장', desc: '내 주변 떡집을 리뷰·영업시간과 함께 찾기', url: 'https://map.naver.com/p/search/{q}' },
  { id: 'kakao-map', name: '카카오맵', emoji: '🗺️', kind: '매장', desc: '가까운 떡집과 길찾기', url: 'https://map.kakao.com/?q={q}' },
  { id: 'naver-shopping', name: '네이버 쇼핑', emoji: '🛍️', kind: '택배', desc: '전국 떡집·공방의 택배 주문', url: 'https://search.shopping.naver.com/search/all?query={q}' },
  { id: 'coupang', name: '쿠팡', emoji: '🚚', kind: '택배', desc: '로켓배송 가능한 떡·냉동떡', url: 'https://www.coupang.com/np/search?q={q}' },
  { id: 'kurly', name: '마켓컬리', emoji: '🌅', kind: '택배', desc: '새벽배송으로 받는 프리미엄 떡', url: 'https://www.kurly.com/search?sword={q}' },
];

export const TTEOK_TIPS: { emoji: string; title: string; body: string }[] = [
  { emoji: '🕐', title: '당일 제조인지 확인하세요', body: '떡은 만든 지 하루만 지나도 굳기 시작해요. 동네 떡집은 오전에 가장 많이 나오고, 택배는 제조일과 배송일을 꼭 확인하세요.' },
  { emoji: '❄️', title: '남으면 바로 냉동', body: '먹을 만큼만 남기고 한 개씩 랩에 싸서 냉동하세요. 먹을 때는 찜기·전자레인지로 데우면 갓 만든 식감이 돌아와요.' },
  { emoji: '📞', title: '주문 제작은 전화 예약', body: '떡케이크·답례떡은 인기 시즌에 일찍 마감돼요. 날짜·수량·문구·포장을 통화로 확인하고, 카카오톡 채널이 있으면 사진을 받아 보세요.' },
  { emoji: '🧪', title: '알레르기·원재료 체크', body: '견과류·치즈·팥·콩가루가 많이 들어가요. 알레르기가 있다면 구매 전에 원재료 표시를 확인하세요.' },
  { emoji: '🔎', title: '검색은 메뉴 이름으로', body: '"피자설기", "크림치즈 설기"처럼 메뉴 이름으로 검색하면 그 메뉴를 실제로 만드는 가게를 찾기 쉬워요. 가게마다 취급 메뉴가 달라요.' },
];

export const tteokSearchUrl = (channel: TteokChannel, query: string): string =>
  channel.url.replace('{q}', encodeURIComponent(query));
