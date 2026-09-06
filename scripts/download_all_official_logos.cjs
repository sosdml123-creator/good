const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'brands');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Map of official brand logo candidates (official sites + official vector SVGs)
const BRAND_SOURCES = {
  '맥도날드': [
    'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
    'https://upload.wikimedia.org/wikipedia/commons/0/05/McDonald%27s_square_2020.svg'
  ],
  '버거킹': [
    'https://upload.wikimedia.org/wikipedia/commons/8/85/Burger_King_logo_%281999%29.svg',
    'https://cdn.worldvectorlogo.com/logos/burger-king-4.svg'
  ],
  '맘스터치': [
    'https://www.momstouch.co.kr/images/common/logo.png',
    'https://upload.wikimedia.org/wikipedia/commons/d/d7/Mom%27s_Touch_logo.png'
  ],
  '롯데리아': [
    'https://upload.wikimedia.org/wikipedia/commons/9/9b/Lotteria_Logo.svg',
    'https://www.lotteeats.com/static/images/common/logo_lotteria.png'
  ],
  'KFC': [
    'https://upload.wikimedia.org/wikipedia/commons/b/bf/KFC_logo.svg',
    'https://upload.wikimedia.org/wikipedia/en/b/bf/KFC_logo.svg',
    'https://www.kfckorea.com/nas/common/img/logo.png'
  ],
  '스타벅스': [
    'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg',
    'https://www.starbucks.co.kr/common/img/common/logo.png'
  ],
  '메가MGC커피': [
    'https://img.79plus.co.kr/megahp/manager/upload/menu/20260902203101_1788348661533_weMnhAbV2Q.jpg'
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
    'https://www.ediya.com/images/common/top_logo.png'
  ],
  '투썸플레이스': [
    'https://upload.wikimedia.org/wikipedia/commons/1/15/A_Twosome_Place_logo.svg',
    'https://www.twosome.co.kr/resources/images/common/logo_header.png'
  ],
  '오리온': [
    'https://www.orionworld.com/upload/goods/00086d1e89648f5fcf72cdb3a40847cb.png'
  ],
  '농심': [
    'https://upload.wikimedia.org/wikipedia/commons/e/e4/Nongshim_Logo.svg'
  ],
  '삼양식품': [
    'https://upload.wikimedia.org/wikipedia/commons/5/52/Samyang_Foods_logo.svg'
  ],
  '오뚜기': [
    'https://upload.wikimedia.org/wikipedia/commons/1/14/Ottogi_Logo.svg'
  ],
  'CJ제일제당': [
    'https://upload.wikimedia.org/wikipedia/commons/4/4e/CJ_logo.svg'
  ],
  '빙그레': [
    'https://upload.wikimedia.org/wikipedia/commons/b/b3/Binggrae_logo.svg'
  ],
  '코카콜라': [
    'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg'
  ],
  '하이트진로': [
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Hitejinro_logo.svg',
    'https://www.hitejinro.com/assets/images/common/logo.png'
  ],
  '매일유업': [
    'https://upload.wikimedia.org/wikipedia/commons/f/f6/Maeil_Dairies_logo.svg'
  ],
  '연세유업': [
    'https://www.yonseidairy.com/images/common/logo.png'
  ],
  '롯데웰푸드': [
    'https://upload.wikimedia.org/wikipedia/commons/8/87/Lotte_Logo.svg'
  ],
  '해태제과': [
    'https://upload.wikimedia.org/wikipedia/commons/2/23/Haitai_Confectionery_%26_Foods_Logo.svg',
    'https://www.ht.co.kr/images/common/logo.png'
  ],
  'GS25': [
    'https://gs25.gsretail.com/gscvs/ko/images/common/logo.png'
  ],
  'CU': [
    'https://cu.bgfretail.com/images/common/logo.png'
  ],
  '세븐일레븐': [
    'https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg',
    'https://www.7-eleven.co.kr/images/common/h1_logo.png'
  ],
  '이마트24': [
    'https://www.emart24.co.kr/assets/images/common/logo.png'
  ],
  '청도농협': [
    'https://upload.wikimedia.org/wikipedia/commons/a/ab/Nonghyup_logo.svg',
    'https://www.nonghyup.com/images/common/logo.png'
  ]
};

function downloadUrl(url, dest) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': new URL(url).origin
        },
        timeout: 8000
      }, res => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            const size = fs.statSync(dest).size;
            if (size > 100) {
              resolve({ ok: true, size });
            } else {
              fs.unlinkSync(dest);
              resolve({ ok: false, reason: 'empty file' });
            }
          });
          file.on('error', () => resolve({ ok: false, reason: 'write error' }));
        } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
          downloadUrl(next, dest).then(resolve);
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

async function run() {
  console.log('Downloading official brand logos into public/brands/...');
  const results = {};

  for (const [brand, urls] of Object.entries(BRAND_SOURCES)) {
    let downloaded = false;
    for (const url of urls) {
      const ext = url.toLowerCase().includes('.svg') ? '.svg' : url.toLowerCase().includes('.jpg') ? '.jpg' : '.png';
      const filename = `${brand}${ext}`;
      const dest = path.join(OUTPUT_DIR, filename);

      const res = await downloadUrl(url, dest);
      if (res.ok) {
        results[brand] = `/brands/${filename}`;
        console.log(`[SUCCESS] ${brand} -> /brands/${filename} (${res.size} bytes)`);
        downloaded = true;
        break;
      }
    }
    if (!downloaded) {
      console.log(`[FAILED] ${brand}`);
    }
  }

  console.log('\nDownloaded Summary:', JSON.stringify(results, null, 2));
}

run();
