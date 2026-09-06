const https = require('https');

const CI_PAGES = {
  '농심': 'https://www.nongshim.com/company/ci',
  '오뚜기': 'https://www.ottogi.co.kr/company/ci/ci.asp',
  '삼양식품': 'https://www.samyangfoods.com/kor/company/ci.do',
  '투썸플레이스': 'https://www.twosome.co.kr/brand/story.do',
  '롯데리아': 'https://www.lotteeats.com/brand/ria',
  'KFC': 'https://www.kfckorea.com/company/brand'
};

async function get(url) {
  return new Promise(resolve => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
      timeout: 6000
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  for (const [name, url] of Object.entries(CI_PAGES)) {
    const html = await get(url);
    const matches = html.match(/(?:src|href)=["']([^"']*(?:ci|bi|logo|download)[^"']*\.(?:png|jpg|svg|ai|zip))["']/gi) || [];
    console.log(`\n=== ${name} ===`);
    console.log(matches.slice(0, 5));
  }
}
run();
