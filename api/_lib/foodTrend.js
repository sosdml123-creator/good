/**
 * "요즘 주목받는 먹거리" 실시간 순위용 네이버 신호 수집
 *
 * 키워드 1개당 3가지 신호를 모읍니다 (모두 NAVER API HUB):
 *  1. 검색어 트렌드   — 통합검색 검색량 (최근 7일 수준 + 최근 3일 급상승 여부)
 *  2. 쇼핑인사이트    — 식품 카테고리 내 쇼핑 클릭량 (최근 7일)
 *  3. 블로그 검색     — 최근 7일 하루 평균 신규 글 수 (오늘 글까지 반영되는 실시간 신호)
 *
 * 데이터랩은 요청 1건 안에서의 상대값(최대 100)만 주므로, 모든 요청에 같은 기준 키워드(ANCHOR)를
 * 함께 넣고 그 대비 배율로 환산해 서로 다른 요청의 키워드끼리도 비교할 수 있게 합니다.
 */

const HUB = 'https://naverapihub.apigw.ntruss.com';
const ANCHOR = '신라면';
const FOOD_CATEGORY = '50000006';
export const MAX_TREND_ITEMS = 4; // 데이터랩 요청당 5개 제한 - 기준 키워드 1개
const UPSTREAM_TIMEOUT_MS = 7000;
const DAY_MS = 86400000;
const KST_OFFSET_MS = 9 * 3600000;

const kstDate = (daysAgo = 0) => new Date(Date.now() + KST_OFFSET_MS - daysAgo * DAY_MS).toISOString().slice(0, 10);
const sanitize = (value) => String(value || '').replace(/[^0-9A-Za-z가-힣ㄱ-ㅎ .&+%-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40);
const compact = (value) => value.replace(/\s+/g, '');
const mean = (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
const round = (value) => Math.round(value * 10000) / 10000;

/**
 * "이름~별칭|이름~별칭|..." 형식의 요청값을 키워드 목록으로 변환
 */
export function parseTrendItems(raw) {
  const seen = new Set();
  const items = [];
  for (const entry of String(raw || '').split('|')) {
    const [nameRaw, altRaw] = entry.split('~');
    const key = sanitize(nameRaw);
    if (key.length < 2 || seen.has(key)) continue;
    seen.add(key);
    const alt = sanitize(altRaw);
    items.push({ key, alt: alt.length >= 2 && alt !== key ? alt : '' });
    if (items.length >= MAX_TREND_ITEMS) break;
  }
  return items;
}

async function hubFetch(path, credentials, init = {}) {
  const res = await fetch(`${HUB}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-NCP-APIGW-API-KEY-ID': credentials.clientId,
      'X-NCP-APIGW-API-KEY': credentials.clientSecret,
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`NAVER ${path} ${res.status}`);
  return res.json();
}

/**
 * 데이터랩 일별 시계열(값이 0인 날은 누락됨)을 기준 키워드 대비 배율로 환산
 */
function summarizeSeries(results, labels, days) {
  const byTitle = new Map((results || []).map((r) => [r.title, new Map((r.data || []).map((d) => [d.period, d.ratio]))]));
  const anchorSeries = byTitle.get(ANCHOR);
  const anchorMean = anchorSeries ? mean(days.map((day) => anchorSeries.get(day) || 0)) : 0;
  const scale = anchorMean > 0 ? anchorMean : 100;

  return labels.map((label) => {
    const series = byTitle.get(label);
    const values = days.map((day) => (series && series.get(day)) || 0);
    const recent3 = mean(values.slice(-3));
    const earlier = mean(values.slice(0, -3));
    return {
      volume: round(mean(values.slice(-7)) / scale),
      // 이전 기간 평균 대비 최근 3일 배율 (1 = 변동 없음). 이전 검색량이 0이면 신규 급상승으로 봅니다.
      momentum: earlier > 0 ? round(recent3 / earlier) : (recent3 > 0 ? 3 : 0),
    };
  });
}

async function fetchSearchTrend(items, credentials, startDate, endDate, days) {
  const data = await hubFetch('/search-trend/v1/search', credentials, {
    method: 'POST',
    body: JSON.stringify({
      startDate,
      endDate,
      timeUnit: 'date',
      keywordGroups: [
        { groupName: ANCHOR, keywords: [ANCHOR] },
        // 같은 그룹의 키워드는 검색량이 합산되므로 브랜드 생략 표기를 함께 넣습니다.
        // 네이버는 띄어쓰기만 다른 키워드를 같은 검색어로 집계하므로(중복 합산 방지) 붙여 쓴 형태로 통일합니다.
        ...items.filter((it) => it.key !== ANCHOR).map((it) => ({
          groupName: it.key,
          keywords: [...new Set([compact(it.key), compact(it.alt)].filter(Boolean))],
        })),
      ],
    }),
  });
  return summarizeSeries(data.results, items.map((it) => it.key), days);
}

async function fetchShoppingClicks(items, credentials, startDate, endDate, days) {
  const data = await hubFetch('/shopping/v1/category/keywords', credentials, {
    method: 'POST',
    body: JSON.stringify({
      startDate,
      endDate,
      timeUnit: 'date',
      category: FOOD_CATEGORY,
      keyword: [
        { name: ANCHOR, param: [ANCHOR] },
        ...items.filter((it) => it.key !== ANCHOR).map((it) => ({ name: it.key, param: [compact(it.alt || it.key)] })),
      ],
    }),
  });
  return summarizeSeries(data.results, items.map((it) => it.key), days);
}

/**
 * 최근 7일간 하루 평균 블로그 글 수. 검색 결과에 섞여 나오는 무관한 글은 제외합니다.
 */
async function fetchBlogBuzz(item, credentials) {
  // 브랜드를 뺀 별칭이 있으면 그쪽이 실제 언급 표기에 가깝습니다 (예: '농심 먹태깡' → '먹태깡')
  const query = item.alt || item.key;
  const data = await hubFetch(`/search/v1/blog?query=${encodeURIComponent(query)}&display=100&sort=date`, credentials);
  const posts = data.items || [];
  const tokens = query.toLowerCase().split(' ').filter((t) => t.length >= 2);
  const windowStart = kstDate(6).replace(/-/g, '');

  let relevant = 0;
  let oldest = '';
  for (const post of posts) {
    const postDate = String(post.postdate || '');
    if (postDate < windowStart) continue;
    if (!oldest || postDate < oldest) oldest = postDate;
    const text = compact(`${post.title || ''} ${post.description || ''}`.replace(/<[^>]+>/g, '')).toLowerCase();
    if (tokens.every((t) => text.includes(t))) relevant += 1;
  }

  // 100건이 7일을 다 채우지 못하고 끊겼다면(글이 매우 많은 키워드) 실제로 덮인 기간으로 나눕니다
  let spanDays = 7;
  if (posts.length >= 100 && oldest) {
    const lastPostDate = String(posts[posts.length - 1].postdate || '');
    if (lastPostDate >= windowStart) {
      const toMs = (ymd) => Date.UTC(Number(ymd.slice(0, 4)), Number(ymd.slice(4, 6)) - 1, Number(ymd.slice(6, 8)));
      spanDays = Math.max(1, Math.round((toMs(kstDate(0).replace(/-/g, '')) - toMs(oldest)) / DAY_MS) + 1);
    }
  }
  return round(relevant / spanDays);
}

// 지금 화제인 먹거리를 찾기 위해 훑어보는 검색어 (최신순 100건씩)
const BUZZ_BLOG_QUERIES = [
  '편의점 신상', '신제품 출시', '신메뉴 출시', '요즘 핫한 간식', '편의점 추천', '신상 과자', '신상 음료',
  '카페 신메뉴', '신상 아이스크림', '라면 신제품', '디저트 신상', '마트 추천템', '신상 빵', '버거 신메뉴',
];
const BUZZ_NEWS_QUERIES = ['신제품 출시', '신메뉴 출시', '편의점 신상품'];

/**
 * 네이버 블로그·뉴스의 최신 먹거리 글을 모아, 제품명 대조용 본문(공백 제거·소문자)으로 반환합니다.
 * 앱은 이 본문에 등장하는 등록 제품을 순위 후보로 우선 올립니다 (네이버에서 먼저 찾고 → 등록 제품과 매칭).
 */
export async function collectFoodBuzzTexts(credentials) {
  const requests = [
    ...BUZZ_BLOG_QUERIES.map((q) => ['blog', q]),
    ...BUZZ_NEWS_QUERIES.map((q) => ['news', q]),
  ];
  const results = await Promise.allSettled(requests.map(([type, q]) =>
    hubFetch(`/search/v1/${type}?query=${encodeURIComponent(q)}&display=100&sort=date`, credentials)
  ));

  const seen = new Set();
  const texts = [];
  let succeeded = 0;
  for (const result of results) {
    if (result.status === 'rejected') {
      console.warn('[food-buzz]', result.reason?.message || result.reason);
      continue;
    }
    succeeded += 1;
    for (const post of result.value.items || []) {
      if (seen.has(post.link)) continue;
      seen.add(post.link);
      texts.push(compact(`${post.title || ''} ${post.description || ''}`.replace(/<[^>]+>|&[a-z#0-9]+;/g, ' ')).toLowerCase());
    }
  }
  return { ok: succeeded >= requests.length / 2, complete: succeeded === requests.length, updatedAt: new Date().toISOString(), texts };
}

/**
 * 키워드 묶음(최대 4개)의 네이버 신호를 수집합니다.
 * 일부 API가 실패하면 해당 신호만 null로 두고 나머지는 그대로 반환합니다.
 */
export async function collectFoodTrendSignals(items, credentials) {
  // 데이터랩은 전일까지만 집계되므로 어제를 끝으로 하는 30일 구간을 사용
  const days = Array.from({ length: 30 }, (_, i) => kstDate(30 - i));
  const startDate = days[0];
  const endDate = days[days.length - 1];

  const [search, shopping, ...blogs] = await Promise.allSettled([
    fetchSearchTrend(items, credentials, startDate, endDate, days),
    fetchShoppingClicks(items, credentials, startDate, endDate, days),
    ...items.map((it) => fetchBlogBuzz(it, credentials)),
  ]);

  for (const result of [search, shopping, ...blogs]) {
    if (result.status === 'rejected') console.warn('[food-trend]', result.reason?.message || result.reason);
  }

  return {
    ok: search.status === 'fulfilled' || shopping.status === 'fulfilled' || blogs.some((b) => b.status === 'fulfilled'),
    complete: [search, shopping, ...blogs].every((r) => r.status === 'fulfilled'),
    anchor: ANCHOR,
    period: { startDate, endDate },
    updatedAt: new Date().toISOString(),
    items: items.map((it, i) => ({
      key: it.key,
      search: search.status === 'fulfilled' ? search.value[i].volume : null,
      momentum: search.status === 'fulfilled' ? search.value[i].momentum : null,
      shopping: shopping.status === 'fulfilled' ? shopping.value[i].volume : null,
      blog: blogs[i].status === 'fulfilled' ? blogs[i].value : null,
    })),
  };
}
