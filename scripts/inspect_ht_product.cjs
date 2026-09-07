const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 8000
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const html = await fetch('https://www.ht.co.kr/product/list');
  console.log('HT product list length:', html.length);
  fs.writeFileSync('scripts/ht_product.html', html, 'utf-8');
  
  // Find categories
  const catMatches = html.match(/<a[^>]*href="[^"]*category[^"]*"[^>]*>([\s\S]*?)<\/a>/gi) ||
                     html.match(/<a[^>]*href="\/product\/list\?[^"]*"[^>]*>([\s\S]*?)<\/a>/gi);
  console.log('HT category matches:', catMatches);
  
  // Check if ice cream is in Haitai Confectionery (ht.co.kr) or if it moved to binggrae
  // In 2020, Haitai Ice Cream was sold to Binggrae!
  ['부라보', '바밤바', '누가바', '쌍쌍바', '폴라포', '탱크보이'].forEach(k => {
    console.log(k, html.includes(k));
  });
}
run();
