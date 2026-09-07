const https = require('https');
const fs = require('fs');

const file = fs.createWriteStream('public/brands/배스킨라빈스.png');
https.get('https://www.baskinrobbins.co.kr/assets/images/common/h_logo.png', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Saved 배스킨라빈스.png! Size:', fs.statSync('public/brands/배스킨라빈스.png').size);
  });
}).on('error', console.error);
