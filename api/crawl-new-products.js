import https from 'https';
import http from 'http';
import querystring from 'querystring';
import { URL } from 'url';

/**
 * Non-food negative keywords (Strict filter to guarantee only FOOD items are collected)
 */
const NON_FOOD_KEYWORDS = [
  '칫솔', '치약', '가글', '리스테린', '치실', '구강', '초극세모', '미세모', '미니모', '탄력모', '페리오', '2080', '메디안', '오랄비', '죽염',
  '샴푸', '린스', '트리트먼트', '바디워시', '비누', '핸드워시', '클렌징', '폼클렌징', '스킨', '로션', '선크림', '선블록', '립밤', '수분크림', '마스크팩', '헤어팩',
  '면도기', '면도날', '쉐이빙', '왁스', '염색약', '헤어젤', '스프레이', '미스트',
  '생리대', '팬티라이너', '롱라이너', '오버나이트', '탐폰',
  '세탁세제', '섬유유연제', '주방세제', '퐁퐁', '락스', '페브리즈', '탈취제', '방향제', '제습제', '모기약', '에프킬라', '살충제', '홈키파', '세제',
  '건전지', '배터리', '충전기', '케이블', '이어폰', '보조배터리', '라이터', '부탄가스',
  '물티슈', '롤화장지', '키친타올', '화장지', '미용티슈', '각티슈', '위생팩', '지퍼백', '크린랩', '호일', '종이컵', '수세미', '고무장갑', '쓰레기봉투', '종량제',
  '스타킹', '양말', '우산', '우의', '핫팩', '손난로', '마스크', '대일밴드', '반창고', '붕대', '파스', '테이프', '커터칼', '딱풀', '물풀', '목공풀', '접착제', '본드', '볼펜', '노트'
];

export function isFoodProduct(name) {
  if (!name || typeof name !== 'string') return false;
  const cleanName = name.replace(/\s+/g, '').toLowerCase();
  for (const bad of NON_FOOD_KEYWORDS) {
    if (cleanName.includes(bad.toLowerCase())) {
      return false;
    }
  }
  return true;
}

export function detectFoodCategory(name) {
  const lower = name.toLowerCase();
  if (/아이스크림|빙과|하드|콘|설레임|더위사냥|월드콘|부라보|바나나맛|폴라포|스크류바|파르페|젤라또/.test(lower)) {
    return '아이스크림';
  }
  if (/음료|커피|우유|라떼|에이드|주스|콜라|스프라이트|사이다|탄산|워터|차|티|수|드링크|맥콜|헛개|블랙보리|파워에이드|토레타|밀크티|스무디/.test(lower)) {
    return '음료';
  }
  if (/빵|디저트|케이크|베이커리|샌드|롤|크림빵|마카롱|도넛|와플|카스테라|타르트/.test(lower)) {
    return '빵·디저트';
  }
  if (/과자|스낵|쿠키|초코|캔디|사탕|젤리|칩|껌|카라멜|파이|리콜라|비스킷|팝콘/.test(lower)) {
    return '과자';
  }
  if (/도시락|김밥|삼각|버거|핫바|소시지|맥스봉|만두|볶음밥|햇반|죽|탕|국|찌개|라면|우동|짬뽕|짜장|간편|치킨|피자|떡볶이|닭가슴살/.test(lower)) {
    return '간편식';
  }
  return '간편식';
}

export function detectFoodSubCategory(name, category) {
  const lower = name.toLowerCase();
  if (category === '간편식') {
    if (/라면|면|우동|짬뽕|짜장/.test(lower)) return '라면/면류';
    if (/도시락|덮밥|볶음밥|햇반|죽/.test(lower)) return '도시락/밥류';
    if (/핫바|소시지|맥스봉|후랑크/.test(lower)) return '핫바/육가공';
    if (/김밥|삼각|버거|샌드위치/.test(lower)) return '삼각김밥/버거';
    if (/만두|피자|치킨|떡볶이/.test(lower)) return '간식/냉동';
    if (/닭가슴살|프로틴/.test(lower)) return '단백질/헬스';
    return '간편식';
  }
  if (category === '음료') {
    if (/커피|라떼|아메리카노|에스프|콜드브루/.test(lower)) return '커피';
    if (/우유|두유|요거트|액티비아/.test(lower)) return '유제품';
    if (/콜라|사이다|스프라이트|탄산/.test(lower)) return '탄산음료';
    if (/차|티|보리|헛개/.test(lower)) return '차음료';
    if (/주스|에이드|워터/.test(lower)) return '주스/워터';
    return '음료';
  }
  if (category === '과자') {
    if (/초코|카카오/.test(lower)) return '초콜릿';
    if (/캔디|사탕|젤리|구미/.test(lower)) return '캔디/젤리';
    if (/칩|스낵|나초|팝콘/.test(lower)) return '스낵';
    if (/쿠키|비스킷|파이/.test(lower)) return '비스킷/파이';
    return '스낵';
  }
  return category;
}

/**
 * Clean CU product name & infer brand
 */
export function cleanCuProductName(rawName) {
  let brand = 'CU';
  let name = rawName.trim();

  // Pattern: 도)돈까스정식, 김)삼각김밥, 햄)치킨버거, 주)주먹밥
  const prefixMatch = name.match(/^([도김햄주면샌])\)(.*)$/);
  if (prefixMatch) {
    name = prefixMatch[2].trim();
  } else {
    const generalBrandMatch = name.match(/^([a-zA-Z0-9가-힣]+)\)(.*)$/);
    if (generalBrandMatch) {
      brand = generalBrandMatch[1].trim();
      name = generalBrandMatch[2].trim();
    }
  }

  // Normalize common brands
  if (brand === 'CJ') brand = 'CJ제일제당';
  else if (brand === '코카') brand = '코카콜라';
  else if (brand === '롯데') brand = '롯데웰푸드';
  else if (brand === '동원') brand = '동원에프앤비';
  else if (brand === '하이트') brand = '하이트진로';
  else if (brand === '동서') brand = '동서식품';

  return { brand, name, fullName: rawName.trim() };
}

/**
 * HTTP/HTTPS POST or GET request helper
 */
function requestHttp(options, postData = null) {
  return new Promise((resolve, reject) => {
    const isHttps = options.protocol === 'https:' || (!options.protocol && options.port !== 80);
    const client = isHttps ? https : http;

    const req = client.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

/**
 * Crawl CU new products from BGF Retail website
 * URL: https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N#
 */
async function crawlCuNewProducts(pageIndex = 1) {
  const postData = querystring.stringify({
    pageIndex: pageIndex,
    listType: 1,
    searchMainCategory: 10,
    searchSubCategory: '',
    searchCondition: 'setA',
    searchUseYn: '',
    gdIdx: 0,
    codeParent: 10,
    user_id: ''
  });

  const options = {
    hostname: 'cu.bgfretail.com',
    path: '/product/productAjax.do',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N'
    }
  };

  const { data } = await requestHttp(options, postData);
  const items = [];

  const itemRegex = /<li[^>]*class=\"prod_list\"[^>]*>([\s\S]*?)<\/li>/gi;
  let match;

  while ((match = itemRegex.exec(data)) !== null) {
    const itemHtml = match[1];

    // Image URL
    const imgMatch = itemHtml.match(/<img[^>]*src=\"([^\"]+)\"[^>]*class=\"prod_img\"/i) || itemHtml.match(/<img[^>]*src=\"([^\"]+)\"/i);
    let image = imgMatch ? imgMatch[1] : '';
    if (image.startsWith('//')) image = 'https:' + image;
    else if (image.startsWith('/')) image = 'https://cu.bgfretail.com' + image;

    // Title / Raw Name
    const nameMatch = itemHtml.match(/<div[^>]*class=\"name\"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/i);
    const rawName = nameMatch ? nameMatch[1].trim() : '';

    // Price
    const priceMatch = itemHtml.match(/<div[^>]*class=\"price\"[^>]*>[\s\S]*?<strong>([\s\S]*?)<\/strong>/i);
    let price = 0;
    if (priceMatch) {
      price = parseInt(priceMatch[1].replace(/[^0-9]/g, ''), 10) || 0;
    }

    // CU Product ID
    const idMatch = itemHtml.match(/view\((\d+)\)/);
    const cuId = idMatch ? idMatch[1] : '';

    const isNew = /class=\"new\"/i.test(itemHtml);
    const isBest = /class=\"best\"/i.test(itemHtml);

    if (rawName) {
      items.push({
        cuId,
        rawName,
        price,
        image,
        isNew,
        isBest
      });
    }
  }

  const hasNextPage = /javascript:nextPage/i.test(data);

  return { items, hasNextPage };
}

/**
 * Format raw CU item into Sinsangpick PendingProduct shape
 */
function formatCuProduct(raw, index) {
  const { brand, name, fullName } = cleanCuProductName(raw.rawName);
  const category = detectFoodCategory(raw.rawName);
  const subCategory = detectFoodSubCategory(raw.rawName, category);

  const today = new Date().toISOString().split('T')[0];
  const cuDetailUrl = raw.cuId 
    ? `https://cu.bgfretail.com/product/view.do?category=product&gdIdx=${raw.cuId}`
    : 'https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N';

  return {
    id: `cu_new_${raw.cuId || Date.now()}_${index}`,
    externalId: raw.cuId || '',
    name: fullName,
    cleanName: name,
    brand: brand || 'CU',
    category: category,
    subCategory: subCategory,
    price: raw.price || 0,
    image: raw.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
    releaseDate: today,
    stores: ['CU'],
    isNew: raw.isNew ?? true,
    isBest: raw.isBest ?? false,
    description: `[CU 공식 신상품] 편의점 CU에 새로 등록된 따끈따끈한 ${category} 신제품입니다.`,
    sourceName: 'CU 공식 신제품관',
    sourceUrl: cuDetailUrl,
    crawledAt: new Date().toISOString()
  };
}

/**
 * Main API Handler for /api/crawl-new-products
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let bodyData = {};
    if (typeof req.body === 'string' && req.body) {
      try {
        bodyData = JSON.parse(req.body);
      } catch (e) {
        bodyData = querystring.parse(req.body);
      }
    } else if (req.body && typeof req.body === 'object') {
      bodyData = req.body;
    }

    const query = req.query || {};
    const url = bodyData.url || query.url || 'https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N#';
    const maxPages = parseInt(bodyData.maxPages || query.maxPages || '1', 10);
    const startPage = parseInt(bodyData.page || query.page || '1', 10);
    const channel = (bodyData.channel || query.channel || 'CU').toUpperCase();

    let allRawItems = [];
    let hasMore = false;

    // If CU URL or channel
    if (url.includes('cu.bgfretail.com') || channel === 'CU') {
      for (let p = startPage; p < startPage + maxPages; p++) {
        const { items, hasNextPage } = await crawlCuNewProducts(p);
        allRawItems.push(...items);
        hasMore = hasNextPage;
        if (!hasNextPage) break;
      }
    } else {
      // Default fallback to CU scraper if unspecified
      const { items, hasNextPage } = await crawlCuNewProducts(startPage);
      allRawItems.push(...items);
      hasMore = hasNextPage;
    }

    // Filter only food products
    const foodItems = [];
    let nonFoodCount = 0;

    for (let i = 0; i < allRawItems.length; i++) {
      const item = allRawItems[i];
      if (isFoodProduct(item.rawName)) {
        foodItems.push(formatCuProduct(item, i));
      } else {
        nonFoodCount++;
      }
    }

    return res.status(200).json({
      success: true,
      url,
      channel,
      totalParsed: allRawItems.length,
      count: foodItems.length,
      excludedNonFood: nonFoodCount,
      hasMore,
      items: foodItems,
      crawledAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[crawl-new-products] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '신제품 크롤링 중 오류가 발생했습니다.'
    });
  }
}
