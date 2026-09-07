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
  const html = await fetch('https://www.lottewellfood.com/brand/product');
  console.log('Lotte product HTML length:', html.length);
  fs.writeFileSync('scripts/lotte_product.html', html.substring(0, 30000), 'utf-8');

  // Check categories or icecream keywords
  const iceMatches = html.match(/[^<>\n]*(?:아이스|빙과|월드콘|설레임|돼지바|스크류바)[^<>\n]*/gi) || [];
  console.log('Ice matches in Lotte:', iceMatches.slice(0, 10));

  // Check script or ajax endpoints
  const apiMatches = html.match(/[\w_-]*(?:api|ajax|url|list|product)[\w_-]*\s*[:=]\s*["'][^"']+["']/gi) || [];
  console.log('Api matches in Lotte:', apiMatches.slice(0, 10));
}

run();
