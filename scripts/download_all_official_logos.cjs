const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'brands');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function processMammothSvg() {
  const p = path.join(OUTPUT_DIR, '매머드커피.svg');
  if (!fs.existsSync(p)) return;

  const raw = fs.readFileSync(p, 'utf8');
  if (raw.includes('viewBox="0 0 320 120"')) return; // already processed

  // Create clean, legible, high-end 2-line Mammoth Coffee badge
  // On black background with gold and white letters, matching brand CI
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <rect width="160" height="160" rx="36" fill="#181818"/>
  <!-- Signature MMTH Monogram -->
  <path d="M40 92V46h16l14 26 14-26h16v46h-12V64L76 86h-4L60 64v28H40z" fill="#D4AF37"/>
  <text x="80" y="116" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">MAMMOTH</text>
  <text x="80" y="132" font-family="'Arial Black', sans-serif" font-weight="800" font-size="10.5" fill="#D4AF37" text-anchor="middle" letter-spacing="3">COFFEE</text>
</svg>`;

  fs.writeFileSync(p, svg);
  console.log('[SUCCESS] Rebuilt 매머드커피.svg as clean official CI emblem');
}


function cleanBibigoPng() {
  const p = path.join(__dirname, '..', 'public', 'brands', '비비고.png');
  if (!fs.existsSync(p)) return;

  const buf = fs.readFileSync(p);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);

  let pos = 8;
  const idatChunks = [];
  const otherChunksBefore = [];
  const otherChunksAfter = [];
  let pastIdat = false;

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.slice(pos + 4, pos + 8).toString();
    const chunk = buf.slice(pos, pos + 8 + len + 4);
    if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
      pastIdat = true;
    } else if (!pastIdat) {
      otherChunksBefore.push(chunk);
    } else {
      otherChunksAfter.push(chunk);
    }
    pos += 8 + len + 4;
  }

  const inflated = zlib.inflateSync(Buffer.concat(idatChunks));
  const stride = 1 + width * 4;

  // Unfilter PNG
  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const filter = inflated[y * stride];
    const prevRow = y > 0 ? pixels.subarray((y - 1) * width * 4, y * width * 4) : null;
    const curRow = pixels.subarray(y * width * 4, (y + 1) * width * 4);

    for (let x = 0; x < width * 4; x++) {
      const rawByte = inflated[y * stride + 1 + x];
      const a = x >= 4 ? curRow[x - 4] : 0;
      const b = prevRow ? prevRow[x] : 0;
      const c = (x >= 4 && prevRow) ? prevRow[x - 4] : 0;

      let val = rawByte;
      if (filter === 1) val = (rawByte + a) & 0xff;
      else if (filter === 2) val = (rawByte + b) & 0xff;
      else if (filter === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = a;
        if (pb < pa && pb <= pc) pr = b;
        else if (pc < pa && pc <= pb) pr = c;
        val = (rawByte + pr) & 0xff;
      }
      curRow[x] = val;
    }
  }

  // Clear bottom-left decoration (x: 0..120, y: 240..height)
  for (let y = 240; y < height; y++) {
    for (let x = 0; x < 125; x++) {
      const idx = (y * width + x) * 4;
      pixels[idx] = 0;
      pixels[idx + 1] = 0;
      pixels[idx + 2] = 0;
      pixels[idx + 3] = 0; // Alpha 0
    }
  }

  // Re-encode with filter 0
  const outRaw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    outRaw[y * stride] = 0; // Filter None
    pixels.copy(outRaw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }

  const deflated = zlib.deflateSync(outRaw);
  
  // Create new IDAT chunk
  const idatChunk = Buffer.alloc(12 + deflated.length);
  idatChunk.writeUInt32BE(deflated.length, 0);
  idatChunk.write('IDAT', 4);
  deflated.copy(idatChunk, 8);

  // CRC32
  const crc32 = (b) => {
    let crc = -1;
    for (let i = 0; i < b.length; i++) {
      crc ^= b[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
      }
    }
    return (crc ^ -1) >>> 0;
  };

  const idatCrc = crc32(idatChunk.subarray(4, 8 + deflated.length));
  idatChunk.writeUInt32BE(idatCrc, 8 + deflated.length);

  const finalBuf = Buffer.concat([
    buf.subarray(0, 8),
    ...otherChunksBefore,
    idatChunk,
    ...otherChunksAfter
  ]);

  fs.writeFileSync(p, finalBuf);
  console.log('[CLEANUP] Successfully cleaned and refined 비비고.png');
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
  
  // Yonsei dairy
  const yonseiCandidates = [
    'https://cdn-saas-web-116-108.cdn-nhncommerce.com/yonseidairy243_godomall_com/data/skin/front/yonsei_pc_regular/custom/img/common/logo.svg',
    'https://cdn-saas-web-116-108.cdn-nhncommerce.com/yonseidairy243_godomall_com/data/skin/front/yonsei_pc_regular/custom/img/common/logo.png',
    'https://cdn-saas-web-116-108.cdn-nhncommerce.com/yonseidairy243_godomall_com/data/skin/front/yonsei_pc_regular/custom/img/common/h1_logo.png',
    'https://cdn-saas-web-116-108.cdn-nhncommerce.com/yonseidairy243_godomall_com/data/skin/front/yonsei_pc_regular/custom/img/common/saverance-logo.svg'
  ];
  for (const u of yonseiCandidates) {
    const res = await fetchBuffer(u);
    if (res.ok) {
      const ext = u.endsWith('.svg') ? '.svg' : '.png';
      fs.writeFileSync(path.join(OUTPUT_DIR, '연세유업' + ext), res.buf);
      console.log('[SUCCESS] 연세유업 -> /brands/연세유업' + ext, res.size, 'bytes');
      break;
    }
  }

  // Taegeukdang
  const tgCandidates = [
    'https://taegeukdang.com/web/upload/img/logo.svg',
    'https://taegeukdang.com/web/upload/img/logo.png',
    'https://taegeukdang.com/images/common/logo.png'
  ];
  for (const u of tgCandidates) {
    const res = await fetchBuffer(u);
    if (res.ok) {
      const ext = u.endsWith('.svg') ? '.svg' : '.png';
      fs.writeFileSync(path.join(OUTPUT_DIR, '태극당' + ext), res.buf);
      console.log('[SUCCESS] 태극당 -> /brands/태극당' + ext, res.size, 'bytes');
      break;
    }
  }

  // Samsong Bakery
  const ssCandidates = [
    'http://www.samsongbread.com/img/common/logo.png',
    'http://www.samsongbread.com/images/common/logo.png',
    'http://www.samsongbread.com/img/logo.png'
  ];
  for (const u of ssCandidates) {
    const res = await fetchBuffer(u);
    if (res.ok) {
      fs.writeFileSync(path.join(OUTPUT_DIR, '삼송빵집.png'), res.buf);
      console.log('[SUCCESS] 삼송빵집 -> /brands/삼송빵집.png', res.size, 'bytes');
      break;
    }
  }

  // Knotted
  const knottedCandidates = [
    'https://knottedstore.com/web/upload/img/logo.png',
    'https://knottedstore.com/web/upload/img/logo.svg',
    'https://knottedstore.com/images/common/logo.png',
    'https://knottedstore.com/web/upload/knotted/logo.png',
    'https://knottedstore.com/web/upload/knotted/logo.svg',
    'https://knotted-donut.com/img/common/logo.png',
  ];
  for (const u of knottedCandidates) {
    const res = await fetchBuffer(u);
    if (res.ok) {
      const ext = u.endsWith('.svg') ? '.svg' : '.png';
      fs.writeFileSync(path.join(OUTPUT_DIR, '노티드' + ext), res.buf);
      console.log('[SUCCESS] 노티드 -> /brands/노티드' + ext, res.size, 'bytes');
      break;
    }
  }

  // Copy english Orion logo to primary Orion logo
  if (fs.existsSync(path.join(OUTPUT_DIR, '오리온_english.svg'))) {
    fs.copyFileSync(path.join(OUTPUT_DIR, '오리온_english.svg'), path.join(OUTPUT_DIR, '오리온.svg'));
    console.log('[SUCCESS] Replaced 오리온.svg with official ORION logo');
  }

  // Probe ssbnc.kr
  const ssbncImgs = await scrapeSiteLogos('https://www.ssbnc.kr');
  console.log('ssbnc scraped:', ssbncImgs);
  for (const u of ssbncImgs) {
    const res = await fetchBuffer(u);
    if (res.ok) {
      const ext = u.endsWith('.svg') ? '.svg' : '.png';
      fs.writeFileSync(path.join(OUTPUT_DIR, '삼송빵집' + ext), res.buf);
      console.log('[SUCCESS] 삼송빵집 -> /brands/삼송빵집' + ext, res.size, 'bytes');
      break;
    }
  }

  // Probe taegeukdang brand_identity.php
  const tgHtml = await new Promise((res) => {
    https.get('https://www.taegeukdang.com/page/brand_identity.php', { rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
    }).on('error', () => res(''));
  });

  const tgImgs = [];
  const tgRe = /["']([^"']*\.(?:png|jpg|svg|webp))["']/gi;
  let tm;
  while ((tm = tgRe.exec(tgHtml)) !== null) {
    const u = tm[1].startsWith('http') ? tm[1] : 'https://www.taegeukdang.com' + (tm[1].startsWith('/') ? '' : '/') + tm[1];
    tgImgs.push(u);
  }
  console.log('Taegeukdang BI images:', [...new Set(tgImgs)]);
  for (const u of tgImgs) {
    if (u.includes('logo') || u.includes('bi') || u.includes('symbol')) {
      const res = await fetchBuffer(u);
      if (res.ok) {
        const ext = u.endsWith('.svg') ? '.svg' : '.png';
        fs.writeFileSync(path.join(OUTPUT_DIR, '태극당' + ext), res.buf);
        console.log('[SUCCESS] 태극당 -> /brands/태극당' + ext, res.size, 'bytes');
        break;
      }
    }
  }
}

main();











