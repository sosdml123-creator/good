const https = require('https');

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
  const html = await fetch('https://www.lottewellfood.com/brand/detail/product?seq=263&lang=ko');
  console.log('Lotte detail HTML length:', html.length);
  console.log('Detail preview:\n', html.substring(0, 1500));
}

run();
