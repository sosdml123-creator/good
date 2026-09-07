const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length }));
    }).on('error', e => resolve({ error: e.message }));
  });
}

async function run() {
  console.log(await fetch('https://www.ht.co.kr'));
}
run();
