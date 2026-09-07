const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
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
  const html = await fetch('https://www.lottewellfood.com/brand/product?searchType1=LC700');
  console.log('Lotte LC700 length:', html.length);
  fs.writeFileSync('scripts/lotte_lc700.html', html, 'utf-8');

  // Let's find product cards or subcategories
  const prodItems = html.match(/<li[^>]*class="[^"]*prod[^"]*"[\s\S]*?<\/li>/gi) ||
                    html.match(/<div[^>]*class="[^"]*prod[^"]*"[\s\S]*?<\/div>/gi) ||
                    html.match(/<a[^>]*href="[^"]*product\/detail[^"]*"[\s\S]*?<\/a>/gi);
  console.log('Product elements count:', prodItems ? prodItems.length : 0);

  // Check how products are listed
  const brandSub = html.match(/searchType2=[^"'\s>]+/gi);
  console.log('Subcategory parameters:', brandSub);
  
  // Search for well-known brands: 월드콘, 설레임, 죠스바, 스크류바, 돼지바
  ['월드콘', '설레임', '죠스바', '스크류바', '돼지바', '찰떡아이스', '구구'].forEach(name => {
    console.log(name, html.includes(name));
  });
}

run();
