const https = require('https');
https.get('https://www.baskinrobbins.co.kr/assets/css/app.css', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const idx = body.indexOf('site-header-logo__link');
    if (idx !== -1) {
      console.log(body.substring(idx, idx + 300));
    }
  });
});
