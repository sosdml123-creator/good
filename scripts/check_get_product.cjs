const fs = require('fs');

const html = fs.readFileSync('scripts/bing_ice.html', 'utf-8');
const idx = html.indexOf('getProductList');
if (idx !== -1) {
  console.log(html.substring(idx - 200, idx + 800));
} else {
  console.log('Not found');
}
