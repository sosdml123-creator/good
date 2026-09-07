const https = require('https');
const querystring = require('querystring');

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
    console.log('Status:', res.statusCode);
    try {
      const data = JSON.parse(body);
      console.log('Result keys:', Object.keys(data));
      console.log('listCount:', data.listCount);
      console.log('Items sample:', data.list ? data.list.slice(0, 5) : data);
    } catch (e) {
      console.log('Parse error, body preview:', body.substring(0, 500));
    }
  });
});

req.on('error', console.error);
req.write(postData);
req.end();
