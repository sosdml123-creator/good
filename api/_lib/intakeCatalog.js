import { NEWS_BRANDS } from './storeCrawlers.js';

// 검색 범위는 이 목록으로 제한하지 않습니다. 아래는 빠뜨리지 않고 검색할 기본 출처입니다.
const groups = {
  '마트·편의점·유통': ['이마트', '롯데마트', '홈플러스', '코스트코', '트레이더스', '노브랜드', '피코크', '롯데슈퍼', 'GS더프레시', '이마트에브리데이', '하나로마트', '킴스클럽', 'CU', 'GS25', '세븐일레븐', '이마트24', '컬리', '오아시스마켓', '쿠팡', '신세계백화점', '롯데백화점', '현대백화점'],
  '카페·음료': ['스타벅스', '메가MGC커피', '빽다방', '이디야커피', '컴포즈커피', '더벤티', '투썸플레이스', '할리스', '폴 바셋', '공차', '커피빈', '엔제리너스', '파스쿠찌', '탐앤탐스', '커피베이', '카페베네', '달콤커피', '매머드커피', '텐퍼센트커피', '하삼동커피', '더리터', '감성커피', '벌크커피', '블루보틀', '테라로사', '프릳츠', '카멜커피', '노티드'],
  '베이커리·디저트': ['성심당', '한정선', '파리바게뜨', '뚜레쥬르', '던킨', '배스킨라빈스', '설빙', '요아정', '이성당', '삼송빵집', '옵스', '나폴레옹과자점', '태극당', '김영모과자점', '안스베이커리', '런던베이글뮤지엄', '아티스트베이커리', '오월의종', '밀도', '어니언', '랜디스도넛', '올드페리도넛', '크리스피크림도넛', '와플대학', '홍루이젠', '명랑핫도그', '청년떡집', '창억떡', '윤종희전통떡방', '복호두', '호두당', '백미당'],
  '식품·음료 제조사': ['동서식품', '농심', '오뚜기', '삼양식품', '팔도', '오리온', '롯데웰푸드', '해태제과', '크라운제과', '빙그레', '롯데칠성음료', 'CJ제일제당', '풀무원', '동원F&B', '대상', '샘표', '사조대림', '하림', '동원홈푸드', '신세계푸드', 'SPC삼립', '매일유업', '남양유업', '서울우유', '연세유업', 'hy', '정식품', '일동후디스', '코카콜라', '웅진식품', '광동제약', '일화', '한국야쿠르트', '하이트진로', '오비맥주', '하겐다즈', '켈로그', '네슬레', '청정원', '비비고', '고메', '백설', '맥심', '카누', '포스트', '노브랜드버거'],
  '외식·간편식': ['맥도날드', '버거킹', '롯데리아', '맘스터치', 'KFC', '쉐이크쉑', '노브랜드 버거', '프랭크버거', '노랑통닭', 'BBQ', 'bhc', '교촌치킨', '굽네치킨', '처갓집양념치킨', '네네치킨', '푸라닭', '자담치킨', '60계치킨', '도미노피자', '피자헛', '피자스쿨', '미스터피자', '파파존스', '반올림피자', '서브웨이', '이삭토스트', '한솥', '본죽', '본도시락', '죽이야기', '죠스떡볶이', '신전떡볶이', '엽기떡볶이', '청년다방', '두끼', '홍콩반점', '역전우동', '새마을식당'],
};

// 공식 공개 페이지: 같은 도메인 안에서 신제품·메뉴·뉴스 상세 링크를 따라갑니다.
const official = {
  '이마트': ['https://www.shinsegaegroupnewsroom.com/?s=이마트'],
  '롯데마트': ['https://company.lottemart.com/esg/esg_news.asp'],
  '동서식품': ['https://www.dongsuh.co.kr/mediaCenter/news/list/1'],
  '성심당': ['https://sungsimdang.co.kr/53', 'https://sungsimdang.co.kr/52?sca=보도자료'],
  '한정선': ['https://hanjungsun.co.kr/product'],
  '이디야커피': ['https://www.ediya.com/contents/drink.html'],
  '스타벅스': ['https://www.starbucks.co.kr/menu/drink_list.do'],
  '메가MGC커피': ['https://www.mega-mgccoffee.com/'],
  '빽다방': ['https://paikdabang.com/menu/menu_new/'],
  'CU': ['https://cu.bgfretail.com/product/product.do'],
  '세븐일레븐': ['https://www.7-eleven.co.kr/product/presentList.asp'],
  '더벤티': ['https://www.theventi.co.kr/new2022/menu/all.html'],
  '폴 바셋': ['https://www.baristapaulbassett.co.kr/menu/List.pb?cid1=A'],
  '파리바게뜨': ['https://www.paris.co.kr/products/'],
  '배스킨라빈스': ['https://www.baskinrobbins.co.kr/menu/list.php?category=A'],
  '맥도날드': ['https://www.mcdonalds.co.kr/'],
  '도미노피자': ['https://web.dominos.co.kr/goods/list?dsp_ctgr=C0101'],
};

const direct = new Set(['이디야커피', '스타벅스', '메가MGC커피', '빽다방', 'CU', '세븐일레븐']);
export const INTAKE_CATALOG = Object.entries(groups).flatMap(([group, brands]) => brands.map(brand => ({
  brand, group,
  kind: group === '마트·편의점·유통' ? 'store' : group === '식품·음료 제조사' ? 'manufacturer' : 'restaurant',
  officialUrls: official[brand] || [],
  method: direct.has(brand) ? 'direct' : official[brand] ? 'official-pages' : 'search',
})));
export const INTAKE_BRANDS = [
  ...NEWS_BRANDS,
  ...INTAKE_CATALOG.map(b => [b.brand, b.brand, b.kind]),
  ['이디아', '이디야커피', 'restaurant'], ['한정선모찌', '한정선', 'restaurant'],
];

export function canonicalIntakeBrand(value) {
  const key = String(value).replace(/\s+/g, '').toLowerCase();
  return INTAKE_BRANDS.find(([alias]) => alias.replace(/\s+/g, '').toLowerCase() === key)?.[1] || value;
}
export const BROAD_QUERIES = [
  '식품 신제품 출시', '음료 신제품 출시', '과자 신제품 출시', '카페 신메뉴', '베이커리 신제품',
  '디저트 신메뉴', '지역 빵집 신메뉴', '수제 디저트 신상', '마트 PB 신제품', '편의점 신상품',
  '떡집 신제품', '아이스크림 신제품', '외식 신메뉴 출시', '밀키트 신제품', '온라인 식품 신제품',
];

export function discoveryQueries(query = '', now = Date.now()) {
  if (query.trim()) return [query.trim()];
  // 제한 시간에도 매번 앞쪽 대형 브랜드만 검색하지 않도록 순서를 순환합니다.
  const offset = Math.floor(now / 3600000) % INTAKE_CATALOG.length;
  const brands = [...INTAKE_CATALOG.slice(offset), ...INTAKE_CATALOG.slice(0, offset)];
  return [...BROAD_QUERIES, ...brands.map(b => `${b.brand} ${b.kind === 'restaurant' ? '신메뉴' : '신제품'}`)];
}
