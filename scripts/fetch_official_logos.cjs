const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'brands');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Map of official brand logo URLs from verified official sites / CDN / brand repositories
const OFFICIAL_LOGO_CANDIDATES = {
  '맥도날드': [
    'https://www.mcdonalds.co.kr/common/images/header/logo.png',
    'https://www.mcdonalds.co.kr/kor/images/common/logo.png',
    'https://cdn.worldvectorlogo.com/logos/mcdonalds-15.svg',
    'https://images.seeklogo.com/logo-png/2/1/mcdonalds-logo-png_seeklogo-23588.png'
  ],
  '버거킹': [
    'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/burger-king-logo-design-template-332e65243b827e85c275a5963ecfec4f_screen.jpg',
    'https://cdn.worldvectorlogo.com/logos/burger-king-4.svg',
    'https://images.seeklogo.com/logo-png/2/1/burger-king-logo-png_seeklogo-23594.png'
  ],
  '맘스터치': [
    'https://www.momstouch.co.kr/images/common/logo.png',
    'https://momstouch.co.kr/images/common/h1_logo.png'
  ],
  '롯데리아': [
    'https://www.lotteeats.com/static/images/common/logo_lotteria.png',
    'https://www.lotteria.com/images/common/h1_logo.png'
  ],
  'KFC': [
    'https://www.kfckorea.com/nas/common/img/logo.png',
    'https://images.seeklogo.com/logo-png/8/1/kfc-new-logo-png_seeklogo-82604.png'
  ],
  '스타벅스': [
    'https://www.starbucks.co.kr/common/img/common/logo.png'
  ],
  '메가MGC커피': [
    'https://img.79plus.co.kr/megahp/manager/upload/menu/20260902203101_1788348661533_weMnhAbV2Q.jpg',
    'https://www.mega-mgccoffee.com/images/common/logo.png'
  ],
  '빽다방': [
    'https://paikdabang.com/wp-content/themes/paikdabang/assets/images/logo.png'
  ],
  '매머드커피': [
    'https://mmthcoffee.com/files/menu/564a4c4ac238359924a304a25e902e29.png'
  ],
  '컴포즈커피': [
    'https://composecoffee.com/files/attach/images/138/9ef795638c4d29f0412ee26a6a241e3d.png',
    'https://composecoffee.com/layouts/compose/img/logo.png'
  ],
  '이디야커피': [
    'https://www.ediya.com/images/common/logo.png',
    'https://www.ediya.com/images/common/top_logo.png'
  ],
  '투썸플레이스': [
    'https://www.twosome.co.kr/resources/images/common/logo_header.png',
    'https://www.twosome.co.kr/resources/images/common/logo.png'
  ],
  '오리온': [
    'https://www.orionworld.com/upload/goods/00086d1e89648f5fcf72cdb3a40847cb.png',
    'https://www.orionworld.com/images/common/logo.png'
  ],
  '농심': [
    'https://www.nongshim.com/static/images/common/logo.png'
  ],
  '삼양식품': [
    'https://www.samyangfoods.com/images/front/common/logo.png'
  ],
  '오뚜기': [
    'https://www.ottogi.co.kr/images/common/h1_logo.png'
  ],
  'CJ제일제당': [
    'https://www.cj.co.kr/static/images/common/logo.png',
    'https://www.cj.co.kr/images/common/logo_cj.png'
  ],
  '빙그레': [
    'https://www.bing.co.kr/static/images/common/h1_logo.png',
    'https://www.bing.co.kr/images/common/logo.png'
  ],
  '하이트진로': [
    'https://www.hitejinro.com/assets/images/common/logo.png'
  ],
  '매일유업': [
    'https://www.maeil.com/images/common/logo.png'
  ],
  '연세유업': [
    'https://www.yonseidairy.com/images/common/logo.png'
  ],
  '롯데웰푸드': [
    'https://www.lottenfood.com/static/images/common/logo_lotte.png'
  ],
  '해태제과': [
    'https://www.ht.co.kr/images/common/logo.png'
  ],
  'GS25': [
    'https://gs25.gsretail.com/gscvs/ko/images/common/logo.png'
  ],
  'CU': [
    'https://cu.bgfretail.com/images/common/logo.png'
  ],
  '세븐일레븐': [
    'https://www.7-eleven.co.kr/images/common/h1_logo.png'
  ],
  '이마트24': [
    'https://www.emart24.co.kr/assets/images/common/logo.png'
  ],
  '청도농협': [
    'https://www.nonghyup.com/images/common/logo.png'
  ]
};

async function testDownload(url, dest) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': new URL(url).origin
        },
        timeout: 5000
      }, res => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const stream = fs.createWriteStream(dest);
          res.pipe(stream);
          stream.on('finish', () => {
            const stat = fs.statSync(dest);
            if (stat.size > 200) {
              resolve({ ok: true, size: stat.size, contentType: res.headers['content-type'] });
            } else {
              fs.unlinkSync(dest);
              resolve({ ok: false, reason: 'too small' });
            }
          });
          stream.on('error', () => resolve({ ok: false, reason: 'stream error' }));
        } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const nextUrl = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
          testDownload(nextUrl, dest).then(resolve);
        } else {
          resolve({ ok: false, statusCode: res.statusCode });
        }
      });
      req.on('error', (e) => resolve({ ok: false, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, reason: 'timeout' }); });
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

async function main() {
  console.log('Testing official brand logo candidates...');
  for (const [brand, urls] of Object.entries(OFFICIAL_LOGO_CANDIDATES)) {
    let success = false;
    for (const url of urls) {
      const ext = url.includes('.svg') ? '.svg' : url.includes('.jpg') ? '.jpg' : '.png';
      const filename = `${brand}${ext}`;
      const dest = path.join(OUTPUT_DIR, filename);
      const res = await testDownload(url, dest);
      if (res.ok) {
        console.log(`[SUCCESS] ${brand}: ${url} -> ${filename} (${res.size} bytes)`);
        success = true;
        break;
      } else {
        // console.log(`[FAILED] ${brand}: ${url} (${res.statusCode || res.reason || res.error})`);
      }
    }
    if (!success) {
      console.log(`[NOT_FOUND] ${brand}`);
    }
  }
}

main();
