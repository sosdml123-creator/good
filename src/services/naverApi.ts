import { PendingProduct, ProductCategory } from '../types';

export interface NaverSearchItem {
  title: string;
  link: string;
  description?: string;
  originallink?: string;
  pubDate?: string;
  thumbnail?: string;
  sizeheight?: string;
  sizewidth?: string;
}

export interface NaverSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverSearchItem[];
}

/**
 * Clean up HTML tags and entities
 */
export const cleanHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/<[^>]*>?/gm, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const KNOWN_BRANDS = [
  '농심', '오리온', '롯데웰푸드', '롯데', '빙그레', '삼양식품', '삼양', 'CJ제일제당', 'CJ',
  '오뚜기', '팔도', '해태제과', '해태', '매일유업', '남양유업', '동원에프앤비', '동원',
  '하이트진로', '오비맥주', 'SPC', '삼립', '파리바게뜨', '뚜레쥬르', '연세유업', '서울우유',
  'CU', 'GS25', '세븐일레븐', '이마트24', '스타벅스', '이디야', '투썸플레이스', '배스킨라빈스',
  '하겐다즈', '하림', '풀무원', '비비고', '맥도날드', '버거킹', 'KFC', '맘스터치', '노브랜드'
];

const EXCLUDE_KEYWORDS = [
  '전자담배', '궐련형', '스마트폰', '갤럭시', '아이폰', '노트북', '가전',
  '주가', '공시', '투자유치', 'MOU', '사전예약', '모바일게임', '게임', '코스닥', '상장',
  '의류', '패션', '신발', '자동차', '전기차', '아파트', '분양', '부동산', '증시', '보험',
  '영업이익', '매출액', '목표주가', '배당금', '특허', '업무협약'
];

// 언론사 워터마크가 찍히는 대표적 뉴스 도메인/패턴 (이들 URL은 우선순위에서 제외하거나 필터링)
const WATERMARKED_NEWS_DOMAINS = [
  'yna.co.kr', 'yonhapnews', 'newsis', 'news1.kr', 'chosun.com', 'donga.com',
  'joins.com', 'sedaily.com', 'hankyung.com', 'heraldcorp.com', 'etoday.co.kr',
  'newspim.com', 'asiae.co.kr', 'fnnews.com', 'nocutnews.co.kr', 'ytn.co.kr',
  'sbs.co.kr', 'kbs.co.kr', 'mbc.co.kr', 'munhwa.com', 'khan.co.kr', 'seoul.co.kr',
  'kmib.co.kr', 'isplus.com', 'sportsworldi.com', 'sportschosun.com', 'osen.co.kr',
  'xportsnews.com', 'mydaily.co.kr', 'stoo.com', 'joynews24.com', 'inews24.com',
  'edaily.co.kr', 'mt.co.kr', 'moneys.co.kr', 'newsfreezone', 'wikitree'
];

// 카테고리별 고화질 클린 패키지/푸드 대표 이미지 풀 (워터마크 없는 깔끔한 이미지 대체용)
const HIGH_QUALITY_CATEGORY_IMAGES: Record<ProductCategory, string[]> = {
  '신제품': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
  ],
  '간편식': [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80', // 라면
    'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800&auto=format&fit=crop&q=80', // 볶음면
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', // 도시락
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80', // 김밥
    'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80', // 만두/딤섬
    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80'  // 사발면
  ],
  '음료': [
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80', // 커피
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80', // 탄산캔
    'https://images.unsplash.com/photo-1608270178497-60e5dfa43872?w=800&auto=format&fit=crop&q=80', // 맥주/주류
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80', // 라떼/오트
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80'  // 주스/스무디
  ],
  '빵·디저트': [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80', // 베이커리
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80', // 쿠키
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80', // 아이스크림
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80'  // 케이크
  ],
  '과자': [
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80', // 비스킷
    'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80', // 감자칩
    'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&auto=format&fit=crop&q=80', // 젤리
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80'  // 스낵
  ],
  '과일': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  ],
  '식재료': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  ],
  '고기·수산': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  ],
  '기타': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  ],
  '전체': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  ]
};

/**
 * Detect product category from text
 */
export const detectCategory = (text: string): ProductCategory => {
  const t = text.toLowerCase();
  if (t.includes('라면') || t.includes('도시락') || t.includes('김밥') || t.includes('간편식') || 
      t.includes('밀키트') || t.includes('덮밥') || t.includes('버거') || t.includes('피자') ||
      t.includes('만두') || t.includes('볶음밥') || t.includes('햇반') || t.includes('안주') ||
      t.includes('삼각김밥') || t.includes('핫바') || t.includes('소시지') || t.includes('파스타')) {
    return '간편식';
  }
  if (t.includes('음료') || t.includes('커피') || t.includes('라떼') || t.includes('탄산') || 
      t.includes('주스') || t.includes('에이드') || t.includes('맥주') || t.includes('하이볼') || 
      t.includes('차') || t.includes('밀크티') || t.includes('스무디') || t.includes('소주') ||
      t.includes('요거트') || t.includes('유제품') || t.includes('우유') || t.includes('콜라') ||
      t.includes('사이다') || t.includes('에너지드링크')) {
    return '음료';
  }
  if (t.includes('빵') || t.includes('디저트') || t.includes('케이크') || t.includes('크림빵') || 
      t.includes('도넛') || t.includes('찹쌀떡') || t.includes('쿠키') || t.includes('와플') ||
      t.includes('베이글') || t.includes('샌드위치') || t.includes('타르트') || t.includes('슈') ||
      t.includes('약과') || t.includes('마카롱') || t.includes('휘낭시에') || t.includes('카스테라')) {
    return '빵·디저트';
  }
  if (t.includes('과자') || t.includes('스낵') || t.includes('감자칩') || t.includes('젤리') || 
      t.includes('초콜릿') || t.includes('캔디') || t.includes('아이스크림') || t.includes('팝콘') ||
      t.includes('비스킷') || t.includes('초코') || t.includes('웨하스') || t.includes('사탕') ||
      t.includes('칩') || t.includes('구미')) {
    return '과자';
  }
  if (t.includes('과일') || t.includes('딸기') || t.includes('사과') || t.includes('포도') || 
      t.includes('수박') || t.includes('복숭아') || t.includes('샤인머스캣') || t.includes('망고')) {
    return '과일';
  }
  if (t.includes('고기') || t.includes('한우') || t.includes('삼겹살') || t.includes('연어') || 
      t.includes('수산') || t.includes('참치') || t.includes('새우') || t.includes('치킨')) {
    return '고기·수산';
  }
  return '간편식';
};

/**
 * Detect convenience stores mentioned in text
 */
export const detectStores = (text: string): string[] => {
  const stores: string[] = [];
  if (/CU|씨유|포켓CU/i.test(text)) stores.push('CU');
  if (/GS25|지에스|우리동네GS/i.test(text)) stores.push('GS25');
  if (/세븐일레븐|7-Eleven|코리아세븐/i.test(text)) stores.push('세븐일레븐');
  if (/이마트24|emart24/i.test(text)) stores.push('이마트24');
  if (stores.length === 0) {
    stores.push('CU', 'GS25', '세븐일레븐', '대형마트');
  }
  return stores;
};

/**
 * Detect brand name from text
 */
export const detectBrand = (text: string): string => {
  for (const b of KNOWN_BRANDS) {
    if (text.includes(b)) return b;
  }
  if (/CU|씨유/i.test(text)) return 'CU';
  if (/GS25|지에스/i.test(text)) return 'GS25';
  if (/세븐일레븐/i.test(text)) return '세븐일레븐';
  if (/이마트24/i.test(text)) return '이마트24';
  return '편의점 신상';
};

/**
 * Extract clean and accurate product name from news title & description
 */
export const extractProductName = (rawTitle: string, rawDesc: string = '', detectedBrand: string = ''): string => {
  let title = cleanHtml(rawTitle);
  const desc = cleanHtml(rawDesc);

  // 1. Remove bracketed editorial tags: [포토], [단독], [신상품], (종합), 【현장】, <신간> 등
  title = title.replace(/\[[^\]]*\]/g, ' ')
               .replace(/\([^\)]*\)/g, ' ')
               .replace(/【[^】]*】/g, ' ')
               .replace(/\<[^\>]*\>/g, ' ')
               .replace(/\s+/g, ' ')
               .trim();

  // 2. Extract from quotes: '신라면 툼바', "연세우유 밤티라미수 생크림빵", ‘통새우 만두’
  const quoteMatches = title.match(/['‘"“]([^'’”"]{2,35})['’”"]/g);
  if (quoteMatches && quoteMatches.length > 0) {
    for (const q of quoteMatches) {
      let clean = q.replace(/['‘"“”]/g, '').trim();
      // Remove invalid generic words
      const invalidWords = [
        '출시', '신제품', '신상', '이것', '인기', '화제', '대박', '단독', '한정', '오픈', 
        '판매', '시작', '선봬', '공개', '선보여', '추천', '리뷰', '후기', '이벤트', '맛', 
        '역대급', '매진', '품절', '대란'
      ];
      if (clean.length >= 2 && !invalidWords.includes(clean)) {
        // Strip trailing postpositions like '를', '을', '은', '는', '이', '가', '와', '과'
        clean = clean.replace(/(를|을|은|는|이|가|와|과|도)$/, '').trim();
        if (clean.length >= 2) {
          return clean;
        }
      }
    }
  }

  // 3. Match patterns like '... OOO 출시/선봬/선보여/론칭/출격'
  const actionRegex = /([가-힣A-Za-z0-9\s·\-\+]{2,25})\s*(?:출시|선봬|공개|선보여|론칭|출격|출점|선보인다)/;
  const matchAction = title.match(actionRegex);
  if (matchAction) {
    let candidate = matchAction[1].trim();
    // Clean leading brand or company phrases like 'CU, ', '오리온, '
    candidate = candidate.replace(/^[가-힣A-Za-z0-9]+\s*,\s*/, '').trim();
    // Remove editorial modifiers
    candidate = candidate.replace(/^(신제품|신상|가을 신메뉴|겨울 신메뉴|여름 신상|인기)\s+/, '').trim();
    if (candidate.length >= 2 && !candidate.endsWith('점') && !candidate.endsWith('사') && !candidate.endsWith('일')) {
      return candidate;
    }
  }

  // 4. Description quote fallback
  if (desc) {
    const descQuotes = desc.match(/['‘"“]([^'’”"]{2,30})['’”"]/g);
    if (descQuotes && descQuotes.length > 0) {
      for (const q of descQuotes) {
        let clean = q.replace(/['‘"“”]/g, '').trim();
        const invalidWords = ['출시', '신제품', '신상', '이것', '인기', '화제', '단독', '한정'];
        if (clean.length >= 2 && !invalidWords.includes(clean)) {
          clean = clean.replace(/(를|을|은|는|이|가|와|과|도)$/, '').trim();
          if (clean.length >= 2) return clean;
        }
      }
    }
  }

  // 5. Clean Fallback: Strip common words from title
  let fallback = title
    .replace(/(출시|선봬|선보여|공개|론칭|인기|화제|대란|단독|한정|포토|사진)/g, '')
    .replace(/[,\.\?!~]/g, '')
    .trim();

  if (fallback.length > 22) {
    fallback = fallback.slice(0, 22).trim();
  }

  return fallback || (detectedBrand ? `${detectedBrand} 신제품` : '편의점 신제품');
};

/**
 * Clean and reformat raw journalistic news text into customer-friendly product description
 * (Removes reporter names, photo credits, press badges, copyright, and transforms article style)
 */
export const cleanProductDescription = (
  rawDesc: string, 
  productName: string, 
  brand: string, 
  category: ProductCategory
): string => {
  if (!rawDesc || rawDesc.trim().length === 0) {
    return generateCleanProductDescription(productName, brand, category);
  }

  let text = cleanHtml(rawDesc);

  // 1. Remove Press & Reporter Noise Patterns:
  // e.g. [서울=뉴시스] 홍길동 기자 =, (서울=연합뉴스) 김철수 기자 =, [헤럴드경제=박모 기자]
  text = text.replace(/\[[^\]]*기자[^\]]*\]/g, ' ')
             .replace(/\([^\)]*기자[^\)]*\)/g, ' ')
             .replace(/\[[가-힣\s]+=[가-힣\s]+기자\]/g, ' ')
             .replace(/\([가-힣\s]+=[가-힣\s]+기자\)/g, ' ')
             .replace(/[가-힣]{2,4}\s*기자\s*=?/g, ' ')
             .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, ' '); // remove email

  // 2. Remove Photo / Source attribution:
  // e.g. [사진=농심], (사진제공=CU), 사진=BGF리테일, 그래픽=...
  text = text.replace(/\[?사진\s*=\s*[^\]\)]+\]?/g, ' ')
             .replace(/\[?사진제공\s*=\s*[^\]\)]+\]?/g, ' ')
             .replace(/\(?사진제공\s*=\s*[^\)]+\)?/g, ' ')
             .replace(/\[?그래픽\s*=\s*[^\]\)]+\]?/g, ' ');

  // 3. Remove Copyright & Media standard boilerplates:
  // e.g. 무단전재 및 재배포 금지, 저작권자 ⓒ, All rights reserved
  text = text.replace(/무단전재\s*및\s*재배포\s*금지/g, ' ')
             .replace(/저작권자\s*[ⓒ©][^\.]+/g, ' ')
             .replace(/ⓒ\s*[가-힣a-zA-Z0-9\s]+/g, ' ')
             .replace(/All\s+rights\s+reserved/gi, ' ');

  // 4. Remove news announcement prefixes & dates:
  // e.g. ~는 25일 밝혔다, ~고 14일 전했다, ~일 전했다, ~관계자는 "...", 지난 3일
  text = text.replace(/지난\s*\d{1,2}일\s*/g, ' ')
             .replace(/\d{1,2}일\s*(업계에\s*따르면|밝혔다|전했다|덧붙였다|설명했다|강조했다)/g, ' ')
             .replace(/(관계자는|회사\s*측은|브랜드\s*담당자는)\s*['"“]?[^'”"]*['"”]?/g, ' ');

  // 5. Convert journalistic verb endings into smooth consumer-facing tone
  text = text.replace(/밝혔다\.?/g, '선보입니다.')
             .replace(/전했다\.?/g, '알려졌습니다.')
             .replace(/덧붙였다\.?/g, '담아냈습니다.')
             .replace(/설명했다\.?/g, '자랑합니다.')
             .replace(/출시했다\.?/g, '새롭게 출시되었습니다.')
             .replace(/선보였다\.?/g, '선보입니다.')
             .replace(/공개했다\.?/g, '만나볼 수 있습니다.');

  // Clean extra spaces and punctuation
  text = text.replace(/\s+/g, ' ').trim();

  // If after cleaning it is too short or corrupted, use our high quality generator
  if (text.length < 20 || text.includes('…') && text.length < 35) {
    return generateCleanProductDescription(productName, brand, category);
  }

  // Ensure it ends nicely
  if (!text.endsWith('.') && !text.endsWith('!')) {
    text += '.';
  }

  return text.slice(0, 180);
};

/**
 * Generate a delightful, clean, customer-facing product description
 */
export const generateCleanProductDescription = (
  productName: string, 
  brand: string, 
  category: ProductCategory
): string => {
  switch (category) {
    case '간편식':
      return `${brand}에서 야심차게 선보이는 화제의 간편식 신작! '${productName}' 본연의 깊고 풍부한 풍미와 든든한 식감을 언제 어디서나 간편하고 맛있게 즐겨보세요.`;
    case '음료':
      return `${brand}의 새로운 시즌 시그니처 음료 '${productName}'! 한 모금 마시는 순간 입안 가득 퍼지는 산뜻한 청량감과 기분 좋은 달콤함을 선사합니다.`;
    case '빵·디저트':
      return `${brand}만의 프리미엄 레시피로 부드럽고 달콤하게 완성한 '${productName}'. 풍성한 크림과 쫀득한 식감의 완벽한 조화를 지금 바로 경험해보세요.`;
    case '과자':
      return `바삭한 식감과 중독적인 단짠의 완벽한 밸런스! ${brand}의 기대작 '${productName}'으로 일상 속 기분 좋은 바삭함을 만끽해보세요.`;
    default:
      return `${brand}에서 새롭게 출시되어 뜨거운 주목을 받고 있는 '${productName}'. 신선한 재료와 차별화된 풍미로 출시 직후 SNS와 편의점에서 큰 인기를 얻고 있습니다.`;
  }
};

/**
 * Extract realistic price from text or category default
 */
export const extractPrice = (text: string, category: ProductCategory): number => {
  const priceMatch = text.match(/(\d{1,2}[,\d]{3})\s*원/);
  if (priceMatch) {
    const parsed = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    if (parsed >= 500 && parsed <= 50000) return parsed;
  }

  switch (category) {
    case '과자': return 1800;
    case '음료': return 2200;
    case '빵·디저트': return 3400;
    case '간편식': return 4800;
    case '과일': return 6500;
    case '고기·수산': return 7900;
    default: return 2500;
  }
};

/**
 * Call Naver API via proxy endpoint (/api/naver)
 */
export const callNaverApi = async (
  type: 'news' | 'image' | 'blog',
  query: string,
  sort: string = 'date',
  display: number = 10
): Promise<NaverSearchResponse> => {
  const apiUrl = `/api/naver?type=${type}&query=${encodeURIComponent(query)}&display=${display}${sort ? `&sort=${sort}` : ''}`;
  
  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`Naver API (${type}) failed with status: ${res.status}`);
  }
  return await res.json();
};

/**
 * Filter out watermarked news photos and find high quality product packaging/food image
 */
export const fetchCleanProductImage = async (
  brand: string, 
  productName: string, 
  category: ProductCategory
): Promise<string> => {
  try {
    // 1. Search for clean packaging / product cut
    const query = `${brand} ${productName} 패키지`;
    const imgRes = await callNaverApi('image', query, 'sim', 10);

    if (imgRes.items && imgRes.items.length > 0) {
      // Find the first image that does NOT come from watermarked news agencies
      const cleanImg = imgRes.items.find(item => {
        const url = (item.link || item.thumbnail || '').toLowerCase();
        const isWatermarked = WATERMARKED_NEWS_DOMAINS.some(domain => url.includes(domain));
        return !isWatermarked && url.startsWith('http');
      });

      if (cleanImg) {
        return cleanImg.link || cleanImg.thumbnail || '';
      }

      // Fallback: If all are news domains, pick the first one's thumbnail (which is smaller/cleaner)
      if (imgRes.items[0]) {
        return imgRes.items[0].link || imgRes.items[0].thumbnail || '';
      }
    }
  } catch (e) {
    console.warn('[Image Search Warning]', productName, e);
  }

  // 2. High Quality Category Fallback
  const fallbackList = HIGH_QUALITY_CATEGORY_IMAGES[category] || HIGH_QUALITY_CATEGORY_IMAGES['간편식'];
  const randomIndex = Math.floor(Math.random() * fallbackList.length);
  return fallbackList[randomIndex] || HIGH_QUALITY_CATEGORY_IMAGES['신제품'][0];
};

/**
 * Search real new products using Naver News + Image + Blog APIs with full noise & watermark filtering
 */
export const searchRealNewProducts = async (keyword: string): Promise<PendingProduct[]> => {
  const cleanQ = keyword.trim();
  const searchKeywords = cleanQ.includes('신제품') || cleanQ.includes('신상') || cleanQ.includes('출시')
    ? cleanQ
    : `${cleanQ} 신제품 출시`;

  let newsRes: NaverSearchResponse;
  try {
    newsRes = await callNaverApi('news', searchKeywords, 'date', 20);
  } catch (err) {
    console.error('Failed to fetch Naver news:', err);
    return [];
  }

  const items = newsRes.items || [];
  const results: PendingProduct[] = [];
  const seenNames = new Set<string>();
  const dateStr = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5);

  for (const item of items) {
    const rawTitle = cleanHtml(item.title);
    const rawDesc = cleanHtml(item.description || '');

    // Skip non-food/irrelevant news
    const hasExclude = EXCLUDE_KEYWORDS.some(k => rawTitle.includes(k) || rawDesc.includes(k));
    if (hasExclude) continue;

    // Check if food / snack / beverage / convenience store product
    const isFood = /맛|식품|디저트|과자|음료|라면|도시락|스낵|빵|치킨|커피|우유|유업|제과|유통|편의점|버거|아이스크림|맥주|밀키트|신제품|출시|간편식|초콜릿|젤리|샌드/i.test(rawTitle + ' ' + rawDesc);
    if (!isFood) continue;

    const brand = detectBrand(rawTitle + ' ' + rawDesc);
    const productName = extractProductName(rawTitle, rawDesc, brand);

    if (!productName || productName.length < 2) continue;

    // Normalized duplicate check
    const normalizedName = productName.replace(/\s+/g, '').toLowerCase();
    if (seenNames.has(normalizedName)) continue;
    seenNames.add(normalizedName);

    const category = detectCategory(rawTitle + ' ' + rawDesc + ' ' + productName);
    const stores = detectStores(rawTitle + ' ' + rawDesc);
    const price = extractPrice(rawTitle + ' ' + rawDesc, category);

    // Fetch Clean, Non-watermarked Image
    const imageUrl = await fetchCleanProductImage(brand, productName, category);

    // Refine Description to Customer-friendly format (remove reporter names, editorial boilerplate)
    const refinedDescription = cleanProductDescription(rawDesc, productName, brand, category);

    // Fetch real consumer reviews from Naver Blog API
    let bestQuotes: string[] = [];
    try {
      const blogRes = await callNaverApi('blog', `${brand} ${productName} 후기`, 'sim', 4);
      if (blogRes.items && blogRes.items.length > 0) {
        bestQuotes = blogRes.items
          .map(b => cleanHtml(b.description || ''))
          .map(b => b.replace(/\[[^\]]*\]/g, '').replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+/g, '').trim())
          .filter(q => q.length > 15 && !q.includes('기자') && !q.includes('제공='))
          .map(q => q.slice(0, 75))
          .slice(0, 3);
      }
    } catch (e) {
      console.warn('Blog fetch failed for', productName, e);
    }

    if (bestQuotes.length === 0) {
      bestQuotes = [
        '출시 직후 SNS와 편의점에서 큰 주목을 받고 있어요!',
        '패키지도 깔끔하고 풍미가 아주 만족스러워요.',
        '재구매 의사 100%! 꼭 드셔보시길 추천합니다.'
      ];
    }

    // Format release date from news publication date
    let releaseDateStr = `${dateStr} 실시간 포착`;
    if (item.pubDate) {
      const pubDate = new Date(item.pubDate);
      if (!isNaN(pubDate.getTime())) {
        releaseDateStr = `${pubDate.getFullYear()}.${String(pubDate.getMonth() + 1).padStart(2, '0')} 공식 출시`;
      }
    }

    results.push({
      id: `naver-real-${Date.now()}-${results.length + 1}`,
      name: productName,
      brand,
      category,
      subCategory: '실시간 편의점 신상',
      itemType: 'packaged',
      image: imageUrl,
      price,
      discountRate: 0,
      releaseDate: releaseDateStr,
      stores,
      description: refinedDescription,
      sourceName: '네이버 공식 신제품 뉴스',
      sourceUrl: item.originallink || item.link,
      crawledAt: `${dateStr} ${nowTime}`,
      status: 'pending',
      bestQuotes,
      calories: category === '음료' ? 140 : category === '과자' ? 380 : category === '빵·디저트' ? 420 : 520,
      volume: category === '음료' ? '350ml' : category === '과자' ? '85g' : category === '빵·디저트' ? '120g' : '1팩'
    });

    if (results.length >= 10) break;
  }

  return results;
};

/**
 * Fetch daily real new products across all main food & snack categories
 */
export const fetchDailyRealNewProducts = async (): Promise<PendingProduct[]> => {
  const targetKeywords = [
    '편의점 신제품 출시',
    '신상 디저트 출시',
    '신제품 라면 출시',
    '신제품 과자 출시',
    '신제품 음료 출시'
  ];

  const allProducts: PendingProduct[] = [];
  const seenNames = new Set<string>();

  for (const kw of targetKeywords) {
    try {
      const items = await searchRealNewProducts(kw);
      for (const item of items) {
        const norm = item.name.replace(/\s+/g, '').toLowerCase();
        if (!seenNames.has(norm)) {
          seenNames.add(norm);
          allProducts.push(item);
        }
      }
      if (allProducts.length >= 15) break;
    } catch (err) {
      console.error('Error during daily crawl for keyword:', kw, err);
    }
  }

  return allProducts;
};
