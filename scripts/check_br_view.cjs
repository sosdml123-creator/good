const fs = require('fs');
const https = require('https');

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
  const html = await fetch('https://www.baskinrobbins.co.kr/menu/view.php?seq=1139');
  fs.writeFileSync('scripts/br_view.html', html, 'utf-8');
  
  // Find where 도쿄바나나 occurs
  let pos = 0;
  while (true) {
    const idx = html.indexOf('도쿄바나나', pos);
    if (idx === -1) break;
    console.log('--- At index', idx);
    console.log(html.substring(idx - 100, idx + 250));
    pos = idx + 10;
  }
}

run();
