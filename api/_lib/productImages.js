/**
 * 수집 상품의 제품 사진 확보·검수 (서버 전용)
 *  - 이미지가 없는 상품은 네이버 이미지 검색으로 제품 사진 후보를 찾습니다.
 *  - 기사 대표 이미지·검색 이미지는 AI 로 "제품 사진인지 / 사람이 나오는지" 확인한 뒤에만 씁니다.
 *  - 확인된 제품 사진이 없는 상품은 image 를 비워 두며, 호출한 쪽에서 저장하지 않습니다.
 */

import { askAiForJson } from './aiJson.js';
import { searchNaver } from './intakeSearch.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const AI_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;
const MAX_SEARCH_CANDIDATES = 4;
const CONCURRENCY = 10;

/** 공식 홈페이지 상품 목록에서 가져온 이미지는 제품 컷이므로 그대로 씁니다. */
const isOfficialImage = (row) => /^(cu|seven|starbucks|mega|paik|ediya)-/.test(row.id) && Boolean(row.image);

const toHttps = (url) => String(url || '').replace(/^http:\/\//, 'https://');

/** 커뮤니티 퍼온 사진, 1년 넘은 네이버 뉴스 자료 사진은 신제품 사진일 수 없어 후보에서 뺍니다. */
function isUnusableImageUrl(url) {
  let full = url;
  try { full = `${url} ${decodeURIComponent(new URL(url).searchParams.get('src') || '')}`; } catch { /* 그대로 검사 */ }
  if (/dcimg\d*\.dcinside|dcinside\.com|fmkorea|theqoo|ruliweb|instiz/i.test(full)) return true;
  const dated = full.match(/imgnews\.naver\.net\/image\/\d+\/(\d{4})\/(\d{2})\/(\d{2})\//);
  return Boolean(dated && Date.now() - Date.parse(`${dated[1]}-${dated[2]}-${dated[3]}`) > 365 * 86400000);
}

/**
 * 검색 이미지 후보: 원본(link)은 차단·지연이 잦아 검수는 네이버 썸네일로 하고,
 * 저장할 때 원본이 열리지 않으면 썸네일을 씁니다.
 */
async function searchImageCandidates(row, naver) {
  const query = `${row.brand && row.brand !== '기타' ? `${row.brand} ` : ''}${row.name}`;
  try {
    const items = await searchNaver('image', query, MAX_SEARCH_CANDIDATES + 2);
    return items
      .map((it) => ({ url: toHttps(it.link), checkUrl: toHttps(it.thumbnail || it.link), fallbackUrl: toHttps(it.thumbnail) }))
      .filter((c) => /^https:\/\//.test(c.url) && /^https:\/\//.test(c.checkUrl))
      .slice(0, MAX_SEARCH_CANDIDATES);
  } catch {
    return [];
  }
}

/** 실제로 열리는 이미지인지 확인하면서 AI 검수용 데이터를 받습니다. */
async function downloadImage(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const mediaType = String(res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!AI_MEDIA_TYPES.includes(mediaType)) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) return null;
    return { mediaType, base64: buffer.toString('base64') };
  } catch {
    return null;
  }
}

/**
 * 후보 사진을 한 번의 AI 호출로 함께 검수해 쓸 수 있는 사진의 번호(1부터)를 돌려줍니다. 없으면 0.
 * 무료 AI 한도가 낮아 사진마다 따로 묻지 않습니다.
 */
async function pickProductPhoto(engine, row, images, deadline) {
  const verdict = await askAiForJson(engine, {
    system: '당신은 식품 신제품 앱의 상품 이미지 검수자입니다. 반드시 JSON 객체 하나만 답합니다.',
    text: `상품: ${row.brand} ${row.name}\n`
      + `이미지 ${images.length}장이 순서대로 1번부터 ${images.length}번까지 주어집니다.\n`
      + '앱 상품 목록의 대표 사진으로 쓸 수 있는 이미지 중 가장 좋은 것의 번호를 고르세요.\n'
      + '- 쓸 수 있는 사진: 위 상품(또는 같은 상품으로 보이는 것)의 포장이나 음식·음료 자체가 주인공으로 또렷하게 보이는 사진.\n'
      + '- 쓸 수 없는 사진: 다른 상품, 여러 상품을 늘어놓은 단체 사진, 로고·매장·행사·공장·회사 건물 사진, 글자나 표·그래프가 대부분인 이미지, 기사용 자료 사진, 사람의 얼굴이나 몸이 보이는 사진(모델·연예인·직원이 상품을 들고 있는 홍보 사진 포함).\n'
      + '- 상품명이 실제 제품 이름이 아니라 기사 제목·문장·홍보 문구로 보이면 무조건 0.\n'
      + '확실하지 않으면 0. 쓸 수 있는 사진이 없으면 0.\n'
      + '형식: {"best": 번호}',
    image: images,
    maxTokens: 200,
    timeoutMs: Math.max(1, Math.min(60000, deadline - Date.now())),
    priority: true,
  });
  const best = Number(verdict.best);
  return Number.isInteger(best) && best >= 1 && best <= images.length ? best : 0;
}

/**
 * rows 의 image 를 확인된 제품 사진으로 채웁니다 (없으면 '' 로 비움).
 * @param {object[]} rows pending_products 행 (수정됨)
 * @param {{ deadline: number, naver?: { clientId?: string, clientSecret?: string }, engine?: object|null }} options
 * @returns {Promise<{ aiErrors: number }>}
 */
export async function attachProductImages(rows, { deadline, naver, engine }) {
  const stats = { aiErrors: 0 };
  const queue = [...rows];

  const resolve = async (row) => {
    if (isOfficialImage(row)) {
      // 공식 이미지도 만료·404·HTML 오류 응답이면 승인 대기함에 담지 않습니다.
      if (Date.now() < deadline && await downloadImage(row.image)) return;
      row.image = '';
    }
    // AI 검수를 못 하면 기사 사진(인물 사진일 수 있음)은 쓰지 않습니다.
    const articleImage = row.image ? [{ url: row.image, checkUrl: row.image, fallbackUrl: '' }] : [];
    row.image = '';
    if (Date.now() > deadline || !engine) return;

    const seen = new Set();
    const candidates = [...articleImage, ...(await searchImageCandidates(row, naver))]
      .filter((c) => !isUnusableImageUrl(c.url) && !isUnusableImageUrl(c.checkUrl) && !seen.has(c.url) && seen.add(c.url));
    const downloaded = await Promise.all(candidates.map(async (c) => ({ ...c, image: await downloadImage(c.checkUrl) })));
    const usable = downloaded.filter((c) => c.image);
    if (usable.length === 0 || Date.now() > deadline) return;

    let best = 0;
    try {
      best = await pickProductPhoto(engine, row, usable.map((c) => c.image), deadline);
    } catch {
      stats.aiErrors++;
      return;
    }
    if (!best) return;
    const chosen = usable[best - 1];
    // 검수는 썸네일로 했으므로 원본이 열리는지 확인하고, 안 열리면 검수한 썸네일을 씁니다.
    row.image = chosen.url === chosen.checkUrl || await downloadImage(chosen.url) ? chosen.url : chosen.fallbackUrl;
  };

  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length > 0) await resolve(queue.shift());
  });
  await Promise.all(workers);
  return stats;
}
