/**
 * 신제품 수집 소스 (서버 전용)
 *  - CU 공식 홈페이지 신상품 코너
 *  - 세븐일레븐 공식 홈페이지 신상품 코너
 *  - 네이버 뉴스 (신제품 출시 기사에서 따옴표로 표기된 상품명 추출)
 *
 * 모든 함수는 pending_products 테이블 행(snake_case) 배열을 반환합니다.
 * 확인되지 않은 값(가격, 용량, 후기 등)은 지어내지 않고 비워 둡니다.
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const NON_FOOD_KEYWORDS = [
  '칫솔', '치약', '가글', '리스테린', '치실', '구강', '초극세모', '미세모', '미니모', '탄력모', '페리오', '2080', '메디안', '오랄비', '죽염',
  '샴푸', '린스', '트리트먼트', '바디워시', '비누', '핸드워시', '클렌징', '폼클렌징', '스킨', '로션', '선크림', '선블록', '립밤', '수분크림', '마스크팩', '헤어팩',
  '면도기', '면도날', '쉐이빙', '왁스', '염색약', '헤어젤', '스프레이', '미스트',
  '생리대', '팬티라이너', '롱라이너', '오버나이트', '탐폰',
  '세탁세제', '섬유유연제', '주방세제', '퐁퐁', '락스', '페브리즈', '탈취제', '방향제', '제습제', '모기약', '에프킬라', '살충제', '홈키파', '세제',
  '건전지', '배터리', '충전기', '케이블', '이어폰', '보조배터리', '라이터', '부탄가스',
  '물티슈', '롤화장지', '키친타올', '화장지', '미용티슈', '각티슈', '위생팩', '지퍼백', '크린랩', '호일', '종이컵', '수세미', '고무장갑', '쓰레기봉투', '종량제',
  '스타킹', '양말', '우산', '우의', '핫팩', '손난로', '마스크', '대일밴드', '반창고', '붕대', '파스', '테이프', '커터칼', '딱풀', '물풀', '목공풀', '접착제', '본드', '볼펜', '노트',
  '콘돔', '담배', '전자담배', '장난감', '피규어', '키링', '인형', '카드팩', '스티커북',
  '언더웨어', '속옷', '브라', '의류', '티셔츠', '패딩', '침구', '이불', '가전', '청소기', '화장품', '향수', '텀블러', '굿즈'
];

export function isFoodProduct(name) {
  if (!name || typeof name !== 'string') return false;
  const clean = name.replace(/\s+/g, '').toLowerCase();
  return !NON_FOOD_KEYWORDS.some((bad) => clean.includes(bad.toLowerCase()));
}

export function detectFoodCategory(text) {
  const lower = String(text || '').toLowerCase();
  if (/아이스크림|빙과|설레임|더위사냥|월드콘|부라보|폴라포|스크류바|파르페|젤라또|빙수|파인트/.test(lower)) return '아이스크림';
  if (/버거|치킨|피자|핫도그|도시락|김밥|삼각|핫바|소시지|만두|볶음밥|햇반|덮밥|찌개|라면|우동|짬뽕|짜장|파스타|떡볶이|닭가슴살|샐러드|샌드위치|죽$/.test(lower)) return '간편식';
  if (/빵|디저트|케이크|베이커리|샌드|크림롤|마카롱|도넛|도너츠|와플|카스테라|타르트|푸딩|휘낭시에|크루아상|베이글/.test(lower)) return '빵·디저트';
  if (/과자|스낵|쿠키|초코|초콜릿|캔디|사탕|젤리|칩|껌|카라멜|파이|비스킷|팝콘|크래커/.test(lower)) return '과자';
  if (/음료|커피|우유|라떼|에이드|주스|콜라|사이다|탄산|워터|드링크|밀크티|스무디|아메리카노|콜드브루|두유|요거트|콤부차|티백|맥주|하이볼|막걸리|소주|와인|위스키|라거|\d+\s?ml|\d+\s?l\b/.test(lower)) return '음료';
  return '간편식';
}

export function detectFoodSubCategory(text, category) {
  const lower = String(text || '').toLowerCase();
  if (category === '간편식') {
    if (/라면|면|우동|짬뽕|짜장|파스타/.test(lower)) return '라면/면류';
    if (/도시락|덮밥|볶음밥|햇반|죽/.test(lower)) return '도시락/밥류';
    if (/핫바|소시지|후랑크/.test(lower)) return '핫바/육가공';
    if (/김밥|삼각|샌드위치/.test(lower)) return '삼각김밥/샌드위치';
    return undefined;
  }
  if (category === '음료') {
    if (/커피|라떼|아메리카노|콜드브루/.test(lower)) return '커피';
    if (/우유|두유|요거트/.test(lower)) return '유제품';
    if (/콜라|사이다|탄산/.test(lower)) return '탄산음료';
    if (/맥주|하이볼|막걸리|소주/.test(lower)) return '주류';
    return undefined;
  }
  if (category === '과자') {
    if (/초코|초콜릿/.test(lower)) return '초콜릿';
    if (/캔디|사탕|젤리/.test(lower)) return '캔디/젤리';
    if (/칩|스낵|팝콘/.test(lower)) return '스낵';
    return undefined;
  }
  return undefined;
}

const BRAND_ALIASES = {
  CJ: 'CJ제일제당', 코카: '코카콜라', 롯데: '롯데웰푸드', 동원: '동원F&B', 하이트: '하이트진로',
  동서: '동서식품', 빙그레: '빙그레', 매일: '매일유업', 남양: '남양유업', 서울: '서울우유',
  해태: '해태제과', 크라운: '크라운제과', 삼양: '삼양식품', 오리온: '오리온', 농심: '농심',
  오뚜기: '오뚜기', 팔도: '팔도', 풀무원: '풀무원', 하겐: '하겐다즈',
};

/**
 * "도)풍성한가위정찬도시락" / "빙그레)바나나맛우유240ml" / "PB)바닐라라떼" 형태의 편의점 표기 정리.
 * 한 글자 접두어(도·김·햄·샌·삼·면·주 등)는 상품 분류 기호이므로 브랜드로 쓰지 않습니다.
 */
export function cleanStoreProductName(rawName, storeBrand) {
  const raw = String(rawName || '').replace(/\s+/g, ' ').trim();
  const match = raw.match(/^([^()\s]{1,10})\)\s*(.+)$/);
  if (!match) return { name: raw, brand: storeBrand };

  const prefix = match[1];
  const name = match[2].trim();
  if (prefix.length <= 1 || /^(PB|HEYROO|헤이루|세븐셀렉트|7-?select)$/i.test(prefix)) {
    return { name, brand: storeBrand };
  }
  return { name, brand: BRAND_ALIASES[prefix] || prefix };
}

/** 상품명 중복 비교용 정규화 (접두어·괄호·공백 제거) */
export function normalizeProductName(name) {
  return String(name || '')
    .replace(/^[^()\s]{1,10}\)/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function extractVolume(name) {
  const m = String(name || '').match(/(\d+(?:\.\d+)?\s?(?:ml|l|g|kg|입|개입|t|p))\s*$/i);
  return m ? m[1].replace(/\s+/g, '') : null;
}

function todayKst() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];
}

async function fetchText(url, init = {}, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { 'User-Agent': UA, ...(init.headers || {}) },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function toStoreRow({ idPrefix, externalId, rawName, price, image, store, sourceName, sourceUrl, category: fixedCategory }) {
  const { name, brand } = cleanStoreProductName(rawName, store);
  const category = fixedCategory || detectFoodCategory(rawName);
  return {
    id: `${idPrefix}-${externalId}`,
    name,
    brand,
    category,
    sub_category: detectFoodSubCategory(rawName, category) || null,
    item_type: 'packaged',
    image: image || '',
    release_date: todayKst(),
    price: price || 0,
    discount_rate: 0,
    stores: [store],
    description: `${store} 공식 홈페이지 신상품 코너에 등록된 상품입니다.`,
    source_name: sourceName,
    source_url: sourceUrl,
    volume: extractVolume(name),
  };
}

/**
 * CU 공식 상품 목록 (https://cu.bgfretail.com/product/product.do?category=product)
 * 식품 대분류별 1페이지(최신 등록순 40개)에서 NEW 표시가 붙은 상품만 가져옵니다.
 */
const CU_MAIN_CATEGORIES = [
  // [searchMainCategory, 이름으로 분류가 애매할 때 쓸 기본 카테고리]
  ['10', '간편식'], // 간편식사
  ['20', '간편식'], // 즉석조리
  ['30', '과자'], // 과자류
  ['40', '아이스크림'],
  ['50', '간편식'], // 식품
  ['60', '음료'],
];

function resolveCuCategory(rawName, fallback) {
  if (fallback === '아이스크림' || fallback === '음료') return fallback;
  return detectFoodCategory(rawName) === '빵·디저트' ? '빵·디저트' : fallback;
}

export async function crawlCuNew() {
  const results = await Promise.allSettled(
    CU_MAIN_CATEGORIES.map(([code, fallback]) => crawlCuCategory(code, fallback))
  );
  const rows = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
  if (rows.length === 0) {
    const failed = results.find((r) => r.status === 'rejected');
    if (failed) throw failed.reason;
  }
  const seen = new Set();
  return rows.filter((row) => (seen.has(row.id) ? false : seen.add(row.id)));
}

async function crawlCuCategory(mainCategory, fallbackCategory) {
  const rows = [];
  {
    const body = new URLSearchParams({
      pageIndex: '1',
      listType: '1',
      searchMainCategory: mainCategory,
      searchSubCategory: '',
      searchCondition: 'setA',
      searchUseYn: '',
      gdIdx: '0',
      codeParent: mainCategory,
      user_id: '',
    }).toString();

    const html = await fetchText('https://cu.bgfretail.com/product/productAjax.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/html, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: 'https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N',
      },
      body,
    });

    const itemRegex = /<li[^>]*class="prod_list"[^>]*>([\s\S]*?)<\/li>/gi;
    let match;
    while ((match = itemRegex.exec(html)) !== null) {
      const itemHtml = match[1];
      if (!/class="new"/i.test(itemHtml)) continue;
      const nameMatch = itemHtml.match(/<div[^>]*class="name"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/i);
      const rawName = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
      const idMatch = itemHtml.match(/view\((\d+)\)/);
      if (!rawName || !idMatch || !isFoodProduct(rawName)) continue;

      const imgMatch = itemHtml.match(/<img[^>]*src="([^"]+)"/i);
      let image = imgMatch ? imgMatch[1] : '';
      if (image.startsWith('//')) image = 'https:' + image;
      else if (image.startsWith('/')) image = 'https://cu.bgfretail.com' + image;

      const priceMatch = itemHtml.match(/<div[^>]*class="price"[^>]*>[\s\S]*?<strong>([\s\S]*?)<\/strong>/i);
      const price = priceMatch ? parseInt(priceMatch[1].replace(/[^0-9]/g, ''), 10) || 0 : 0;

      rows.push(toStoreRow({
        idPrefix: 'cu',
        externalId: idMatch[1],
        rawName,
        price,
        image,
        store: 'CU',
        sourceName: 'CU 공식 신상품',
        sourceUrl: `https://cu.bgfretail.com/product/view.do?category=product&gdIdx=${idMatch[1]}`,
        category: resolveCuCategory(rawName, fallbackCategory),
      }));
    }
  }
  return rows;
}

/**
 * 세븐일레븐 공식 신상품 (https://www.7-eleven.co.kr/product/presentList.asp → 신상품 탭, pTab=8)
 */
export async function crawlSevenNew(pageSize = 60) {
  const html = await fetchText('https://www.7-eleven.co.kr/product/listMoreAjax.asp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      Referer: 'https://www.7-eleven.co.kr/product/presentList.asp',
    },
    body: `intPageSize=${pageSize}&pTab=8`,
  });

  const rows = [];
  const blocks = html.split(/<div class="pic_product">/i).slice(1);
  for (const block of blocks) {
    const nameMatch = block.match(/class="tit_product">([^<]+)</i);
    const idMatch = block.match(/fncGoView\('(\d+)'\)/);
    const rawName = nameMatch ? nameMatch[1].trim() : '';
    if (!rawName || !idMatch || !isFoodProduct(rawName)) continue;

    const imgMatch = block.match(/<img[^>]*src="([^"]+)"/i);
    let image = imgMatch ? imgMatch[1] : '';
    if (/product_list_01\.jpg/.test(image)) image = ''; // 사이트 기본(이미지 없음) 썸네일
    else if (image.startsWith('/')) image = 'https://www.7-eleven.co.kr' + image;

    const priceMatch = block.match(/class="price_list">\s*<span>([^<]+)</i);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/[^0-9]/g, ''), 10) || 0 : 0;

    rows.push(toStoreRow({
      idPrefix: 'seven',
      externalId: idMatch[1],
      rawName,
      price,
      image,
      store: '세븐일레븐',
      sourceName: '세븐일레븐 공식 신상품',
      sourceUrl: 'https://www.7-eleven.co.kr/product/presentList.asp',
    }));
  }
  return rows;
}

// ---------------------------------------------------------------------------
// 네이버 뉴스
// ---------------------------------------------------------------------------

const NEWS_BRANDS = [
  // [기사에 등장하는 표기, 저장할 브랜드명, 판매처 유형]
  // 편의점·마트·슈퍼 (긴 이름이 먼저 매칭되도록 순서 유지: 이마트24 → 이마트, 노브랜드 버거 → 노브랜드)
  ['CU', 'CU', 'store'], ['GS25', 'GS25', 'store'], ['세븐일레븐', '세븐일레븐', 'store'], ['이마트24', '이마트24', 'store'],
  ['GS더프레시', 'GS더프레시', 'store'], ['GS 더프레시', 'GS더프레시', 'store'], ['GS프레시', 'GS더프레시', 'store'],
  ['이마트 에브리데이', '이마트에브리데이', 'store'], ['이마트에브리데이', '이마트에브리데이', 'store'],
  ['트레이더스', '트레이더스', 'store'], ['노브랜드 버거', '노브랜드 버거', 'restaurant'], ['노브랜드', '노브랜드', 'store'],
  ['이마트', '이마트', 'store'], ['홈플러스 익스프레스', '홈플러스 익스프레스', 'store'], ['홈플러스', '홈플러스', 'store'],
  ['롯데마트', '롯데마트', 'store'], ['롯데슈퍼', '롯데슈퍼', 'store'], ['코스트코', '코스트코', 'store'],
  ['하나로마트', '하나로마트', 'store'], ['킴스클럽', '킴스클럽', 'store'], ['컬리', '컬리', 'store'], ['쿠팡', '쿠팡', 'store'],
  ['농심', '농심'], ['오뚜기', '오뚜기'], ['오리온', '오리온'], ['롯데웰푸드', '롯데웰푸드'], ['롯데칠성', '롯데칠성음료'],
  ['빙그레', '빙그레'], ['해태제과', '해태제과'], ['크라운제과', '크라운제과'], ['삼양식품', '삼양식품'], ['팔도', '팔도'],
  ['CJ제일제당', 'CJ제일제당'], ['풀무원', '풀무원'], ['동원F&B', '동원F&B'], ['매일유업', '매일유업'], ['남양유업', '남양유업'],
  ['서울우유', '서울우유'], ['연세유업', '연세유업'], ['하이트진로', '하이트진로'], ['오비맥주', '오비맥주'], ['동서식품', '동서식품'],
  ['hy', 'hy'], ['대상', '대상'], ['하겐다즈', '하겐다즈'], ['요아정', '요아정', 'restaurant'], ['쉐이크쉑', '쉐이크쉑', 'restaurant'], ['피자헛', '피자헛', 'restaurant'], ['SPC삼립', 'SPC삼립'], ['삼립', 'SPC삼립'], ['코카콜라', '코카콜라'],
  ['스타벅스', '스타벅스', 'restaurant'], ['메가MGC커피', '메가MGC커피', 'restaurant'], ['메가커피', '메가MGC커피', 'restaurant'],
  ['컴포즈커피', '컴포즈커피', 'restaurant'], ['빽다방', '빽다방', 'restaurant'], ['이디야', '이디야커피', 'restaurant'],
  ['투썸플레이스', '투썸플레이스', 'restaurant'], ['할리스', '할리스', 'restaurant'], ['폴 바셋', '폴 바셋', 'restaurant'],
  ['공차', '공차', 'restaurant'], ['설빙', '설빙', 'restaurant'], ['파리바게뜨', '파리바게뜨', 'restaurant'],
  ['뚜레쥬르', '뚜레쥬르', 'restaurant'], ['던킨', '던킨', 'restaurant'], ['배스킨라빈스', '배스킨라빈스', 'restaurant'],
  ['맥도날드', '맥도날드', 'restaurant'], ['버거킹', '버거킹', 'restaurant'], ['롯데리아', '롯데리아', 'restaurant'],
  ['맘스터치', '맘스터치', 'restaurant'], ['KFC', 'KFC', 'restaurant'],
  ['BBQ', 'BBQ', 'restaurant'], ['bhc', 'bhc', 'restaurant'], ['교촌', '교촌치킨', 'restaurant'],
];

const NEWS_RELEASE_WORDS = /출시|신제품|신메뉴|선보|선봬|내놓|신상|론칭|런칭/;
const NEWS_NAME_BLOCKLIST = /기자|대표|회장|사장|캠페인|이벤트|프로모션|페스티벌|팝업|어워드|협약|협업|매출|실적|주가|논란|불매|1위|브랜드|시즌|컬렉션|신제품|신상품|신메뉴|가성비|승부|차별화|대란|열풍|트렌드|에디션$|[다요]$/;

function decodeEntities(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#0?39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function hashString(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

async function extractOgImage(url) {
  try {
    const html = await fetchText(url, {}, 4000);
    const match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (!match) return '';
    let img = match[1].trim().replace(/&amp;/g, '&');
    if (img.startsWith('//')) img = 'https:' + img;
    return /^https?:\/\//.test(img) ? img : '';
  } catch {
    return '';
  }
}

/**
 * 네이버 뉴스 검색에서 최근 7일 내 신제품 출시 기사를 찾아
 * 제목에 따옴표로 표기된 상품명과 브랜드를 추출합니다.
 * 가격은 기사에서 신뢰성 있게 얻을 수 없으므로 0(미정)으로 두고, 이미지는 기사 대표 이미지를 사용합니다.
 */
export async function collectNewsProducts(query, { clientId, clientSecret, maxItems = 12, fetchImages = true } = {}) {
  if (!clientId || !clientSecret) {
    const err = new Error('NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수가 서버에 설정되어 있지 않습니다.');
    err.code = 'NAVER_NOT_CONFIGURED';
    throw err;
  }

  const base = String(query || '').trim() || '편의점 신제품';
  const search = NEWS_RELEASE_WORDS.test(base) ? base : `${base} 신제품 출시`;
  const url = `https://naverapihub.apigw.ntruss.com/search/v1/news?query=${encodeURIComponent(search)}&display=50&sort=date`;
  const text = await fetchText(url, {
    headers: { 'X-NCP-APIGW-API-KEY-ID': clientId, 'X-NCP-APIGW-API-KEY': clientSecret },
  });
  const articles = JSON.parse(text).items || [];

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const candidates = [];
  const seen = new Set();

  for (const article of articles) {
    const published = new Date(article.pubDate).getTime();
    if (!published || published < weekAgo) continue;

    const title = decodeEntities(article.title);
    const summary = decodeEntities(article.description);
    if (!NEWS_RELEASE_WORDS.test(title)) continue;

    // 제목에 등장하는 브랜드 위치 (같은 자리에서는 긴 이름 우선: 이마트24 > 이마트)
    const titleBrands = [];
    for (const entry of NEWS_BRANDS) {
      const at = title.indexOf(entry[0]);
      if (at < 0) continue;
      if (titleBrands.some((b) => at >= b.at && at < b.at + b.entry[0].length)) continue;
      titleBrands.push({ at, entry });
    }
    const summaryBrand = titleBrands.length === 0
      ? NEWS_BRANDS.find(([needle]) => summary.includes(needle))
      : null;
    if (titleBrands.length === 0 && !summaryBrand) continue;

    // 상품명은 작은따옴표·낫표로 표기된 것만 사용 (큰따옴표는 대부분 발언 인용)
    const quoted = [...title.matchAll(/[‘'「『]([^‘’'“”"「」『』]{2,30})[’'」』]/g)];
    for (const match of quoted) {
      const name = match[1].trim();
      if (NEWS_NAME_BLOCKLIST.test(name) || !/[가-힣]/.test(name) || !isFoodProduct(name)) continue;

      // 상품명 바로 앞에 나온 브랜드를 그 상품의 브랜드로 봅니다. 앞에 브랜드가 없으면(다른 회사 상품일 수 있음) 건너뜁니다.
      const preceding = titleBrands.filter((b) => b.at < match.index).sort((a, b) => b.at - a.at)[0];
      const brandEntry = preceding ? preceding.entry : summaryBrand;
      if (!brandEntry) continue;
      const [, brand, kind] = brandEntry;
      if (name === brand || name.replace(/\s+/g, '').length < 3) continue;

      const key = normalizeProductName(name);
      if (seen.has(key)) continue;
      seen.add(key);

      const link = (article.originallink || article.link || '').trim();
      const category = kind === 'restaurant' && /버거|치킨|피자/.test(name)
        ? '패스트푸드'
        : detectFoodCategory(`${name} ${title}`);
      candidates.push({
        id: `news-${hashString(`${brand}|${key}`)}`,
        name,
        brand,
        category,
        sub_category: detectFoodSubCategory(name, category) || null,
        item_type: kind === 'restaurant' ? 'restaurant' : 'packaged',
        image: '',
        release_date: new Date(published + 9 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 0,
        discount_rate: 0,
        stores: kind ? [brand] : [],
        description: '',
        source_name: `네이버 뉴스 · ${title.slice(0, 60)}`,
        source_url: link,
        volume: null,
      });
      if (candidates.length >= maxItems) break;
    }
    if (candidates.length >= maxItems) break;
  }

  if (fetchImages) await attachArticleImages(candidates);
  return candidates;
}

/** 기사 대표 이미지(og:image) 병렬 조회 */
async function attachArticleImages(rows) {
  await Promise.all(rows.map(async (row) => {
    if (row.source_url) row.image = await extractOgImage(row.source_url);
  }));
}

/** 키워드 없이 수집할 때 도는 기본 검색어: 편의점·대형마트·슈퍼·식품사·외식 전반 */
export const DEFAULT_NEWS_QUERIES = [
  '편의점 신제품', 'GS25 신상품', '이마트24 신상품', 'CU 신상품', '세븐일레븐 신상품',
  '이마트 신상품', '홈플러스 신상품', '롯데마트 신상품', '롯데슈퍼 신상품', 'GS더프레시 신상품',
  '트레이더스 신상품', '코스트코 신상품', '노브랜드 신제품', '피코크 신제품',
  '식품 신제품 출시', '음료 신제품 출시', '과자 신제품 출시', '아이스크림 신제품 출시', '카페 신메뉴 출시', '버거 신메뉴 출시',
];

/**
 * 기본 검색어 전체를 돌며 뉴스에서 신제품 후보를 모읍니다 (검색어당 최대 6건, 전체 최대 60건).
 */
export async function collectDefaultNewsProducts(credentials) {
  const merged = [];
  const seen = new Set();
  let firstError = null;

  for (let i = 0; i < DEFAULT_NEWS_QUERIES.length; i += 5) {
    const batch = DEFAULT_NEWS_QUERIES.slice(i, i + 5);
    const results = await Promise.allSettled(
      batch.map((q) => collectNewsProducts(q, { ...credentials, maxItems: 6, fetchImages: false }))
    );
    for (const result of results) {
      if (result.status === 'rejected') {
        firstError = firstError || result.reason;
        continue;
      }
      for (const row of result.value) {
        if (seen.has(row.id)) continue;
        seen.add(row.id);
        merged.push(row);
      }
    }
  }

  if (merged.length === 0 && firstError) throw firstError;
  const rows = merged.slice(0, 60);
  await attachArticleImages(rows);
  return rows;
}
