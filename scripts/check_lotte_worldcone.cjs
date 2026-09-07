const fs = require('fs');
const html = fs.readFileSync('scripts/lotte_lc700.html', 'utf-8');

const idx = html.indexOf('월드콘');
if (idx !== -1) {
  console.log(html.substring(idx - 200, idx + 600));
} else {
  console.log('Not found');
}
