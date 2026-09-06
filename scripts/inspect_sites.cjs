const https = require('https');
const http = require('http');

const SITES = {
  'KFC': 'https://www.kfckorea.com',
  '롯데리아': 'https://www.lotteeats.com',
  '컴포즈': 'https://composecoffee.com',
  '투썸': 'https://www.twosome.co.kr',
  '농심': 'https://www.nongshim.com',
  '오뚜기': 'https://www.ottogi.co.kr',
  '삼양식품': 'https://www.samyangfoods.com',
  'CJ제일제당': 'https://www.cj.co.kr',
  '빙그레': 'https://www.bing.co.kr',
  '매일유업': 'https://www.maeil.com',
  '롯데웰푸드': 'https://www.lottewellfood.com'
};

function fetchHtml(url) {
  return new Promise(resolve => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 6000
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
        fetchHtml(next).then(resolve);
        return;
      }
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => resolve({ url, html }));
    });
    req.on('error', (e) => resolve({ url, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, error: 'timeout' }); });
  });
}

async function main() {
  for (const [name, url] of Object.entries(SITES)) {
    const res = await fetchHtml(url);
    if (res.html) {
      // Find all img tags or svg or logo paths
      const imgMatches = res.html.match(/<img[^>]+>/gi) || [];
      const logoImgs = imgMatches.filter(m => /logo|ci|bi|brand/i.test(m));
      console.log(`\n=== ${name} (${url}) ===`);
      console.log('Logo imgs:', logoImgs.slice(0, 3));
      
      const srcMatches = res.html.match(/(?:src|href)=["']([^"']*(?:logo|ci|bi)[^"']*\.(?:png|jpg|svg|webp))["']/gi) || [];
      console.log('Src matches:', srcMatches.slice(0, 4));
    } else {
      console.log(`\n=== ${name}: FAILED (${res.error}) ===`);
    }
  }
}

main();
