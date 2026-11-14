// 메가MGC커피 · 컴포즈커피 · 투썸플레이스 · 할리스 · 커피빈 공식 메뉴 수집
// 실행: node scripts/menu/coffee2.cjs [megacoffee compose twosome hollys coffeebean]
const { getText, getJson, request, clean, absolute, save } = require('./lib.cjs');

const pick = (src, re) => (src.match(re) || [])[1] || '';

async function megacoffee() {
  const base = 'https://www.mega-mgccoffee.com';
  // [대분류, 세부 분류 코드, 이름] — 신상품 탭은 본 탭과 겹치므로 마지막에 처리 (save 가 먼저 나온 분류를 남김)
  const cats = [
    [1, 1, '커피'], [1, 2, '티'], [1, 3, '에이드·주스'], [1, 4, '스무디·프라페'], [1, 5, '디카페인'], [1, 6, '음료'],
    [2, 7, '디저트'], [2, 11, '샌드위치'], [1, 9, '음료'], [2, 12, '디저트'],
  ];
  const items = [];
  for (const [c1, cate, sub] of cats) {
    for (let page = 1; page <= 30; page++) {
      const html = await getText(
        `${base}/menu/menu.php?menu_category1=${c1}&menu_category2=${c1}&category=${cate}&list_checkbox_all=&page=${page}`
      );
      const lis = html.split(/<a class="inner_modal_open">/).slice(1);
      if (lis.length === 0) break;
      for (const li of lis) {
        const modal = li.split('class="inner_modal"')[1] || '';
        items.push({
          name: pick(li, /cont_text_title">\s*<div class="text text1">\s*<b>([\s\S]*?)<\/b>/),
          sub,
          image: pick(li, /<img src="([^"]+)"/),
          desc: pick(modal, /kcal\s*<\/div>\s*<\/div>\s*<div class="cont_text">([\s\S]*?)<\/div>/).split(/\*/)[0],
          calories: pick(modal, /1회 제공량\s*([\d.]+)\s*kcal/),
          volume: pick(modal, /컵용량\s*:\s*([\d.]+\s*ml)/i),
          url: `${base}/menu/?menu_category1=${c1}&menu_category2=${c1}`,
        });
      }
    }
  }
  save('megacoffee', '메가MGC커피', items);
}

async function compose() {
  const base = 'https://composecoffee.com';
  const cats = {
    303364: '커피', 303365: '음료', 303366: '프라페·스무디', 303367: '밀크쉐이크',
    303368: '에이드·주스', 303369: '티', 308857: '푸드·디저트', 303371: '아이스크림',
  };
  const items = [];
  for (const [srl, sub] of Object.entries(cats)) {
    const seen = new Set();
    for (let page = 1; page <= 30; page++) {
      const html = await getText(`${base}/index.php?mid=compose&act=dispCafemenuGalleryList&category_srl=${srl}&page=${page}`);
      const found = [...html.matchAll(/item_srl=(\d+)" class="cafemenu-menu-item">[\s\S]*?<img src="([^"]+)"[\s\S]*?cafemenu-menu-name">([\s\S]*?)<\/div>/g)];
      const fresh = found.filter((m) => !seen.has(m[1]));
      if (fresh.length === 0) break;
      for (const m of fresh) {
        seen.add(m[1]);
        items.push({
          // H-/I- 는 온도 구분 표기라 한 메뉴로 묶습니다.
          name: clean(m[3]).replace(/^[HI]\s*-\s*/, ''),
          sub,
          image: absolute(m[2], base),
          url: `${base}/index.php?mid=compose&act=dispCafemenuGalleryItem&category_srl=${srl}&item_srl=${m[1]}`,
        });
      }
    }
  }
  save('composecoffee', '컴포즈커피', items);
}

async function twosome() {
  const base = 'https://mo.twosome.co.kr';
  const post = async (path, body) =>
    (await request(`${base}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
      body: new URLSearchParams(body).toString(),
    })).json();
  const items = [];
  // 5(상품)는 텀블러·원두 등 MD라 제외
  for (const grtCd of ['1', '2', '3', '4']) {
    const mids = (await post('/mn/menuInfoMidListAjax.json', { grtCd })).fetchResultListSet.filter((m) => m.MID_CD !== 'NEW');
    for (const mid of mids) {
      for (let pageNum = 1; pageNum <= 30; pageNum++) {
        const rows = (await post('/mn/menuInfoListAjax.json', { pageNum, grtCd, midCd: mid.MID_CD })).fetchResultListSet || [];
        for (const r of rows) {
          items.push({
            name: r.MENU_NM,
            sub: mid.MID_NM,
            image: `${base}${r.MENU_IMG_02 || r.MENU_IMG}`,
            url: `${base}/mn/menuInfoDetail.do?menuCd=${r.MENU_CD}`,
          });
        }
        if (rows.length === 0 || !rows[0].NEXT_PAGE) break;
      }
    }
  }
  save('twosome', '투썸플레이스', items);
}

async function hollys() {
  const base = 'https://www.hollys.co.kr';
  const pages = { espresso: '커피', signature: '시그니처', hollyccino: '할리치노', tea: '티', juice: '주스·음료', bakery: '베이커리' };
  const items = [];
  for (const [slug, sub] of Object.entries(pages)) {
    const html = await getText(`${base}/menu/${slug}.do`);
    for (const block of html.split(/<div class="menu_view01" id="menuView1_/).slice(1)) {
      const id = pick(block, /^(\d+)/);
      const img = pick(block, /<img src="([^"]+)"/);
      items.push({
        name: pick(block, /<p><span>([\s\S]*?)<\/span>/) || pick(block, /alt="([^"]+)"/),
        sub,
        image: img.startsWith('//') ? `https:${img}` : absolute(img, base),
        desc: pick(block, /<p class="menu_info">([\s\S]*?)<\/p>/).split(/<br\s*\/?>\s*\*/)[0],
        url: `${base}/menu/${slug}.do#${id}`,
      });
    }
  }
  save('hollys', '할리스', items);
}

async function coffeebean() {
  const base = 'https://www.coffeebeankorea.com';
  const cats = {
    13: '에스프레소 음료', 14: '브루드 커피', 17: '티 라떼', 18: '티', 11: '아이스 블렌디드', 12: '아이스 블렌디드',
    24: '기타 음료', 32: '음료', 4: '베이커리', 5: '케이크', 6: '샌드위치·샐러드', 8: '홀케이크',
  };
  const items = [];
  for (const [cat, sub] of Object.entries(cats)) {
    let prevFirst = '';
    for (let page = 1; page <= 20; page++) {
      const html = await getText(`${base}/menu/list.asp?page=${page}&category=${cat}&category2=1`);
      const lis = (html.split('class="menu_list')[1] || '').split(/<li[ >]/).slice(1).filter((li) => li.includes('class="kor"'));
      const first = lis[0] ? pick(lis[0], /class="kor">([\s\S]*?)<\/span>/) : '';
      if (lis.length === 0 || first === prevFirst) break;
      prevFirst = first;
      for (const li of lis) {
        const img = pick(li, /<img src="([^"]+)"/);
        items.push({
          name: pick(li, /class="kor">([\s\S]*?)<\/span>/),
          sub,
          image: encodeURI(decodeURI(absolute(img, base))),
          desc: pick(li, /<\/dt>\s*<dd>([\s\S]*?)<\/dd>/),
          calories: pick(li, /<dt>([\d.]+)<\/dt>\s*<dd>열량/),
          url: `${base}/menu/list.asp?category=${cat}`,
        });
      }
    }
  }
  save('coffeebean', '커피빈', items);
}

(async () => {
  const only = process.argv.slice(2);
  for (const job of [megacoffee, compose, twosome, hollys, coffeebean]) {
    if (only.length && !only.includes(job.name)) continue;
    try {
      await job();
    } catch (err) {
      console.log(`[${job.name}] 실패: ${err.message}`);
    }
  }
})();
