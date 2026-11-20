/**
 * 수집한 후보가 정말 "새로 나온" 제품인지 과거 기사·블로그로 확인합니다.
 *
 * 수집 소스는 기사/글 작성일만 보기 때문에, 몇 달 전에 나온 제품을 뒤늦게 "신메뉴"라고 쓴 글이나
 * 해마다 다시 나오는 시즌 제품도 들어옵니다. 브랜드 + 상품명으로 네이버 뉴스·블로그를 관련도순 검색해
 * 오래전(기본 60일 이전)에 같은 브랜드와 상품명이 함께 언급된 글이 있으면 이미 나온 제품으로 봅니다.
 */
import { searchNaver, searchConfigured } from './intakeSearch.js';
import { decodeEntities } from './storeCrawlers.js';

export const OLD_PRODUCT_DAYS = 60;

const compact = value => decodeEntities(value).replace(/<[^>]+>/g, '').replace(/[\s·・()[\]{}'"‘’“”「」『』-]+/g, '').toLowerCase();

function publishedAt(item, type) {
  const raw = type === 'blog'
    ? String(item.postdate || '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3T00:00:00+09:00')
    : item.pubDate;
  const time = Date.parse(raw);
  return Number.isFinite(time) ? time : null;
}

/** 검색 결과 중 같은 브랜드·상품명이 함께 나온 가장 오래된 글의 시각 (없으면 null) */
export function earliestMention(items, type, row) {
  const name = compact(row.name);
  // 'CU' 같은 짧은 브랜드도 그대로 비교하고, 상품명에 브랜드가 들어 있으면 상품명만으로 판단합니다.
  const brand = compact(row.brand);
  let earliest = null;
  for (const item of items) {
    const text = compact(`${item.title || ''} ${item.description || ''}`);
    if (!name || !text.includes(name)) continue;
    if (brand && !name.includes(brand) && !text.includes(brand)) continue;
    const time = publishedAt(item, type);
    if (time && (earliest === null || time < earliest)) earliest = time;
  }
  return earliest;
}

/**
 * rows를 새 제품(fresh)과 이미 나온 제품(old)으로 나눕니다.
 * 검색이 실패한 후보는 판단 근거가 없으므로 새 제품으로 둡니다.
 * 시간 제한에 걸려 확인하지 못한 후보는 deferred로 돌려 이번에는 저장하지 않습니다 (다음 수집 때 다시 확인).
 */
export async function splitAlreadyReleased(rows, { deadline = Date.now() + 20000, now = Date.now(), days = OLD_PRODUCT_DAYS } = {}) {
  if (rows.length === 0 || !searchConfigured()) return { fresh: rows, old: [], deferred: [] };
  const cutoff = now - days * 86400000;
  const fresh = [];
  const old = [];
  const deferred = [];
  for (let i = 0; i < rows.length; i += 6) {
    const batch = rows.slice(i, i + 6);
    if (Date.now() > deadline) { deferred.push(...rows.slice(i)); break; }
    await Promise.all(batch.map(async (row) => {
      const query = compact(row.name).includes(compact(row.brand)) ? row.name : `${row.brand} ${row.name}`;
      const results = await Promise.allSettled(['news', 'blog'].map(type =>
        searchNaver(type, `"${query}"`, 30, 'sim').then(items => earliestMention(items, type, row))));
      const times = results.filter(r => r.status === 'fulfilled' && r.value).map(r => r.value);
      const first = times.length ? Math.min(...times) : null;
      if (first !== null && first < cutoff) {
        old.push({ ...row, first_mentioned: new Date(first).toISOString().slice(0, 10) });
      } else {
        fresh.push(row);
      }
    }));
  }
  return { fresh, old, deferred };
}
