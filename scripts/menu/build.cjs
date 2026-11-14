// scripts/menu/out/*.json (브랜드 공식 메뉴 수집 결과) → src/data/officialMenuProducts.ts
// 이미 등록된 제품(번들 데이터 + 운영 DB)과 이름이 겹치는 항목은 제외합니다.
// 실행: node scripts/menu/build.cjs
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..', '..');
const OUT_DIR = path.join(__dirname, 'out');
const TARGET = path.join(ROOT, 'src', 'data', 'officialMenuProducts.ts');
const ID_PREFIX = 'om-';

const CATEGORIES = ['패스트푸드', '음료', '빵·디저트', '아이스크림', '간편식', '과자'];

// 브랜드별 기본 카테고리와, 세부 분류에 따른 예외
const BRANDS = {
  mcdonalds: { category: '패스트푸드' },
  burgerking: { category: '패스트푸드' },
  momstouch: { category: '패스트푸드' },
  kfc: { category: '패스트푸드' },
  lotteria: { category: '패스트푸드' },
  dominos: { category: '패스트푸드' },
  pizzaschool: { category: '패스트푸드' },
  pizzahut: { category: '패스트푸드' },
  pizzaalvolo: { category: '패스트푸드' },
  starbucks: { category: '음료', bySub: [[/브레드|케이크|샌드위치|푸드|과일|요거트|스낵|디저트|아이스크림/, '빵·디저트']] },
  paikdabang: { category: '음료', bySub: [[/디저트/, '빵·디저트']] },
  ediya: { category: '음료', bySub: [[/베이커리|스낵/, '빵·디저트']] },
  theventi: { category: '음료', bySub: [[/사이드/, '빵·디저트']] },
  paulbassett: { category: '음료', bySub: [[/아이스크림/, '아이스크림'], [/푸드/, '빵·디저트']] },
  twosome: { category: '음료', bySub: [[/케이크|마카롱|디저트|샌드위치|샐러드|베이커리|스낵|빙수/, '빵·디저트']] },
  composecoffee: { category: '음료', bySub: [[/디저트|베이커리|푸드/, '빵·디저트'], [/아이스크림/, '아이스크림']] },
  megacoffee: { category: '음료', bySub: [[/디저트|샌드위치/, '빵·디저트']] },
  hollys: { category: '음료', bySub: [[/베이커리/, '빵·디저트']] },
  coffeebean: { category: '음료', bySub: [[/베이커리|케이크|샌드위치/, '빵·디저트']] },
  baskinrobbins: { category: '아이스크림', bySub: [[/음료|커피/, '음료']] },
  parisbaguette: { category: '빵·디저트', bySub: [[/음료/, '음료'], [/간편식/, '간편식']] },
};

const normalize = (name, brand) =>
  String(name || '')
    .split(brand).join('')
    .replace(/<[^>]+>/g, '')
    .replace(/[^0-9a-zA-Z가-힣]/g, '')
    .toLowerCase();

// 가격 매칭용 키: 상표 기호·공백·브랜드명을 빼고, HOT/ICE 표기는 위치와 무관하게 따로 떼어 비교합니다.
function priceKey(name, brand) {
  const raw = String(name || '')
    .replace(/[®™]/g, '')
    // (시즌)·[배민단독]·[L/J]·(라지/점보) 같은 꼬리표는 메뉴 자체가 아니므로 제거
    .replace(/\((시즌|NEW|new)\)|\[[^\]]*\]|\([^()]*\/[^()]*\)/g, '')
    .replace(/w\s*노란\s*빨대/g, '')
    // '아이스크림'·'아이스티'의 '아이스'가 온도 표기로 읽히지 않게 보호
    .replace(/아이스(크림|티|박스)/g, 'AIS$1')
    .replace(/small/gi, '스몰').replace(/medium/gi, '미디엄').replace(/large/gi, '라지');
  const temp = /아이스|\bice[d]?\b|\(i\)|\[ice\]/i.test(raw) ? 'ice' : /핫|\bhot\b|\(h\)|\[hot\]|따뜻한/i.test(raw) ? 'hot' : '';
  const base = normalize(raw.replace(/아이스|iced?|핫|hot|따뜻한/gi, ''), brand);
  return { base, temp };
}

// scripts/menu/prices/<key>.json (네이버 플레이스 매장 메뉴판·배달 메뉴 가격) → 조회 함수
function loadPriceLookup(key, brand) {
  const file = path.join(__dirname, 'prices', `${key}.json`);
  if (!fs.existsSync(file)) return () => 0;
  const table = new Map();
  for (const [name, info] of Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')))) {
    const { base, temp } = priceKey(name, brand);
    if (!base) continue;
    const id = `${base}|${temp}`;
    // 같은 키가 겹치면 매장 메뉴판 가격을 우선
    if (!table.has(id) || (table.get(id).kind !== 'store' && info.kind === 'store')) table.set(id, info);
  }
  return (name) => {
    const { base, temp } = priceKey(name, brand);
    const order = temp ? [temp, ''] : ['', 'ice', 'hot'];
    // 사이즈 구분 없이 등록한 메뉴는 기본(미디엄/레귤러) 사이즈 가격을 사용
    for (const size of ['', '미디엄', 'm', '레귤러', 'r']) {
      for (const t of order) {
        const hit = table.get(`${base}${size}|${t}`);
        if (hit) return hit.price;
      }
    }
    return 0;
  };
}

function loadBundledProducts() {
  const tmp = path.join(os.tmpdir(), `sinsangpick-products-${process.pid}.cjs`);
  const esbuild = path.join(ROOT, 'node_modules', 'esbuild', 'bin', 'esbuild');
  // 생성 대상 파일이 아직 없어도 번들이 되도록 빈 파일을 먼저 만들어 둡니다.
  if (!fs.existsSync(TARGET)) {
    fs.writeFileSync(TARGET, "import { Product } from '../types';\n\nexport const OFFICIAL_MENU_PRODUCTS: Product[] = [];\n");
  }
  execFileSync(process.execPath, [esbuild, path.join(ROOT, 'src', 'data', 'mockProducts.ts'), '--bundle', '--format=cjs', '--platform=node', `--outfile=${tmp}`, '--log-level=error']);
  const { INITIAL_PRODUCTS } = require(tmp);
  fs.unlinkSync(tmp);
  return INITIAL_PRODUCTS.filter((p) => !String(p.id).startsWith(ID_PREFIX));
}

async function loadServerProducts() {
  try {
    const res = await fetch('https://www.sinsangpick.kr/api/site-content', { signal: AbortSignal.timeout(20000) });
    const data = await res.json();
    return (data.products || []).filter((p) => !String(p.id).startsWith(ID_PREFIX));
  } catch (err) {
    console.log(`운영 DB 조회 실패(번들 데이터만으로 중복 검사): ${err.message}`);
    return [];
  }
}

function commonPrefix(values) {
  if (values.length === 0) return '';
  let prefix = values[0];
  for (const v of values) {
    while (!v.startsWith(prefix)) prefix = prefix.slice(0, -1);
    if (!prefix) break;
  }
  // 경로 구분자에서 끊어 사람이 읽을 수 있게 유지
  return prefix.slice(0, prefix.lastIndexOf('/') + 1);
}

(async () => {
  const existing = [...loadBundledProducts(), ...(await loadServerProducts())];
  const taken = new Map();
  for (const p of existing) {
    if (!taken.has(p.brand)) taken.set(p.brand, new Set());
    taken.get(p.brand).add(normalize(p.name, p.brand));
  }

  const groups = [];
  const usedIds = new Set();
  let total = 0;
  for (const file of fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.json')).sort()) {
    const { key, brand, items } = JSON.parse(fs.readFileSync(path.join(OUT_DIR, file), 'utf8'));
    const meta = BRANDS[key];
    if (!meta) {
      console.log(`[${key}] BRANDS 설정이 없어 건너뜁니다.`);
      continue;
    }
    const names = taken.get(brand) || new Set();
    const fresh = items.filter((item) => {
      const n = normalize(item.name, brand);
      if (!n || names.has(n)) return false;
      names.add(n);
      return true;
    });
    // 공식 홈페이지에 가격이 없는 메뉴는 수집해 둔 매장 가격으로 채웁니다.
    const lookupPrice = loadPriceLookup(key, brand);
    for (const item of fresh) {
      if (!item.price) item.price = lookupPrice(item.name);
    }
    const imageBase = commonPrefix(fresh.map((i) => i.image));
    const urlBase = commonPrefix(fresh.map((i) => i.url).filter(Boolean));
    const rows = fresh.map((item) => {
      let id = `${ID_PREFIX}${key}-${crypto.createHash('sha1').update(item.name).digest('hex').slice(0, 8)}`;
      while (usedIds.has(id)) id += 'x';
      usedIds.add(id);
      const category = (meta.bySub || []).find(([re]) => re.test(item.sub))?.[1] || meta.category;
      return [
        id.slice(ID_PREFIX.length + key.length + 1),
        item.name,
        CATEGORIES.indexOf(category),
        item.sub,
        item.image.slice(imageBase.length),
        item.price,
        item.desc,
        item.calories,
        item.volume,
        item.url ? item.url.slice(urlBase.length) : '',
      ];
    });
    total += rows.length;
    groups.push({ key, brand, imageBase, urlBase, rows });
    console.log(`${brand}: 수집 ${items.length}건 → 신규 ${rows.length}건 (가격 있음 ${fresh.filter((i) => i.price > 0).length}건)`);
  }

  const lines = [
    "import { Product, ProductCategory } from '../types';",
    '',
    '// 자동 생성 파일입니다. 직접 수정하지 말고 scripts/menu/*.cjs 수집 후 `node scripts/menu/build.cjs` 로 다시 만드세요.',
    '// 각 브랜드 공식 홈페이지 메뉴에서 가져온 제품입니다. 공식 홈페이지에 없는 값(가격·평점 등)은 비워 둡니다.',
    '',
    '// [id, 이름, 카테고리 번호, 세부 분류, 이미지, 가격, 설명, 칼로리, 용량, 출처 URL]',
    'type Row = [string, string, number, string, string, number, string, number, string, string];',
    '',
    'interface BrandMenu {',
    '  key: string;',
    '  brand: string;',
    '  imageBase: string;',
    '  urlBase: string;',
    '  rows: Row[];',
    '}',
    '',
    `const CATEGORIES: ProductCategory[] = ${JSON.stringify(CATEGORIES)};`,
    '',
    'const MENUS: BrandMenu[] = [',
  ];
  for (const g of groups) {
    lines.push('  {');
    lines.push(`    key: ${JSON.stringify(g.key)},`);
    lines.push(`    brand: ${JSON.stringify(g.brand)},`);
    lines.push(`    imageBase: ${JSON.stringify(g.imageBase)},`);
    lines.push(`    urlBase: ${JSON.stringify(g.urlBase)},`);
    lines.push('    rows: [');
    for (const row of g.rows) lines.push(`      ${JSON.stringify(row)},`);
    lines.push('    ],');
    lines.push('  },');
  }
  lines.push(
    '];',
    '',
    'export const OFFICIAL_MENU_PRODUCTS: Product[] = MENUS.flatMap((menu) =>',
    '  menu.rows.map(([id, name, category, subCategory, image, price, description, calories, volume, url]): Product => ({',
    `    id: \`${ID_PREFIX}\${menu.key}-\${id}\`,`,
    '    name: `${menu.brand} ${name}`,',
    '    brand: menu.brand,',
    '    category: CATEGORIES[category],',
    '    subCategory,',
    "    itemType: 'restaurant',",
    '    image: menu.imageBase + image,',
    '    releaseDate: `${menu.brand} 공식`,',
    '    price,',
    '    overallRating: 0,',
    '    ratingCount: 0,',
    '    detailedRating: { taste: 0, value: 0, portion: 0, repurchase: 0 },',
    '    description: description || undefined,',
    '    calories: calories || undefined,',
    '    volume: volume || undefined,',
    '    stores: [menu.brand],',
    '    manufacturer: menu.brand,',
    '    isToday: false,',
    '    isHot: false,',
    '    sourceName: `${menu.brand} 공식 홈페이지`,',
    '    sourceUrl: url ? menu.urlBase + url : undefined,',
    '  }))',
    ');',
    ''
  );
  fs.writeFileSync(TARGET, lines.join('\n'));
  console.log(`총 ${total}건 → ${path.relative(ROOT, TARGET)} (${Math.round(fs.statSync(TARGET).size / 1024)}KB)`);
})();
