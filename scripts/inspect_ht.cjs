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
  const html = await fetch('https://www.ht.co.kr');
  fs.writeFileSync('scripts/ht_home.html', html, 'utf-8');
  const links = html.match(/href="[^"]*(?:product|ice|brand)[^"]*"/gi) || [];
  console.log('HT links:', links.slice(0, 15));
}
run();
