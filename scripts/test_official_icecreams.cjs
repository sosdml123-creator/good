const https = require('https');
const http = require('http');

function fetch(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
        },
        timeout: 10000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
          return fetch(next).then(resolve);
        }
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', err => resolve({ error: err.message }));
      req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
    } catch (e) {
      resolve({ error: e.message });
    }
  });
}

async function test() {
  console.log('Testing official sites:');
  
  // 1. Binggrae
  const bing = await fetch('https://www.bing.co.kr');
  console.log('Binggrae status:', bing.status, 'error:', bing.error);
  if (bing.body) {
    const iceMatches = bing.body.match(/href="([^"]*(?:ice|brand|product)[^"]*)"/gi);
    console.log('Bing links:', iceMatches ? iceMatches.slice(0, 10) : 'none');
  }

  // 2. Lotte Wellfood
  const lotte = await fetch('https://www.lottewellfood.com');
  console.log('Lotte Wellfood status:', lotte.status, 'error:', lotte.error);
  if (lotte.body) {
    const lotteMatches = lotte.body.match(/href="([^"]*(?:ice|brand|product)[^"]*)"/gi);
    console.log('Lotte links:', lotteMatches ? lotteMatches.slice(0, 10) : 'none');
  }

  // 3. Haitai Ice
  const haitai = await fetch('https://www.haitaiice.com');
  console.log('Haitai status:', haitai.status, 'error:', haitai.error);

  // 4. Baskin Robbins
  const br = await fetch('https://www.baskinrobbins.co.kr/menu/list.php?top=A');
  console.log('BR status:', br.status, 'error:', br.error);
  if (br.body) {
    console.log('BR body length:', br.body.length);
  }
}

test();
