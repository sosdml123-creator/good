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
  const html = await fetch('https://www.bing.co.kr/product/detail?PDT=6');
  const idx = html.indexOf('function get_idt_info');
  if (idx !== -1) {
    console.log(html.substring(idx, idx + 2000));
  }
}

run();
