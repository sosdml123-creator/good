// 스타벅스 네이버 주문 메뉴판 가격 (2026-10-11 기준, 사용자가 네이버 주문 화면에서 확인해 전달한 값)
// 1) prices/starbucks.json 에 매장 가격으로 반영
// 2) 공식 홈페이지 목록에 없는 디카페인·1/2디카페인·블론드 메뉴는 기본 메뉴의 이미지·설명을 써서 out/starbucks-order.json 에 추가
// 실행: node scripts/menu/coffee.cjs starbucks 이후 node scripts/menu/starbucks-order.cjs
const fs = require('fs');
const path = require('path');
const { save, OUT_DIR } = require('./lib.cjs');

// 디카페인·1/2디카페인(+300원)·블론드(동일가)로도 주문할 수 있는 에스프레소 메뉴
const ESPRESSO = `
스타벅스 자몽 허니 에어로카노|6100
블랙 글레이즈드 라떼|6700
스타벅스 에어로카노|4900
시그니처 코르타도|5800
밀크카라멜 라떼|5800
플랫 화이트|5800
카페 아메리카노|4700
카페 라떼|5200
바닐라 라떼|5200
스타벅스 돌체 라떼|6100
카페 모카|5700
카푸치노|5200
카라멜 마키아또|6100
화이트 초콜릿 모카|6100
커피 스타벅스 더블 샷|5300
바닐라 스타벅스 더블 샷|5300
헤이즐넛 스타벅스 더블 샷|5300
에스프레소|3900
에스프레소 마키아또|3900
에스프레소 콘 파나|4100
더블 에스프레소 칩 프라푸치노|6500
에스프레소 프라푸치노|5700
`;

const OTHERS = `
글레이즈드 폼 블랙 티|6300
유자 말차 V 피지오|6700
유자 V 피지오|6500
바닐라 아인슈페너 콜드 브루|6100
프렌치 바닐라 콜드 브루|6300
바닐라 크림 콜드 브루|6000
돌체 콜드 브루|6000
콜드 브루|5100
스위트 밀크 커피|5700
브루드 커피|4500
블루베리 딜라이트 요거트 블렌디드|6700
자몽 허니 레몬 블렌디드|6300
제주 말차 크림 프라푸치노|6500
자바 칩 프라푸치노|6500
딸기 딜라이트 요거트 블렌디드|6500
망고 바나나 블렌디드|6600
초콜릿 크림 칩 프라푸치노|6200
카라멜 프라푸치노|6100
망고 패션 프루트 블렌디드|5600
말차 글레이즈드 티 라떼|6700
호지 글레이즈드 티 라떼|6700
퓨어 말차|5100
퓨어 호지차|5100
복숭아 핫 티|6100
복숭아 아이스 티|6100
스타벅스 클래식 밀크 티|6100
제주 말차 라떼|6100
유자 민트 티|6100
자몽 허니 블랙 티|5900
제주 녹차|5300
얼 그레이 티|4500
잉글리쉬 브렉퍼스트 티|4500
유스베리 티|4500
히비스커스 블렌드 티|4500
민트 블렌드 티|4500
캐모마일 블렌드 티|4500
핑크 피치 리프레셔|4900
쿨 라임 피지오|6100
피치 딸기 피지오|6100
체리&자두 에너지 피지오|6300
라이트 핑크 자몽 피지오|6300
카스텔라 고구마 라떼|6900
스타벅스 딸기 라떼|6500
시그니처 핫 초콜릿|5900
스팀 우유|4100
우유|4100
스퀴즈드 오렌지 주스 100ML|3800
딸기주스 190ML|4500
유기농 오렌지 100% 주스 190ML|4900
딸기 가득 요거트 190ML|4100
햇사과 주스 190ML|4700
망고주스 190ML|4700
케일&사과주스 190ML|4000
한라봉주스 190ML|4700
블루베리 요거트 190ML|4500
에비앙 500ML|3300
에비앙 스파클링 330ML|3800
유기농 스파클링 애플 주스 296ML|4800
`;

const parse = (text) => text.trim().split('\n').map((line) => {
  const [name, price] = line.split('|');
  return { name, price: Number(price) };
});

const DECAF_EXTRA = 300;
const espresso = parse(ESPRESSO);
const variants = [];
for (const base of espresso) {
  // 코르타도만 이름 규칙이 다름: 시그니처 코르타도 / 디카페인 코르타도 / (블론드) 코르타도
  const core = base.name.replace(/^시그니처 코르타도$/, '코르타도');
  variants.push({ base, name: `디카페인 ${core}`, price: base.price + DECAF_EXTRA });
  variants.push({ base, name: `1/2디카페인 ${core}`, price: base.price + DECAF_EXTRA });
  variants.push({ base, name: core === '코르타도' ? '코르타도' : `블론드 ${core}`, price: base.price });
}

// 1) 가격표 반영 (매장 가격이므로 기존 값보다 우선)
const priceFile = path.join(__dirname, 'prices', 'starbucks.json');
const prices = fs.existsSync(priceFile) ? JSON.parse(fs.readFileSync(priceFile, 'utf8')) : {};
for (const item of [...espresso, ...parse(OTHERS), ...variants]) {
  prices[item.name] = { price: item.price, kind: 'store', stores: 1 };
}
fs.writeFileSync(priceFile, JSON.stringify(prices, null, 1));

// 2) 디카페인·블론드 메뉴를 기본 메뉴의 이미지로 등록
const official = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'starbucks.json'), 'utf8')).items;
const norm = (s) => s.replace(/[^0-9a-zA-Z가-힣]/g, '');
const byName = new Map(official.map((item) => [norm(item.name), item]));
const added = [];
const skipped = [];
for (const v of variants) {
  if (byName.has(norm(v.name))) continue; // 공식 목록에 이미 있음
  const base = byName.get(norm(v.base.name)) || byName.get(norm(`아이스 ${v.base.name}`));
  if (!base) {
    skipped.push(v.name);
    continue;
  }
  added.push({ name: v.name, sub: base.sub, image: base.image, price: v.price, desc: base.desc, url: base.url });
}
// save() 는 파일명과 같은 key 를 쓰므로, 빌드에서 스타벅스로 묶이도록 key 만 바꿔 다시 저장
save('starbucks-order', '스타벅스', added);
const outFile = path.join(OUT_DIR, 'starbucks-order.json');
const out = JSON.parse(fs.readFileSync(outFile, 'utf8'));
out.key = 'starbucks';
fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
if (skipped.length) console.log(`기본 메뉴 이미지가 없어 건너뜀 ${skipped.length}건: ${skipped.join(', ')}`);
