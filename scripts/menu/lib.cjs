// 브랜드 공식 사이트 메뉴 수집 공용 유틸
// 수집 결과는 scripts/menu/out/<key>.json 에 저장하고, build.cjs 가 src/data/officialMenuProducts.ts 로 묶습니다.
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'out');
const UA = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  'Accept-Language': 'ko-KR,ko;q=0.9',
};

async function request(url, init = {}) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: { ...UA, ...(init.headers || {}) },
        signal: AbortSignal.timeout(25000),
      });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return res;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastErr;
}

const getText = async (url, init) => (await request(url, init)).text();
const getJson = async (url, init) => (await request(url, init)).json();

// EUC-KR 등 UTF-8 이 아닌 페이지용
async function getTextEncoded(url, encoding, init) {
  const buf = await (await request(url, init)).arrayBuffer();
  return new TextDecoder(encoding).decode(buf);
}

function clean(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

function toPrice(value) {
  const n = Number(String(value ?? '').replace(/[^\d]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function toCalories(value) {
  const s = String(value ?? '').trim();
  if (!/^\d+(\.\d+)?\s*(kcal)?$/i.test(s)) return 0;
  return Math.round(parseFloat(s));
}

function absolute(url, base) {
  if (!url) return '';
  try {
    return new URL(url.trim(), base).href;
  } catch {
    return '';
  }
}

/**
 * items: [{ name, sub, image, price?, desc?, calories?, volume?, url? }]
 */
function save(key, brand, items) {
  const seen = new Set();
  const rows = [];
  for (const item of items) {
    const name = clean(item.name);
    if (!name || !item.image) continue;
    const dedupeKey = name.replace(/\s+/g, '').toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    rows.push({
      name,
      sub: clean(item.sub),
      image: item.image,
      price: toPrice(item.price),
      desc: clean(item.desc),
      calories: toCalories(item.calories),
      volume: clean(item.volume),
      url: item.url || '',
    });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${key}.json`), JSON.stringify({ key, brand, items: rows }, null, 1));
  const priced = rows.filter((r) => r.price > 0).length;
  const subs = {};
  for (const r of rows) subs[r.sub] = (subs[r.sub] || 0) + 1;
  console.log(`[${key}] ${brand}: ${rows.length}건 (가격 ${priced}건) ${JSON.stringify(subs)}`);
  if (rows[0]) console.log('  예:', JSON.stringify(rows[0]).slice(0, 300));
  return rows;
}

module.exports = { request, getText, getJson, getTextEncoded, clean, toPrice, toCalories, absolute, save, OUT_DIR };
