const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'brands');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to get image URL from Wikipedia / Wikimedia API
async function getWikiImageUrl(apiHost, fileTitle) {
  return new Promise((resolve) => {
    const url = `https://${apiHost}/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
    https.get(url, {
      headers: { 'User-Agent': 'SinsangpickBrandHub/1.0 (dev@sinsangpick.com)' }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          const pages = json.query.pages;
          for (const k in pages) {
            if (pages[k].imageinfo && pages[k].imageinfo[0]) {
              resolve(pages[k].imageinfo[0].url);
              return;
            }
          }
        } catch(e) {}
        resolve(null);
      });
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': new URL(url).origin
        },
        timeout: 10000
      }, res => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            const size = fs.statSync(dest).size;
            resolve(size > 200);
          });
        } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
          downloadImage(next, dest).then(resolve);
        } else {
          resolve(false);
        }
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
    } catch(e) {
      resolve(false);
    }
  });
}

async function main() {
  console.log('Resolving remaining official brand logo URLs...');

  const targets = [
    { brand: '오뚜기', api: 'ko.wikipedia.org', title: '파일:오뚜기 로고.png' },
    { brand: '롯데리아', api: 'commons.wikimedia.org', title: 'File:Lotteria logo (2024).svg' },
    { brand: '삼양식품', api: 'commons.wikimedia.org', title: 'File:Samyang Foods Logo.svg' },
    { brand: '롯데웰푸드', api: 'commons.wikimedia.org', title: 'File:Lotte Logo (2017).svg' },
    { brand: 'KFC', api: 'commons.wikimedia.org', title: 'File:Kentucky Fried Chicken 201x logo.svg' },
    { brand: '투썸플레이스', api: 'commons.wikimedia.org', title: 'File:A Twosome Place square logo.png' },
    { brand: '농심', api: 'commons.wikimedia.org', title: 'File:Nongshim Logo.svg' },
    { brand: 'CJ제일제당', api: 'commons.wikimedia.org', title: 'File:CJ logo.svg' },
    { brand: '빙그레', api: 'commons.wikimedia.org', title: 'File:Binggrae logo.svg' },
  ];

  for (const t of targets) {
    const rawUrl = await getWikiImageUrl(t.api, t.title);
    if (rawUrl) {
      // Clean query params
      const cleanUrl = rawUrl.split('?')[0];
      const ext = cleanUrl.endsWith('.svg') ? '.svg' : '.png';
      const dest = path.join(OUTPUT_DIR, `${t.brand}${ext}`);
      const ok = await downloadImage(cleanUrl, dest);
      console.log(`[WIKI] ${t.brand}: ${ok ? 'SUCCESS' : 'FAILED'} -> ${dest} (from ${cleanUrl})`);
    } else {
      console.log(`[WIKI] ${t.brand}: URL not found for ${t.title}`);
    }
  }

  // Direct official URLs
  const direct = [
    { brand: '컴포즈커피', url: 'https://composecoffee.com/layouts/opening/img/logo.svg', ext: '.svg' },
    { brand: '매일유업', url: 'https://www.maeil.com/resources/images/common/h_logo.png', ext: '.png' }
  ];

  for (const d of direct) {
    const dest = path.join(OUTPUT_DIR, `${d.brand}${d.ext}`);
    const ok = await downloadImage(d.url, dest);
    console.log(`[DIRECT] ${d.brand}: ${ok ? 'SUCCESS' : 'FAILED'} -> ${dest}`);
  }

  // List all files in public/brands
  console.log('\n=== ALL DOWNLOADED OFFICIAL BRAND LOGOS IN public/brands ===');
  const files = fs.readdirSync(OUTPUT_DIR);
  console.log(files);
}

main();
