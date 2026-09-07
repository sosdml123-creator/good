const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
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
  const html = await fetch('https://www.bing.co.kr/product/list?type=1');
  console.log('HTML length:', html.length);
  fs.writeFileSync('scripts/bing_ice.html', html, 'utf-8');

  // Check for products
  const links = html.match(/href="\/product\/detail\?id=\d+"[^>]*>/gi) ||
                html.match(/href="[^"]*detail[^"]*"/gi) ||
                html.match(/<img[^>]*alt="[^"]*"[^>]*>/gi);
  console.log('Sample matches:', links ? links.slice(0, 20) : 'none');

  // Let's check subcategories or pagination or ajax
  const ajaxMatches = html.match(/[\w_]*url[\w_]*\s*:\s*["'][^"']+["']/gi);
  console.log('Ajax urls:', ajaxMatches);
}

run();
