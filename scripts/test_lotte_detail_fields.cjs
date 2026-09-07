const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const lotteList = JSON.parse(fs.readFileSync('scripts/lotte_products.json', 'utf-8'));
  for (const item of lotteList.slice(0, 4)) {
    const html = await fetch(`https://www.lottewellfood.com/brand/detail/product?seq=${item.seq}&lang=ko`);
    console.log(`=== Lotte: ${item.name} (${item.seq}) ===`);
    const title = html.match(/<div class="fnt-title6">\s*<span>([^<]+)<\/span>/i);
    const sub = html.match(/<div class="fnt-text1">\s*<span>([^<]+)<\/span>/i);
    const desc = html.match(/<div class="fnt-text2">\s*<span>([^<]+)<\/span>/i);
    console.log('Title:', title ? title[1].trim() : 'none');
    console.log('Sub:', sub ? sub[1].trim() : 'none');
    console.log('Desc:', desc ? desc[1].trim() : 'none');
    
    // Check images in swiper
    const imgs = html.match(/<img[^>]+src="([^"]+)"/gi) || [];
    console.log('Images:', imgs.slice(0, 2));
  }
}

run();
