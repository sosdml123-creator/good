const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

const postData = querystring.stringify({
  pdt_code: '1',
  page_cnt: 100,
  search_name: '',
  tag_type: '1',
  lang: 'KO'
});

const req = https.request('https://www.bing.co.kr/product/getProductList', {
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
    const data = JSON.parse(body);
    console.log(`Total Binggrae Ice Cream families: ${data.list.length}`);
    const families = data.list.map(item => ({
      idx: item.FAMILY_IDX,
      name: item.FAMILY_NAME,
      valIdx: item.PROD_VAL_IDX,
      img: item.PROD_IMG_FILE,
      brandImg: item.BRAND_IMG_FILE
    }));
    console.log('Binggrae ice cream families:', families);
    fs.writeFileSync('scripts/bing_families.json', JSON.stringify(families, null, 2), 'utf-8');
  });
});

req.write(postData);
req.end();
