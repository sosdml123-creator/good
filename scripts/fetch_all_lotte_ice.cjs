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
  const allLotteProducts = [];
  
  // Page 1 is from the main page
  const page1Html = fs.readFileSync('scripts/lotte_lc700.html', 'utf-8');
  parsePage(page1Html, allLotteProducts);

  // Pages 2, 3, 4 from /brand/more/product
  for (let page = 2; page <= 4; page++) {
    const url = `https://www.lottewellfood.com/brand/more/product?page=${page}&searchType1=LC700&searchType2=Y&searchLangType=ko`;
    const html = await fetch(url);
    parsePage(html, allLotteProducts);
  }

  console.log(`Total Lotte ice creams parsed: ${allLotteProducts.length}`);
  console.log('Sample Lotte products:', allLotteProducts.slice(0, 15));
  fs.writeFileSync('scripts/lotte_products.json', JSON.stringify(allLotteProducts, null, 2), 'utf-8');
}

function parsePage(html, list) {
  const regex = /<li[^>]*data-class="page"[^>]*>[\s\S]*?data-value='([^']+)'[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<div class="fnt-title-s3">\s*<span>([^<]+)<\/span>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const dataVal = JSON.parse(match[1]);
    list.push({
      seq: dataVal.seq,
      name: match[3].trim(),
      img: match[2].trim()
    });
  }
}

run();
