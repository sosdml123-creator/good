const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8'
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function inspectBing() {
  for (let t = 1; t <= 10; t++) {
    const res = await fetch(`https://www.bing.co.kr/product/list?type=${t}`);
    if (res.body) {
      const titleMatch = res.body.match(/<h2[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/h2>/i) ||
                         res.body.match(/<title>([^<]+)<\/title>/i) ||
                         res.body.match(/class="[^"]*current[^"]*"[^>]*>([^<]+)</i);
      const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
      console.log(`Type ${t}: ${title}`);
      
      // check if ice cream keywords exist
      if (res.body.includes('아이스크림') || res.body.includes('메로나') || res.body.includes('투게더')) {
        console.log(`>>> Type ${t} contains ice cream keywords!`);
      }
    }
  }
}

inspectBing();
