// 배스킨라빈스 · 도미노피자 · 피자스쿨 · 파리바게뜨 공식 메뉴 수집
const { getText, getTextEncoded, clean, absolute, save } = require('./lib.cjs');

async function baskinrobbins() {
  const base = 'https://www.baskinrobbins.co.kr';
  const cats = [
    ['list.php?category=A', '아이스크림'],
    ['list.php?category=F', '프리팩'],
    ['list.php?category=B', '아이스크림 케이크'],
    ['list.php?category=E', '디저트'],
    ['list_subcategory.php?category=C', '음료'],
    ['list_subcategory.php?category=D', '커피'],
  ];
  const items = [];
  for (const [path, sub] of cats) {
    let html = '';
    try {
      html = await getText(`${base}/menu/${path}`);
    } catch {
      continue;
    }
    for (const m of html.matchAll(/href="(view\.php\?seq=\d+)"[^>]*>\s*<img src="([^"]+)" alt="([^"]*)"/g)) {
      items.push({ name: m[3], sub, image: absolute(m[2], base), url: `${base}/menu/${m[1]}` });
    }
  }
  save('baskinrobbins', '배스킨라빈스', items);
}

async function dominos() {
  const base = 'https://web.dominos.co.kr';
  const cats = { C0101: '피자', C0201: '사이드디시', C0202: '음료·기타' };
  const items = [];
  for (const [code, sub] of Object.entries(cats)) {
    const html = await getTextEncoded(`${base}/goods/list?dsp_ctgr=${code}`, 'euc-kr');
    for (const li of html.split('<div class="prd-img">').slice(1)) {
      const image = (li.match(/data-src="([^"]+)"/) || [])[1];
      const href = (li.match(/<a href="(detail\?[^"]+)"/) || [])[1];
      const name = (li.match(/<div class="subject">\s*([\s\S]*?)(?:<div|<\/div>)/) || [])[1];
      // 피자는 L 사이즈 기준 가격
      const price = (li.match(/size_l">L<\/span>\s*([\d,]+)/) || li.match(/class="price">[\s\S]*?([\d,]{4,})/) || [])[1];
      const desc = [...li.matchAll(/<span>#([^<]+)<\/span>/g)].map((m) => m[1]).join(' ');
      items.push({
        name,
        sub,
        image,
        price,
        desc,
        volume: sub === '피자' ? 'L 사이즈 기준' : '',
        url: href ? `${base}/goods/${href.replace(/&amp;/g, '&')}` : `${base}/goods/list?dsp_ctgr=${code}`,
      });
    }
  }
  save('dominos', '도미노피자', items);
}

async function pizzaschool() {
  const base = 'http://pizzaschool.net';
  const html = await getText(`${base}/menu/`);
  const filters = {};
  for (const m of html.matchAll(/data-filter="(\w+_sort)"[^>]*>\s*<span class="inner_sort_button"><span>([^<]+)</g)) filters[m[1]] = clean(m[2]);
  const items = [];
  for (const entry of html.split("<div data-ajax-id='").slice(1)) {
    const name = (entry.match(/title='([^']+)'/) || [])[1];
    const href = (entry.match(/<a href="([^"]+)"/) || [])[1];
    const image = (entry.match(/data-src="([^"]+)"/) || entry.match(/<img[^>]+src="(https?:[^"]+)"/) || [])[1];
    const classes = (entry.match(/class='([^']+)'/) || [])[1] || '';
    const subs = classes.split(/\s+/).map((c) => filters[c]).filter((s) => s && !/전체|신메뉴/.test(s));
    if (subs.includes('추가토핑')) continue;
    items.push({ name, sub: /피자/.test(subs[0] || '') ? '피자' : subs[0] || '피자', image: (image || '').replace(/&amp;/g, '&'), url: href });
  }
  save('pizzaschool', '피자스쿨', items);
}

// 파리바게뜨 상품 목록은 'SHOW MORE' ajax(pb_get_product_list)로 이어 받습니다.
async function parisbaguetteAll() {
  const base = 'https://www.paris.co.kr';
  const cats = { '브레드': '빵', '케이크': '케이크', '샌드위치-샐러드': '샌드위치·샐러드', '디저트-스낵': '디저트·스낵', '커피-음료': '커피·음료', '선물': '선물', '퍼스트클래스키친': '간편식' };
  const items = [];
  for (const [cat, sub] of Object.entries(cats)) {
    for (let page = 1; page <= 40; page++) {
      const query = new URLSearchParams({ action: 'pb_get_product_list', cat1: cat, cat2: '', per_page: '40', paged: String(page) });
      let html = '';
      try {
        html = await getText(`${base}/wp-admin/admin-ajax.php?${query}`, { headers: { 'X-Requested-With': 'XMLHttpRequest', Referer: `${base}/products/` } });
      } catch {
        break;
      }
      const found = [...html.matchAll(/<a href="(https:\/\/www\.paris\.co\.kr\/product\/[^"]+)"[^>]*>[\s\S]*?<img src="(https:[^"]+)" class="product-tb">[\s\S]*?class="product-name">([\s\S]*?)<\/h3>/g)];
      if (found.length === 0) break;
      for (const m of found) {
        items.push({ name: m[3], sub, image: encodeURI(m[2].replace(/-600x600(\.\w+)$/, '$1')), url: m[1] });
      }
      const total = Number((html.match(/data-total-count="(\d+)"/) || [])[1] || 0);
      if (total && page * 40 >= total) break;
    }
  }
  save('parisbaguette', '파리바게뜨', items);
}

(async () => {
  const only = process.argv.slice(2);
  for (const job of [baskinrobbins, dominos, pizzaschool, parisbaguetteAll]) {
    if (only.length && !only.includes(job.name)) continue;
    try {
      await job();
    } catch (err) {
      console.log(`[${job.name}] 실패: ${err.message}`);
    }
  }
})();
