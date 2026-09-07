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
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function run() {
  const res = await fetch('https://haagendazs.co.kr');
  console.log('HD status:', res.status, 'error:', res.error);
  if (res.body) {
    console.log('HD length:', res.body.length);
    const links = res.body.match(/href="[^"]*(?:product|flavor|menu|shop|ice)[^"]*"/gi) || [];
    console.log('HD links:', links.slice(0, 10));
  }
}

run();
