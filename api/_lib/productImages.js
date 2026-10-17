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
const MAX_SEARCH_CANDIDATES = 3;
const CONCURRENCY = 10;

/** 공식 홈페이지 상품 목록에서 가져온 이미지는 제품 컷이므로 그대로 씁니다. */
const isOfficialImage = (row) => /^(cu|seven|starbucks|mega|paik)-/.test(row.id) && Boolean(row.image);

async function searchImageCandidates(row, naver) {
  const query = `${row.brand && row.brand !== '기타' ? `${row.brand} ` : ''}${row.name}`;
  try {
    const items = await searchNaver('image', query, MAX_SEARCH_CANDIDATES + 2);
    return items
      .map((it) => String(it.link || '').replace(/^http:\/\//, 'https://'))
      .filter((url) => /^https:\/\//.test(url))
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

async function isProductPhoto(engine, row, image, deadline) {
  const verdict = await askAiForJson(engine, {
    system: '당신은 식품 신제품 앱의 상품 이미지 검수자입니다. 반드시 JSON 객체 하나만 답합니다.',
    text: `상품: ${row.brand} ${row.name}\n`
      + '이 이미지를 앱 상품 목록의 대표 사진으로 쓸 수 있는지 판단하세요.\n'
      + '- "product": 위 상품(또는 같은 상품으로 보이는 것)의 포장이나 음식·음료 자체가 주인공으로 또렷하게 보이면 true. 다른 상품, 로고·매장·행사 사진, 글자만 있는 이미지는 false.\n'
      + '- "person": 사람의 얼굴이나 몸이 보이면 true (모델·연예인·직원이 상품을 들고 있는 홍보 사진 포함).\n'
      + '형식: {"product": true|false, "person": true|false}',
    image,
    maxTokens: 1000,
    timeoutMs: Math.max(1, Math.min(12000, deadline - Date.now())),
  });
  return verdict.product === true && verdict.person === false;
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
    // AI 검수를 못 하면 기사 사진(인물 사진일 수 있음)은 쓰지 않고 검색 이미지만 씁니다.
    const articleImage = engine && row.image ? [row.image] : [];
    row.image = '';
    if (Date.now() > deadline || !engine) return;

    const candidates = [...articleImage, ...(await searchImageCandidates(row, naver))];
    for (const url of [...new Set(candidates)]) {
      if (Date.now() > deadline) return;
      const image = await downloadImage(url);
      if (!image) continue;
      if (engine) {
        try {
          if (!(await isProductPhoto(engine, row, image, deadline))) continue;
        } catch {
          stats.aiErrors++;
          continue;
        }
      }
      row.image = url;
      return;
    }
  };

  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length > 0) await resolve(queue.shift());
  });
  await Promise.all(workers);
  return stats;
}
