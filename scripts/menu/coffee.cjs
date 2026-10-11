// 스타벅스 · 빽다방 · 이디야커피 · 더벤티 · 폴바셋 공식 메뉴 수집
const { getJson, getText, clean, absolute, save } = require('./lib.cjs');

async function starbucks() {
  const base = 'https://www.starbucks.co.kr';
  const items = [];
  for (const page of ['drink_list.do', 'food_list.do']) {
    const html = await getText(`${base}/menu/${page}`);
    const codes = [...new Set([...html.matchAll(/result = "(W\d{7})"/g)].map((m) => m[1]))];
    for (const code of codes) {
      let data;
      try {
        data = await getJson(`${base}/upload/json/menu/${code}.js`);
      } catch {
        continue;
      }
      for (const p of data.list || []) {
        if (!p.product_NM || !p.file_PATH) continue;
        items.push({
          name: p.product_NM,
          sub: page.startsWith('drink') ? p.cate_NAME || '음료' : p.cate_NAME || '푸드',
          image: encodeURI(`https://image.istarbucks.co.kr${p.file_PATH}`),
          desc: p.content,
          calories: p.kcal,
          url: `${base}/menu/${page.replace('_list', '_view')}?product_cd=${p.product_CD}`,
        });
      }
    }
  }
  save('starbucks', '스타벅스', items);
}

async function paikdabang() {
  const base = 'https://paikdabang.com';
  const cats = { menu_new: '신메뉴', menu_coffee: '커피', menu_drink: '음료', menu_ccino: '빽스치노', menu_dessert: '디저트' };
  const items = [];
  for (const [slug, sub] of Object.entries(cats)) {
    const html = await getText(`${base}/menu/${slug}/`);
    const block = html.split('menu_list')[1] || '';
    for (const li of block.split(/<li>\s*<div class="thumb">/).slice(1)) {
      const image = (li.match(/<img src="([^"]+)"/) || [])[1];
      const name = (li.match(/class="menu_tit">([\s\S]*?)<\/p>/) || [])[1];
      const desc = ((li.match(/<p class="txt">([\s\S]*?)<\/p>/) || [])[1] || '').replace(/<span[\s\S]*?<\/span>/g, '');
      const kcal = (li.match(/칼로리\(kcal\)<\/div>\s*<div>([\d.]+)/) || [])[1];
      const volume = (li.match(/컵용량\s*:\s*([^<]+)</) || [])[1];
      // 신메뉴 탭은 다른 탭과 겹치므로 분류는 뒤 탭 기준으로 덮어씁니다.
      items.push({ name, sub, image: encodeURI(image || ''), desc, calories: kcal, volume, url: `${base}/menu/${slug}/` });
    }
  }
  // 같은 메뉴가 신메뉴 탭과 본 탭에 모두 있으면 본 탭 분류를 사용
  const byName = new Map();
  for (const item of items) {
    const key = clean(item.name);
    if (!byName.has(key) || byName.get(key).sub === '신메뉴') byName.set(key, item);
  }
  save('paikdabang', '빽다방', [...byName.values()]);
}

async function ediya() {
  const base = 'https://www.ediya.com';
  const cats = { 7: '음료', 8: '베이커리', 9: '스낵·MD', 11: '플랫치노' };
  const items = [];
  for (const [cate, sub] of Object.entries(cats)) {
    for (let page = 1; page <= 40; page++) {
      let html = '';
      try {
        html = await getText(`${base}/inc/ajax_brand.php?gubun=menu_more&product_cate=${cate}&chked_val=&skeyword=&page=${page}`, {
          headers: { 'X-Requested-With': 'XMLHttpRequest', Referer: `${base}/contents/drink.html` },
        });
      } catch {
        break;
      }
      const lis = html.split(/<li>\s*<div class="pro_detail"/).slice(1);
      if (lis.length === 0) break;
      for (const li of lis) {
        const name = ((li.match(/<h2>([\s\S]*?)<span>/) || [])[1] || '').replace(/^\((L|EX|R|S)\)\s*/i, '');
        const image = (li.match(/<img src="(\/files\/[^"]+)"/) || [])[1];
        const desc = (li.match(/class="detail_txt">([\s\S]*?)<\/div>/) || [])[1];
        const kcal = (li.match(/칼로리<\/dt><dd>\(([\d.]+)kcal\)/) || [])[1];
        const volume = (li.match(/컵용량\s*:\s*([^<]+)</) || [])[1];
        items.push({ name, sub, image: absolute(image, base), desc, calories: kcal, volume, url: `${base}/contents/drink.html` });
      }
    }
  }
  save('ediya', '이디야커피', items);
}

async function theventi() {
  const base = 'https://www.theventi.co.kr';
  const items = [];
  const html = await getText(`${base}/new2022/menu/all.html`);
  const tabs = [...new Set([...html.matchAll(/href="\?mode=(\d+)"[^>]*>([^<]+)</g)].map((m) => `${m[1]}|${clean(m[2])}`))];
  const pages = tabs.length > 0 ? tabs.map((t) => t.split('|')) : [['', '음료']];
  // 신메뉴 탭(첫 탭)은 다른 탭과 겹치므로 마지막에 처리해 본 분류가 우선되게 합니다.
  for (const [mode, sub] of [...pages.slice(1), pages[0]]) {
    const page = mode ? await getText(`${base}/new2022/menu/all.html?mode=${mode}`) : html;
    for (const m of page.matchAll(/all-view\.new\.html\?uid=(\d+)"[\s\S]*?<img src="([^"]+)"[\s\S]*?<p class="tit">([\s\S]*?)<\/p>/g)) {
      items.push({
        name: m[3],
        sub,
        image: m[2].replace(/^http:/, 'https:'),
        url: `${base}/new2022/menu/all-view.new.html?uid=${m[1]}`,
      });
    }
  }
  save('theventi', '더벤티', items);
}

async function paulbassett() {
  const base = 'https://www.baristapaulbassett.co.kr';
  const cats = { A: '커피', B: '음료', C: '아이스크림', D: '푸드' };
  const items = [];
  for (const [cid, sub] of Object.entries(cats)) {
    let html = '';
    try {
      html = await getText(`${base}/menu/List.pb?cid1=${cid}`);
    } catch {
      continue;
    }
    const block = html.split('class="menuList"')[1] || '';
    for (const m of block.matchAll(/goView\('([^']+)'\)[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?class="txtArea">([\s\S]*?)<span/g)) {
      items.push({ name: m[3], sub, image: absolute(m[2], base), url: `${base}/menu/View.pb?seq=${m[1]}` });
    }
  }
  save('paulbassett', '폴바셋', items);
}

(async () => {
  const only = process.argv.slice(2);
  for (const job of [starbucks, paikdabang, ediya, theventi, paulbassett]) {
    if (only.length && !only.includes(job.name)) continue;
    try {
      await job();
    } catch (err) {
      console.log(`[${job.name}] 실패: ${err.message}`);
    }
  }
})();
