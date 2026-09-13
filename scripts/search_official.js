async function searchCU(searchWord) {
  try {
    const res = await fetch('https://cu.bgfretail.com/product/productAjax.do', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: `pageIndex=1&listType=1&searchMainCategory=&searchSubCategory=&searchWord=${encodeURIComponent(searchWord)}`
    });
    const html = await res.text();
    const matches = [...html.matchAll(/<li class="prod_list">[\s\S]*?<div class="name"><p>([\s\S]*?)<\/p><\/div>[\s\S]*?<div class="price"><strong>([\s\S]*?)<\/strong>[\s\S]*?<img src="([^"]+)"/g)];
    console.log(`\n=== CU Search: "${searchWord}" (${matches.length} results) ===`);
    matches.forEach(m => {
      let img = m[3];
      if (img.startsWith('//')) img = 'https:' + img;
      console.log({
        name: m[1].replace(/<[^>]+>/g, '').trim(),
        price: m[2].trim(),
        img
      });
    });
  } catch (e) {
    console.error(`CU search error (${searchWord}):`, e.message);
  }
}

async function search7Eleven(searchWord) {
  try {
    const res = await fetch('https://www.7-eleven.co.kr/product/presentList.asp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: `pageNo=1&pTab=1&searchWord=${encodeURIComponent(searchWord)}`
    });
    const html = await res.text();
    const regex = /<img src="([^"]+)"\s+alt="([^"]+)"[\s\S]*?<div class='price'[^>]*>[\s\S]*?<span>([^<]+)<\/span>/g;
    let m;
    console.log(`\n=== 7-Eleven Search: "${searchWord}" ===`);
    while ((m = regex.exec(html)) !== null) {
      let img = m[1].trim();
      if (!img.startsWith('http')) img = 'https://www.7-eleven.co.kr' + img;
      console.log({
        name: m[2].trim(),
        price: m[3].trim(),
        img
      });
    }
  } catch (e) {
    console.error(`7-Eleven error:`, e.message);
  }
}

async function searchEmart24(searchWord) {
  try {
    const res = await fetch(`https://www.emart24.co.kr/goods/pl?searchWord=${encodeURIComponent(searchWord)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    const blocks = [...html.matchAll(/<div class="itemWrap">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g)];
    console.log(`\n=== Emart24 Search: "${searchWord}" (${blocks.length} results) ===`);
    for (const b of blocks) {
      const imgM = b[1].match(/src="([^"]+)"/);
      const nameM = b[1].match(/<div class="itemtitle">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      const priceM = b[1].match(/<p class="price">([\s\S]*?)<\/p>/) || b[1].match(/<span class="price">([\s\S]*?)<\/span>/);
      if (nameM) {
        console.log({
          name: nameM[1].replace(/<[^>]+>/g, '').trim(),
          price: priceM ? priceM[1].replace(/[^0-9]/g, '') : '',
          img: imgM ? imgM[1] : ''
        });
      }
    }
  } catch (e) {
    console.error(`Emart24 error:`, e.message);
  }
}

async function run() {
  // CU
  await searchCU('연세');
  await searchCU('통통이');
  await searchCU('홍게');
  await searchCU('백종원');
  await searchCU('급식');
  await searchCU('하이볼');

  // 7-Eleven
  await search7Eleven('대파라면');
  await search7Eleven('참치라면');
  await search7Eleven('제주우유');
  await search7Eleven('맛장우');
  await search7Eleven('팝콘');
  await search7Eleven('만두');

  // Emart24
  await searchEmart24('대파라면');
  await searchEmart24('속풀');
  await searchEmart24('민생');
  await searchEmart24('팝콘');
  await searchEmart24('고구마');
  await searchEmart24('조선호텔');
  await searchEmart24('박은영');
  await searchEmart24('하루이리터');
}

run();
