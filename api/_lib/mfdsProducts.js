/**
 * 신제품 수집 소스: 식약처 품목제조보고 (식품안전나라 Open API, 서버 전용)
 *  - I1250 식품(첨가물)품목제조보고: 최근 보고된 제품 목록
 *  - C002  식품(첨가물)품목제조보고(원재료): 원재료명
 *
 * 하루 수백 건이 보고되고 대부분 업소용·반제품·소규모 제조사 품목이므로,
 * 주요 식품사 + 소비자용 식품유형만 남깁니다. 이미지·가격은 제공되지 않아 비워 둡니다.
 * pending_products 테이블 행(snake_case) 배열을 반환합니다.
 */

import { detectFoodSubCategory } from './storeCrawlers.js';

const MFDS_API = 'http://openapi.foodsafetykorea.go.kr/api';
const PAGE_SIZE = 1000;
const MAX_PAGES = 5;
// 인증키 하나로 동시에 요청하면 "현재 접속 중인 인증키" 오류가 나므로 모든 호출은 순차로 보냅니다.
const INGREDIENT_BUDGET_MS = 20000;

// [법인 표기를 뗀 제조사명 패턴, 앱에 표시할 브랜드]
const MAKERS = [
  [/^농심(?!태경|미분|엔지니어링)/, '농심'],
  [/^오리온/, '오리온'],
  [/^롯데(웰푸드|제과)/, '롯데웰푸드'],
  [/^롯데칠성/, '롯데칠성음료'],
  [/^해태제과/, '해태제과'],
  [/^해태(에이치티비|htb)/i, '해태htb'],
  [/^크라운제과/, '크라운제과'],
  [/^삼양식품/, '삼양식품'],
  [/^오뚜기(?!제유)/, '오뚜기'],
  [/^팔도/, '팔도'],
  [/^빙그레/, '빙그레'],
  [/^매일유업/, '매일유업'],
  [/^남양유업/, '남양유업'],
  [/^서울우유/, '서울우유'],
  [/^동서식품/, '동서식품'],
  [/^풀무원/, '풀무원'],
  [/^(씨제이|cj)제일제당/i, 'CJ제일제당'],
  [/^동원(에프앤비|f&b)/i, '동원F&B'],
  [/^대상($|[가-힣]*공장$)/, '대상'],
  [/^(호남)?샤니|^삼립|^에스피씨삼립/, '삼립'],
  [/^하림(?!펫)/, '하림'],
  [/^광동제약/, '광동제약'],
  [/^코카콜라음료/, '코카콜라'],
  [/^웅진식품/, '웅진식품'],
  [/^동아오츠카/, '동아오츠카'],
  [/^(에이치와이|hy|한국야쿠르트)/i, 'hy'],
  [/^정식품/, '정식품'],
  [/^사조대림/, '사조대림'],
  [/^하이트진로/, '하이트진로'],
  [/^오비맥주/, '오비맥주'],
];

// 식약처 식품유형 → 앱 카테고리 (여기 없는 유형은 소스·원료 등 업소용이 대부분이라 수집하지 않음)
const TYPE_CATEGORIES = {
  과자: '과자', 캔디류: '과자', 추잉껌: '과자', 초콜릿: '과자', 밀크초콜릿: '과자', 준초콜릿: '과자', 초콜릿가공품: '과자',
  빵류: '빵·디저트', 떡류: '빵·디저트',
  빙과: '아이스크림',
  탄산음료: '음료', 혼합음료: '음료', '과.채주스': '음료', '과.채음료': '음료', 커피: '음료', 액상차: '음료', 고형차: '음료',
  침출차: '음료', 두유: '음료', 가공두유: '음료', '인삼.홍삼음료': '음료', 유산균음료: '음료',
  맥주: '음료', 소주: '음료', 탁주: '음료', 리큐르: '음료',
  유탕면: '간편식', 숙면: '간편식', 생면: '간편식', 건면: '간편식', 즉석섭취식품: '간편식', 즉석조리식품: '간편식',
  간편조리세트: '간편식', 만두: '간편식', 식육함유가공품: '간편식', 어묵: '간편식',
  곡류가공품: '과자', // 주요 식품사 기준으로는 시리얼류
};

// 반제품·원료·업소용 표기 ("반)도치무스", "순하리 딸기 원액", "우리밀쿠키냉동반죽" 등)
const NOT_RETAIL_NAME = /^[^\s()]{1,3}\)|원액|베이스|엑기스|프리믹스|반죽|후레이크|빵가루|벌크|반제품|선별품|업소용|대용량|수출용|[가-힣]용(크림|소스|분말|시트)/;

function kstDate(offsetDays = 0) {
  return new Date(Date.now() + 9 * 60 * 60 * 1000 - offsetDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

function cleanMakerName(name) {
  return String(name || '').replace(/\(주\)|㈜|주식회사|\(유\)|유한회사/g, '').replace(/\s+/g, '');
}

function extractVolume(name) {
  const m = String(name || '').match(/(\d+(?:\.\d+)?\s?(?:ml|l|g|kg|입|개입))\s*$/i);
  return m ? m[1].replace(/\s+/g, '') : null;
}

/**
 * I1250 응답 한 건을 대기함 행으로 변환합니다. 수집 대상이 아니면 null.
 * @param {object} item I1250 row
 * @param {string} since 수집 시작일 (YYYYMMDD)
 * @param {string} until 오늘 (YYYYMMDD) — 보고일자가 미래로 잘못 입력된 건 제외
 */
export function toMfdsRow(item, since, until) {
  const name = String(item?.PRDLST_NM || '').replace(/\s+/g, ' ').trim();
  const reportNo = String(item?.PRDLST_REPORT_NO || '').trim();
  const reported = String(item?.PRMS_DT || '');
  const type = String(item?.PRDLST_DCNM || '').trim();
  if (!name || !reportNo || !/^\d{8}$/.test(reported) || reported < since || reported > until) return null;
  if (String(item.INDUTY_CD_NM || '').includes('첨가물')) return null;

  const category = TYPE_CATEGORIES[type];
  if (!category) return null;

  const maker = cleanMakerName(item.BSSH_NM);
  const brand = MAKERS.find(([pattern]) => pattern.test(maker))?.[1];
  if (!brand) return null;

  // 한글이 없는 이름은 수출용 표기
  if (NOT_RETAIL_NAME.test(name) || !/[가-힣]/.test(name)) return null;

  const reportedDate = `${reported.slice(0, 4)}-${reported.slice(4, 6)}-${reported.slice(6, 8)}`;
  return {
    id: `mfds-${reportNo}`,
    name,
    brand,
    category,
    sub_category: detectFoodSubCategory(`${name} ${type}`, category) || null,
    item_type: 'packaged',
    image: '',
    release_date: reportedDate,
    price: 0,
    discount_rate: 0,
    stores: [],
    description: `${String(item.BSSH_NM || '').trim()}에서 ${reportedDate} 식약처에 품목제조보고한 제품입니다. (식품유형: ${type})`,
    source_name: '식약처 품목제조보고',
    source_url: null,
    volume: extractVolume(name),
  };
}

async function fetchMfds(apiKey, service, start, end, filter) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(`${MFDS_API}/${apiKey}/${service}/json/${start}/${end}/${filter}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`식품안전나라 HTTP ${res.status}`);
    const body = (await res.json())[service] || {};
    const code = body.RESULT?.CODE;
    if (code === 'INFO-200') return { total: 0, rows: [] };
    if (code && code !== 'INFO-000') throw new Error(`식품안전나라: ${body.RESULT.MSG || code}`);
    return { total: Number(body.total_count) || 0, rows: Array.isArray(body.row) ? body.row : [] };
  } finally {
    clearTimeout(timer);
  }
}

/** RAWMTRL_NM은 순서가 섞여 오므로 RAWMTRL_ORDNO(배합 순번)대로 다시 정렬합니다. */
export function orderIngredients(item) {
  const names = String(item?.RAWMTRL_NM || '').split(',').map((n) => n.trim()).filter(Boolean);
  const order = String(item?.RAWMTRL_ORDNO || '').split(',').map((n) => Number(n.trim()));
  if (names.length > 1 && names.length === order.length && order.every(Number.isFinite)) {
    return names.map((name, i) => [order[i], name]).sort((a, b) => a[0] - b[0]).map(([, name]) => name).join(', ');
  }
  return names.join(', ');
}

/** 원재료는 부가 정보이므로 시간 예산 안에서만 채우고, 실패해도 수집은 계속합니다. */
async function attachIngredients(apiKey, rows) {
  const deadline = Date.now() + INGREDIENT_BUDGET_MS;
  for (const row of rows) {
    if (Date.now() > deadline) break;
    try {
      const { rows: found } = await fetchMfds(apiKey, 'C002', 1, 1, `PRDLST_REPORT_NO=${row.id.slice('mfds-'.length)}`);
      const ingredients = orderIngredients(found[0]);
      if (ingredients) row.ingredients = ingredients;
    } catch {
      break;
    }
  }
}

/**
 * 최근 lookbackDays일 동안 식약처에 품목제조보고된 주요 식품사의 소비자용 제품을 모읍니다.
 */
export async function collectMfdsProducts({ apiKey, lookbackDays = 7 } = {}) {
  if (!apiKey) {
    const err = new Error('FOODSAFETY_API_KEY 환경변수가 서버에 설정되어 있지 않습니다.');
    err.code = 'MFDS_NOT_CONFIGURED';
    throw err;
  }

  const since = kstDate(lookbackDays).replace(/-/g, '');
  const until = kstDate().replace(/-/g, '');
  // PRMS_DT 조건은 "해당 보고일자 이후" 전체를 돌려줍니다.
  const filter = `PRMS_DT=${since}`;

  const first = await fetchMfds(apiKey, 'I1250', 1, PAGE_SIZE, filter);
  const items = [...first.rows];
  const pageCount = Math.min(Math.ceil(first.total / PAGE_SIZE), MAX_PAGES);
  for (let page = 1; page < pageCount; page++) {
    const next = await fetchMfds(apiKey, 'I1250', page * PAGE_SIZE + 1, (page + 1) * PAGE_SIZE, filter);
    items.push(...next.rows);
  }

  const seen = new Set();
  const rows = [];
  for (const item of items) {
    const row = toMfdsRow(item, since, until);
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    rows.push(row);
  }
  rows.sort((a, b) => b.release_date.localeCompare(a.release_date));

  await attachIngredients(apiKey, rows);
  return rows;
}
