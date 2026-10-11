// 맥도날드 · 버거킹 · 맘스터치 공식 메뉴 수집
const { getJson, getText, request, clean, absolute, save } = require('./lib.cjs');

async function mcdonalds() {
  const base = 'https://www.mcdonalds.co.kr';
  const api = `${base}/api/v1/kor/product/product/list`;
  // 맥런치(7)·해피스낵(8)은 다른 분류의 할인 구성, 해피밀(3)은 세트 구성이라 제외
  const mains = [1, 4, 2, 5];
  const bySeq = new Map();
  for (const main of mains) {
    const head = await getJson(`${api}?page=1&view_rows=6&mainCategory=${main}&subCategory=0&searchWord`);
    const mainName = head.resultObject.mainCategory.find((c) => c.seq === main)?.korName || '';
    for (const sub of head.resultObject.subCategory || []) {
      if (/전체/.test(sub.korName)) continue;
      const res = await getJson(`${api}?page=1&view_rows=300&mainCategory=${main}&subCategory=${sub.seq}&searchWord`);
      for (const p of res.resultObject.list || []) {
        if (bySeq.has(p.seq) || !p.pcImageUrl) continue;
        const hasSingle = String(p.menuStatus || '').includes('단품');
        let name = clean(p.korName);
        // 목록은 세트 기준으로 노출되므로 단품이 있는 메뉴는 단품명으로 등록
        if (hasSingle) name = name.replace(/\s*세트$/, '');
        // 사이즈만 다른 음료는 한 건으로 등록
        if (main === 5) name = name.replace(/\s+(Small|Medium|Large)$/i, '');
        bySeq.set(p.seq, {
          name,
          sub: main === 1 ? '버거' : main === 2 ? '맥모닝' : clean(sub.korName).replace(/ 메뉴$/, '') || mainName,
          image: encodeURI(absolute(p.pcImageUrl, base)),
          desc: clean(String(p.korContent || '').split(/\*\s*판매/)[0]),
          calories: hasSingle ? '' : p.calorie,
          url: `${base}/kor/menu/detail/${p.seq}/${p.rnum}/${sub.seq}`,
        });
      }
    }
  }
  save('mcdonalds', '맥도날드', [...bySeq.values()]);
}

async function burgerking() {
  const msg = {
    header: { result: true, error_code: '', error_text: '', info_text: '', message_version: '', login_session_id: '', trcode: 'BKR0632', is_cryption: false },
    body: { menuKeywordList: [] },
  };
  const res = await request('https://www.burgerking.co.kr/burgerking/BKR0632.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Referer: 'https://www.burgerking.co.kr/menu/main',
      Origin: 'https://www.burgerking.co.kr',
    },
    body: 'message=' + encodeURIComponent(JSON.stringify(msg)),
  });
  const data = await res.json();
  const subOf = (cat) => (/사이드/.test(cat) ? '사이드' : /음료|디저트/.test(cat) ? '음료·디저트' : /모닝/.test(cat) ? '모닝' : /스낵/.test(cat) ? '스낵' : '버거');
  const items = [];
  for (const cat of data.body.allMenuList) {
    if (/추천/.test(cat.menuCategoryNm)) continue;
    for (const m of cat.menuInfo) {
      const name = clean(m.menuNm);
      // 세트·콤보·팩 구성은 제외하고 단품만 등록
      if (/세트|콤보|팩\d*$|\+|소스$|시즈닝$/.test(name) || /\+/.test(m.menuComponents || '')) continue;
      items.push({
        name,
        sub: subOf(cat.menuCategoryNm),
        image: m.menuImgPath || m.menuImgMPath,
        url: 'https://www.burgerking.co.kr/menu/main',
      });
    }
  }
  save('burgerking', '버거킹', items);
}

async function momstouch() {
  const base = 'https://momstouch.co.kr';
  const cats = { CG0005: '버거', CG0004: '치킨', CG0045: '치킨', CG0002: '사이드', CG0001: '음료', CG0046: '피자' };
  const items = [];
  for (const [code, sub] of Object.entries(cats)) {
    for (let page = 1; page <= 15; page++) {
      const html = await getText(`${base}/menu/new.php?pageNo=${page}&s_sect1=${code}`);
      const block = html.split('menu-list')[1] || '';
      const lis = [...block.matchAll(/go_view\('(\d+)'\)[\s\S]*?url\('([^']+)'\)[\s\S]*?<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)];
      if (lis.length === 0) break;
      for (const m of lis) {
        items.push({ name: m[3].replace(/<span>[\s\S]*?<\/span>/g, ''), sub, image: absolute(m[2], base), desc: m[4], url: `${base}/menu/view.php?idx=${m[1]}` });
      }
      if (!new RegExp(`pageNo=${page + 1}&`).test(html)) break;
    }
  }
  save('momstouch', '맘스터치', items);
}

(async () => {
  for (const job of [mcdonalds, burgerking, momstouch]) {
    try {
      await job();
    } catch (err) {
      console.log(`[${job.name}] 실패: ${err.message}`);
    }
  }
})();
