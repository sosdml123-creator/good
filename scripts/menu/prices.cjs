// 공식 홈페이지에 가격이 없는 브랜드의 메뉴 가격을 네이버 플레이스(매장 메뉴판 / 배달 메뉴)에서 수집
// 결과: scripts/menu/prices/<key>.json  { 메뉴명: { price, kind: 'store' | 'delivery', stores } }
// 실행: node scripts/menu/prices.cjs [key ...]
const fs = require('fs');
const path = require('path');
const { getText, clean } = require('./lib.cjs');

const PRICE_DIR = path.join(__dirname, 'prices');
const MOBILE = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  Referer: 'https://m.place.naver.com/',
};
const AREAS = ['강남역', '홍대입구', '서울역', '잠실', '여의도', '부산 서면', '대전 둔산', '수원역', '건대입구', '신촌'];
const MAX_STORES = 24;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BRANDS = {
  mcdonalds: '맥도날드',
  burgerking: '버거킹',
  momstouch: '맘스터치',
  starbucks: '스타벅스',
  paikdabang: '빽다방',
  ediya: '이디야커피',
  theventi: '더벤티',
  paulbassett: '폴바셋',
  baskinrobbins: '배스킨라빈스',
  pizzaschool: '피자스쿨',
  parisbaguette: '파리바게뜨',
  megacoffee: '메가MGC커피',
  composecoffee: '컴포즈커피',
  twosome: '투썸플레이스',
  hollys: '할리스',
  coffeebean: '커피빈',
};

function apolloState(html) {
  const m = html.match(/window\.__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\});\s*\n/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

async function findStores(brand) {
  const ids = [];
  for (const area of AREAS) {
    if (ids.length >= MAX_STORES * 2) break;
    await sleep(400);
    let state = null;
    try {
      state = apolloState(await getText(`https://m.place.naver.com/restaurant/list?query=${encodeURIComponent(`${brand} ${area}`)}`, { headers: MOBILE }));
    } catch {
      continue;
    }
    if (!state) continue;
    for (const value of Object.values(state)) {
      if (value && value.id && typeof value.name === 'string' && value.name.replace(/\s/g, '').includes(brand.replace(/\s/g, '').replace(/커피$/, '')) && /^\d{6,}$/.test(String(value.id))) {
        if (!ids.includes(String(value.id))) ids.push(String(value.id));
      }
    }
  }
  return ids;
}

async function storeMenus(id) {
  const state = apolloState(await getText(`https://m.place.naver.com/restaurant/${id}/menu/list`, { headers: MOBILE }));
  if (!state) return [];
  const menus = [];
  for (const [key, value] of Object.entries(state)) {
    if (!value || typeof value.name !== 'string' || value.price === undefined || value.price === null) continue;
    const type = String(value.__typename || key);
    if (!/Menu/.test(type) || /Group/.test(type)) continue;
    // 매장 메뉴판(PlaceMenuItem)은 { priceType, displayText }, 배달 메뉴는 숫자 문자열. '변동'·범위 가격은 제외
    const rawPrice = typeof value.price === 'object' ? (value.price.priceType === 'fixed' ? value.price.displayText : '') : value.price;
    if (/~|변동|부터/.test(String(rawPrice))) continue;
    const price = Number(String(rawPrice).replace(/[^\d]/g, ''));
    if (!price) continue;
    menus.push({ name: clean(value.name), price, kind: /Baemin|Yogiyo|Delivery/i.test(type) || value.orderType === 'DELIVERY' ? 'delivery' : 'store' });
  }
  return menus;
}

const mode = (values) => {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
};

(async () => {
  const only = process.argv.slice(2);
  fs.mkdirSync(PRICE_DIR, { recursive: true });
  for (const [key, brand] of Object.entries(BRANDS)) {
    if (only.length && !only.includes(key)) continue;
    const ids = await findStores(brand);
    const seen = {}; // name → { store: [prices], delivery: [prices] }
    let used = 0;
    for (const id of ids) {
      if (used >= MAX_STORES) break;
      let menus = [];
      await sleep(400);
      try {
        menus = await storeMenus(id);
      } catch {
        continue;
      }
      if (menus.length === 0) continue;
      used++;
      for (const m of menus) {
        seen[m.name] = seen[m.name] || { store: [], delivery: [] };
        seen[m.name][m.kind].push(m.price);
      }
    }
    // 이전 수집분에 이어 붙입니다(검색 결과가 실행마다 달라 한 번에 다 잡히지 않음). 매장 메뉴판 가격이 배달 가격보다 우선.
    const file = path.join(PRICE_DIR, key + '.json');
    const result = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    for (const [name, prices] of Object.entries(seen)) {
      const kind = prices.store.length > 0 ? 'store' : 'delivery';
      if (result[name] && result[name].kind === 'store' && kind === 'delivery') continue;
      result[name] = { price: mode(prices[kind]), kind, stores: prices[kind].length };
    }
    fs.writeFileSync(file, JSON.stringify(result, null, 1));
    const kinds = Object.values(result).reduce((acc, r) => ({ ...acc, [r.kind]: (acc[r.kind] || 0) + 1 }), {});
    console.log(`[${key}] ${brand}: 매장 ${used}/${ids.length}곳, 메뉴 ${Object.keys(result).length}건 ${JSON.stringify(kinds)}`);
  }
})();
