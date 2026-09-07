const https = require('https');

function fetchFollow(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      timeout: 10000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('Redirecting to:', res.headers.location);
        return fetchFollow(res.headers.location).then(resolve);
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function run() {
  const res = await fetchFollow('https://www.haagendazs.co.kr');
  console.log('HD status:', res.status);
  if (res.body) {
    console.log('HD length:', res.body.length);
    const links = res.body.match(/href="[^"]*(?:product|flavor|menu|ice)[^"]*"/gi) || [];
    console.log('HD links:', links ? links.slice(0, 10) : 'none');
  }
}

run();
