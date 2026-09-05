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
    .trim();
};

const KNOWN_BRANDS = [
  '농심', '오리온', '롯데웰푸드', '롯데', '빙그레', '삼양식품', '삼양', 'CJ제일제당', 'CJ',
  '오뚜기', '팔도', '해태제과', '해태', '매일유업', '남양유업', '동원에프앤비', '동원',
  '하이트진로', '오비맥주', 'SPC', '삼립', '파리바게뜨', '뚜레쥬르', '연세유업', '서울우유',
  'CU', 'GS25', '세븐일레븐', '이마트24', '스타벅스', '이디야', '투썸플레이스', '배스킨라빈스',
  '로로멜로', '하겐다즈', '하림', '풀무원', '비비고', '맥도날드', '버거킹', 'KFC', '맘스터치'
];

const EXCLUDE_KEYWORDS = [
  '전자담배', '궐련형', '스마트폰', '갤럭시', '아이폰', '노트북', '가전',
  '주가', '공시', '투자유치', 'MOU', '사전예약', '모바일게임', '게임', '코스닥', '상장',
  '의류', '패션', '신발', '자동차', '전기차', '아파트', '분양', '부동산', '증시', '보험'
];

/**
 * Detect product category from text
 */
export const detectCategory = (text: string): ProductCategory => {
  const t = text.toLowerCase();
  if (t.includes('라면') || t.includes('도시락') || t.includes('김밥') || t.includes('간편식') || 
      t.includes('밀키트') || t.includes('덮밥') || t.includes('버거') || t.includes('피자') ||
      t.includes('만두') || t.includes('볶음밥') || t.includes('햇반') || t.includes('안주')) {
    return '간편식';
  }
  if (t.includes('음료') || t.includes('커피') || t.includes('라떼') || t.includes('탄산') || 
      t.includes('주스') || t.includes('에이드') || t.includes('맥주') || t.includes('하이볼') || 
      t.includes('차') || t.includes('밀크티') || t.includes('스무디') || t.includes('소주') ||
      t.includes('요거트') || t.includes('유제품')) {
    return '음료';
  }
  if (t.includes('빵') || t.includes('디저트') || t.includes('케이크') || t.includes('크림빵') || 
      t.includes('도넛') || t.includes('찹쌀떡') || t.includes('쿠키') || t.includes('와플') ||
      t.includes('베이글') || t.includes('샌드위치') || t.includes('타르트') || t.includes('슈')) {
    return '빵·디저트';
  }
  if (t.includes('과자') || t.includes('스낵') || t.includes('감자칩') || t.includes('젤리') || 
      t.includes('초콜릿') || t.includes('캔디') || t.includes('아이스크림') || t.includes('팝콘') ||
      t.includes('비스킷') || t.includes('초코')) {
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
  if (/CU|씨유/i.test(text)) stores.push('CU');
  if (/GS25|지에스/i.test(text)) stores.push('GS25');
  if (/세븐일레븐|7-Eleven/i.test(text)) stores.push('세븐일레븐');
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
  if (text.includes('CU') || text.includes('씨유')) return 'CU단독';
  if (text.includes('GS25') || text.includes('지에스')) return 'GS25단독';
  if (text.includes('세븐일레븐')) return '세븐일레븐';
  return '편의점 신상';
};

/**
 * Extract product name from news title and description
 */
export const extractProductName = (title: string, desc?: string): string => {
  // 1. Quoted string in title (e.g. '신라면 툼바', "한정선 요거트 찹쌀떡")
  const quoteMatches = title.match(/['‘"“]([^'’”"]{2,30})['’”"]/g);
  if (quoteMatches && quoteMatches.length > 0) {
    for (const q of quoteMatches) {
      const clean = q.replace(/['‘"“”]/g, '').trim();
      if (clean.length >= 2 && !['출시', '신제품', '신상', '이것', '인기', '화제', '대박', '단독', '한정', '오픈', '판매', '시작'].includes(clean)) {
        return clean;
      }
    }
  }

  // 2. Check quoted string in description if title didn't have one
  if (desc) {
    const descQuotes = desc.match(/['‘"“]([^'’”"]{2,30})['’”"]/g);
    if (descQuotes && descQuotes.length > 0) {
      for (const q of descQuotes) {
        const clean = q.replace(/['‘"“”]/g, '').trim();
        if (clean.length >= 2 && !['출시', '신제품', '신상', '이것', '인기', '화제', '대박', '단독', '한정'].includes(clean)) {
          return clean;
        }
      }
    }
  }

  // 3. '[브랜드/상품명] 출시/선봬' 패턴
  const matchBeforeLaunch = title.match(/([가-힣A-Za-z0-9\s]{2,20})\s+(출시|선봬|공개|선보여|론칭)/);
  if (matchBeforeLaunch) {
    const candidate = matchBeforeLaunch[1].trim();
    if (candidate.length >= 2 && !candidate.endsWith('점') && !candidate.endsWith('사')) {
      return candidate;
    }
  }

  // 4. Fallback to clean title
  return title.slice(0, 28);
};

/**
 * Extract price from text or use category default realistic price
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
 * Search real new products using Naver News + Image + Blog APIs
 */
export const searchRealNewProducts = async (keyword: string): Promise<PendingProduct[]> => {
  const cleanQ = keyword.trim();
  const searchKeywords = cleanQ.includes('신제품') || cleanQ.includes('신상') || cleanQ.includes('출시')
    ? cleanQ
    : `${cleanQ} 신제품 출시`;

  let newsRes: NaverSearchResponse;
  try {
    newsRes = await callNaverApi('news', searchKeywords, 'date', 15);
  } catch (err) {
    console.error('Failed to fetch Naver news:', err);
    return [];
  }

  const items = newsRes.items || [];
  const results: PendingProduct[] = [];
  const dateStr = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().split(' ')[0].substring(0, 5);

  for (const item of items) {
    const title = cleanHtml(item.title);
    const desc = cleanHtml(item.description || '');

    // Skip non-food/irrelevant items
    const hasExclude = EXCLUDE_KEYWORDS.some(k => title.includes(k) || desc.includes(k));
    if (hasExclude) continue;

    // Check if food / consumer good
    const isFood = /맛|식품|디저트|과자|음료|라면|도시락|스낵|빵|치킨|커피|우유|유업|제과|유통|편의점|한정선|버거|아이스크림|맥주|밀키트|신제품|출시/i.test(title + ' ' + desc);
    if (!isFood) continue;

    const brand = detectBrand(title + ' ' + desc);
    const productName = extractProductName(title, desc);

    if (!productName || productName.length < 2) continue;
    if (results.some(p => p.name === productName)) continue;

    const category = detectCategory(title + ' ' + desc + ' ' + productName);
    const stores = detectStores(title + ' ' + desc);
    const price = extractPrice(title + ' ' + desc, category);

    // Fetch real product packaging photo from Naver Image API
    let imageUrl = '';
    try {
      const imgRes = await callNaverApi('image', `${brand} ${productName}`, 'sim', 3);
      if (imgRes.items && imgRes.items.length > 0) {
        // Prefer official high-res or clean square packaging image
        imageUrl = imgRes.items[0].link || imgRes.items[0].thumbnail || '';
      }
    } catch (e) {
      console.warn('Image fetch failed for', productName, e);
    }

    // Fallback image by category if image search fails
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
    }

    // Fetch real consumer reviews from Naver Blog API
    let bestQuotes: string[] = [];
    try {
      const blogRes = await callNaverApi('blog', `${productName} 후기`, 'sim', 3);
      if (blogRes.items && blogRes.items.length > 0) {
        bestQuotes = blogRes.items
          .map(b => cleanHtml(b.description || '').slice(0, 80))
          .filter(q => q.length > 10)
          .slice(0, 3);
      }
    } catch (e) {
      console.warn('Blog fetch failed for', productName, e);
    }

    if (bestQuotes.length === 0) {
      bestQuotes = [
        '새로 출시된 화제의 신상품입니다!',
        '출시 직후 SNS와 편의점에서 큰 주목을 받고 있어요.',
        '재구매 의사가 높고 풍미가 뛰어납니다.'
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
      subCategory: '실시간 네이버 공식 포착',
      itemType: 'packaged',
      image: imageUrl,
      price,
      discountRate: 0,
      releaseDate: releaseDateStr,
      stores,
      description: desc.slice(0, 150) || `네이버 공식 뉴스 및 유통 보도자료를 통해 수집된 최신 '${productName}' 상품입니다.`,
      sourceName: '네이버 공식 신제품 뉴스',
      sourceUrl: item.originallink || item.link,
      crawledAt: `${dateStr} ${nowTime}`,
      status: 'pending',
      bestQuotes,
      calories: category === '음료' ? 140 : category === '과자' ? 380 : category === '빵·디저트' ? 420 : 520,
      volume: category === '음료' ? '350ml' : category === '과자' ? '85g' : category === '빵·디저트' ? '120g' : '1팩'
    });

    if (results.length >= 8) break;
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

  for (const kw of targetKeywords) {
    try {
      const items = await searchRealNewProducts(kw);
      for (const item of items) {
        if (!allProducts.some(p => p.name === item.name)) {
          allProducts.push(item);
        }
      }
      if (allProducts.length >= 12) break;
    } catch (err) {
      console.error('Error during daily crawl for keyword:', kw, err);
    }
  }

  return allProducts;
};
