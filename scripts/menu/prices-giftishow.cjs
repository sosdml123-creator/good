// 기프티쇼 비즈 상품 카탈로그의 단품 교환권 정가(realPrice)를 가격 출처로 추가
// 네이버 플레이스에서 못 찾은 메뉴만 채웁니다 (prices/<key>.json 에 kind: 'coupon' 으로 병합).
// 실행: node scripts/menu/prices-giftishow.cjs   (.env 의 GIFTISHOW_AUTH_CODE / GIFTISHOW_AUTH_TOKEN 사용)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const PRICE_DIR = path.join(__dirname, 'prices');

const BRANDS = {
  mcdonalds: '맥도날드',
  burgerking: '버거킹',
  momstouch: '맘스터치',
  starbucks: '스타벅스',
  paikdabang: '빽다방',
  ediya: '이디야',
  theventi: '더벤티',
  paulbassett: '폴바셋',
  baskinrobbins: '배스킨라빈스',
  pizzaschool: '피자스쿨',
  parisbaguette: '파리바게뜨',
};

function readEnv() {
  const env = {};
  for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

(async () => {
  const env = readEnv();
  if (!env.GIFTISHOW_AUTH_CODE || !env.GIFTISHOW_AUTH_TOKEN) throw new Error('.env 에 GIFTISHOW 키가 없습니다.');
  const goods = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch('https://bizapi.giftishow.com/bizApi/goods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        api_code: '0101',
        custom_auth_code: env.GIFTISHOW_AUTH_CODE,
        custom_auth_token: env.GIFTISHOW_AUTH_TOKEN,
        dev_yn: 'N',
        start: String(page),
        size: '3000',
      }),
      signal: AbortSignal.timeout(60000),
    });
    const json = await res.json();
    if (json?.code !== '0000') throw new Error(`기프티쇼 상품 조회 실패: ${json?.code || 'unknown'}`);
    const list = json.result?.goodsList || [];
    goods.push(...list);
    if (list.length < 3000) break;
  }
  console.log(`카탈로그 ${goods.length}건`);

  for (const [key, brand] of Object.entries(BRANDS)) {
    const file = path.join(PRICE_DIR, `${key}.json`);
    const table = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    let added = 0;
    let candidates = 0;
    for (const g of goods) {
      if (!String(g.brandName || '').replace(/\s/g, '').includes(brand)) continue;
      if (g.goodsStateCd !== 'SALE' || g.goodsTypeNm === '상품권' || !(g.realPrice > 0)) continue;
      let name = String(g.goodsName || '').trim();
      // 여러 메뉴 묶음·금액권은 단품 가격이 아니므로 제외
      if (/\+|세트|콤보|금액권|모바일|교환권 \d|\d+만원|\d+천원|2잔|2개|3개|4개/.test(name)) continue;
      // 사이즈 표기(T, Tall, R 등)는 기본 사이즈로 보고 이름에서 제거
      name = name.replace(/\s*\(?\b(T|Tall|톨|R|Regular|레귤러|S|M)\)?$/i, '').trim();
      if (!name) continue;
      candidates++;
      if (table[name]) continue;
      table[name] = { price: Number(g.realPrice), kind: 'coupon', stores: 1 };
      added++;
    }
    fs.mkdirSync(PRICE_DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(table, null, 1));
    console.log(`[${key}] ${brand}: 단품 교환권 ${candidates}건 중 ${added}건 추가`);
  }
})().catch((err) => {
  console.log(`실패: ${err.message}`);
  process.exit(1);
});
