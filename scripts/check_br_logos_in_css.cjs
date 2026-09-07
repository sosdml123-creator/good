const https = require('https');
https.get('https://www.baskinrobbins.co.kr/assets/css/app.css', (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const logos = body.match(/url\([^)]*logo[^)]*\)/gi) || [];
    console.log('Logo urls in app.css:', [...new Set(logos)]);
  });
});
