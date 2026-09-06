const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'brands');

const NAVER_BRAND_STORES = {
  '농심': 'https://brand.naver.com/nongshim',
  '오뚜기': 'https://brand.naver.com/ottogi',
  'CJ제일제당': 'https://brand.naver.com/cjcheiljedang',
  '삼양식품': 'https://brand.naver.com/samyangfoods',
  '빙그레': 'https://brand.naver.com/binggrae',
  '매일유업': 'https://brand.naver.com/maeil',
  '롯데웰푸드': 'https://brand.naver.com/lottewellfood',
  '코카콜라': 'https://brand.naver.com/coca-cola',
};

async function getPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 8000
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : require('http');
    client.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 8000
    }, res => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const size = fs.statSync(dest).size;
          resolve(size > 200);
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function main() {
  for (const [brand, storeUrl] of Object.entries(NAVER_BRAND_STORES)) {
    const html = await getPage(storeUrl);
    // Find og:image or logo image
    const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1]) {
      const logoUrl = ogMatch[1];
      const ext = logoUrl.includes('.png') ? '.png' : '.jpg';
      const dest = path.join(OUTPUT_DIR, `${brand}${ext}`);
      const ok = await downloadImage(logoUrl, dest);
      console.log(`[NAVER STORE] ${brand}: ${ok ? 'SUCCESS' : 'FAIL'} -> ${dest} (from ${logoUrl})`);
    } else {
      console.log(`[NAVER STORE] ${brand}: og:image not found`);
    }
  }
}

main();
