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
  const html = await fetch('https://www.bing.co.kr/product/all');
  console.log('HTML length:', html.length);
  fs.writeFileSync('scripts/bing_all.html', html.substring(0, 50000), 'utf-8');

  // Let's find category tabs or product items
  const tabMatches = html.match(/<a[^>]*href="\/product\/list\?type=\d+"[^>]*>([\s\S]*?)<\/a>/gi);
  console.log('Category tabs:', tabMatches);

  // Let's find product items:
  // Usually <li ... or <div class="item" or similar
  const itemMatches = html.match(/<div class="[^"]*prod[^"]*"[\s\S]*?<\/div>/gi) ||
                      html.match(/<li[\s\S]*?<\/li>/gi);
  console.log('Found items count:', itemMatches ? itemMatches.length : 0);
  
  // Search for '메로나' or '투게더' snippet
  const meronaIdx = html.indexOf('메로나');
  if (meronaIdx !== -1) {
    console.log('Snippet around 메로나:');
    console.log(html.substring(meronaIdx - 200, meronaIdx + 500));
  }
}

run();
