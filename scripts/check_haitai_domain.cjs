const https = require('https');

const candidateDomains = [
  'haitaiice.co.kr',
  'www.haitaiice.co.kr',
  'haitaiicecream.com',
  'www.haitaiicecream.com',
  'haitai.co.kr',
  'www.haitai.co.kr'
];

async function check(domain) {
  return new Promise((resolve) => {
    https.get(`https://${domain}`, { timeout: 3000 }, (res) => {
      resolve({ domain, status: res.statusCode });
    }).on('error', (e) => resolve({ domain, error: e.message }));
  });
}

async function run() {
  for (const d of candidateDomains) {
    const res = await check(d);
    console.log(res);
  }
}

run();
