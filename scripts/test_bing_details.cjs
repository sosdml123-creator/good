const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

function getBingDetail(valIdx) {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      prod_val_idx: valIdx,
      prod_idx: '0',
      lang: 'KO'
    });

    const req = https.request('https://www.bing.co.kr/product/get_idt_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const families = JSON.parse(fs.readFileSync('scripts/bing_families.json', 'utf-8'));
  console.log('Testing Bing details on first 3:');
  for (const fam of families.slice(0, 3)) {
    const detail = await getBingDetail(fam.valIdx);
    console.log(`=== ${fam.name} (valIdx: ${fam.valIdx}) ===`);
    if (detail && detail.info) {
      console.log('info keys:', Object.keys(detail.info));
      console.log('RAW_MATERIAL:', detail.info.RAW_MATERIAL ? detail.info.RAW_MATERIAL.substring(0, 100) : 'none');
      console.log('ALLERGY:', detail.info.ALLERGY);
      console.log('KEEP_EXP:', detail.info.KEEP_EXP);
      console.log('BUY_LINK:', detail.info.BUY_LINK_URL);
      console.log('Nutrition count:', detail.list ? detail.list.length : 0);
      if (detail.list && detail.list.length > 0) {
        console.log('Nutrition sample:', detail.list.slice(0, 4));
      }
    } else {
      console.log('No detail.info found');
    }
  }
}

run();
