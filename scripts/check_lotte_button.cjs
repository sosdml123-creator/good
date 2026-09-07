const fs = require('fs');
const html = fs.readFileSync('scripts/lotte_lc700.html', 'utf-8');

const idx = html.indexOf('button-more');
if (idx !== -1) {
  console.log(html.substring(idx - 100, idx + 400));
}

// Find event listener on button-more
const btnIdx = html.indexOf('.button-more');
if (btnIdx !== -1) {
  console.log('Script around .button-more:');
  console.log(html.substring(btnIdx - 100, btnIdx + 500));
}
