const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'brands');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeSiteLogos(siteUrl) {
  return new Promise((resolve) => {
    try {
      const client = siteUrl.startsWith('https') ? https : http;
      client.get(siteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        timeout: 8000
      }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, siteUrl).href;
          return resolve(scrapeSiteLogos(next));
        }
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
          const found = [];
          const regex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
          let match;
          while ((match = regex.exec(html)) !== null) {
            const src = match[1];
            if (/logo|brand|bi|ci|header/i.test(src) || /logo|brand|bi|ci/i.test(match[0])) {
              const fullUrl = src.startsWith('http') ? src : new URL(src, siteUrl).href;
              found.push(fullUrl);
            }
          }
          resolve(found);
        });
      }).on('error', () => resolve([]));
    } catch (e) {
      resolve([]);
    }
  });
}

function fetchBuffer(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'SinsangpickBrandHub/2.0 (contact@sinsangpick.app; Educational Project)',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Referer': new URL(url).origin
        },
        timeout: 10000
      }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).href;
          return resolve(fetchBuffer(next));
        }

        if (res.statusCode !== 200) {
          return resolve({ ok: false, status: res.statusCode });
        }

        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          const head = buf.slice(0, 100).toString().toLowerCase();
          const isHtml = head.includes('<html') || head.includes('<!doctype') || head.includes('<head');
          if (isHtml || buf.length < 100) {
            return resolve({ ok: false, status: 200, isHtml: true, size: buf.length });
          }
          resolve({ ok: true, status: 200, buf, size: buf.length, contentType: res.headers['content-type'] });
        });
      });
      req.on('error', e => resolve({ ok: false, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, reason: 'timeout' }); });
    } catch (e) {
      resolve({ ok: false, error: e.message });
    }
  });
}

const VERIFIED_BRAND_SOURCES = {
  // 1. Core brands specifically requested by user
  '비비고': [
    'https://m.cj.co.kr/resources/img/brand/bibigo2_ourstory_img_3_1_kr.png',
  ],
  '오리온': [
    'https://upload.wikimedia.org/wikipedia/commons/f/f2/Orion_Corporation_logo_2.svg',
    'https://upload.wikimedia.org/wikipedia/commons/f/f3/Orion_Corporation_logo_%28english%29.svg',
  ],
  '매머드커피': [
    'https://upload.wikimedia.org/wikipedia/commons/b/bd/Mammoth_Coffee_logo.svg',
    'https://mmthcoffee.com/files/attach/images/138/039/019/336b95420377eeb0d40fa88942b005fe.png'
  ],
  '맘스터치': [
    'https://upload.wikimedia.org/wikipedia/commons/0/05/Mom%27s_Touch_logo_%282020%29.svg',
  ],
  '파리바게뜨': [
    'https://upload.wikimedia.org/wikipedia/commons/b/b7/Paris_Baguette_logo.svg',
  ],

  // 2. Coffee & Bakery brands
  '메가MGC커피': [
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Mega_MGC_Coffee_logo.png',
  ],
  '이디야커피': [
    'https://upload.wikimedia.org/wikipedia/commons/9/92/Ediya_Coffee_logo.svg',
  ],
  '뚜레쥬르': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/TOUSlesJOURSnewlogo.jpg/800px-TOUSlesJOURSnewlogo.jpg',
    'https://www.tlj.co.kr/static/images/common/logo.png',
    'https://www.tlj.co.kr/images/common/logo.png'
  ],
  '폴바셋': [
    'https://www.baristapaulbassett.co.kr/images/common/logo.png',
    'https://www.baristapaulbassett.co.kr/resources/images/common/logo.png'
  ],
  '더벤티': [
    'https://www.theventi.co.kr/design/img/header/logo.png',
    'https://www.theventi.co.kr/images/common/logo.png'
  ],
  '성심당': [
    'https://sungsimdang.co.kr/data/skin/front/sungsimdang_pc/img/banner/header_logo.png',
    'https://www.sungsimdang.co.kr/images/common/logo.png'
  ],
  '노티드': [
    'https://knotted-donut.com/img/common/logo.png',
    'https://knotted-donut.com/img/common/logo.svg'
  ],

  // 3. Retail & Food brands
  'GS25': [
    'https://upload.wikimedia.org/wikipedia/commons/3/3a/GS25_Logo.png',
  ],
  '이마트24': [
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/Emart_24_logo.svg',
  ],
  '해태제과': [
    'https://upload.wikimedia.org/wikipedia/commons/9/9f/Haitai_logo.svg',
  ],
  '하이트진로': [
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Hitejinro_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/9/9b/Jinro.co.jp.logo.png'
  ],
  '연세유업': [
    'https://www.yonseidairy.com/front/images/common/logo.png',
    'https://www.yonseidairy.com/images/common/logo.png'
  ],
  '청도농협': [
    'https://upload.wikimedia.org/wikipedia/commons/a/ab/Nonghyup_logo.svg',
  ],

  // 4. Stable verified vector logos
  '맥도날드': ['https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg'],
  '버거킹': ['https://upload.wikimedia.org/wikipedia/commons/8/85/Burger_King_logo_%281999%29.svg'],
  '롯데리아': ['https://upload.wikimedia.org/wikipedia/commons/9/9b/Lotteria_Logo.svg'],
  'KFC': ['https://upload.wikimedia.org/wikipedia/commons/b/bf/KFC_logo.svg'],
  '스타벅스': ['https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg'],
  '컴포즈커피': ['https://composecoffee.com/files/attach/images/138/9ef795638c4d29f0412ee26a6a241e3d.png'],
  '농심': ['https://upload.wikimedia.org/wikipedia/commons/e/e4/Nongshim_Logo.svg'],
  '삼양식품': ['https://upload.wikimedia.org/wikipedia/commons/5/52/Samyang_Foods_logo.svg'],
  '빙그레': ['https://upload.wikimedia.org/wikipedia/commons/b/b3/Binggrae_logo.svg'],
  '코카콜라': ['https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg'],
  '롯데웰푸드': ['https://upload.wikimedia.org/wikipedia/commons/8/87/Lotte_Logo.svg'],
  '세븐일레븐': ['https://upload.wikimedia.org/wikipedia/commons/4/40/7-eleven_logo.svg'],
  'CJ제일제당': ['https://upload.wikimedia.org/wikipedia/commons/4/4e/CJ_logo.svg']
};

async function main() {
  console.log('--- Starting Brand Logo Download & Verification ---');
  const results = {};

  for (const [brand, urls] of Object.entries(VERIFIED_BRAND_SOURCES)) {
    let saved = false;
    for (const url of urls) {
      await sleep(350);
      const res = await fetchBuffer(url);
      if (res.ok) {
        let ext = '.png';
        if (url.toLowerCase().includes('.svg') || (res.contentType && res.contentType.includes('svg')) || res.buf.slice(0, 50).toString().includes('<svg')) {
          ext = '.svg';
        } else if (url.toLowerCase().includes('.jpg') || url.toLowerCase().includes('.jpeg') || (res.contentType && res.contentType.includes('jpeg'))) {
          ext = '.jpg';
        }

        const filename = `${brand}${ext}`;
        const dest = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(dest, res.buf);

        results[brand] = `/brands/${filename}`;
        console.log(`[SUCCESS] ${brand.padEnd(10)} -> /brands/${filename} (${res.size} bytes)`);
        saved = true;
        break;
      }
    }
    if (!saved) {
      console.log(`[FAILED]  ${brand}`);
    }
  }

  console.log('\n--- Finished. Saved count:', Object.keys(results).length, '---');

  console.log('\n--- Checking dynamic sites for remaining brands ---');
  const sitesToProbe = {
    '매머드커피': 'https://www.mmthcoffee.com',
    '더벤티': 'https://www.theventi.co.kr',
    '성심당': 'https://sungsimdang.co.kr',
    '노티드': 'https://knotted-donut.com',
    '하이트진로': 'https://www.hitejinro.com',
    '연세유업': 'https://www.yonseidairy.com',
    '태극당': 'https://taegeukdang.com'
  };

  for (const [name, site] of Object.entries(sitesToProbe)) {
    const logos = await scrapeSiteLogos(site);
    console.log(`[PROBE] ${name.padEnd(10)}:`, logos);
  }
}

main();


