const fs = require('fs');
const html = fs.readFileSync('scripts/lotte_product.html', 'utf-8');

const idx = html.indexOf('brand_item04');
if (idx !== -1) {
  console.log(html.substring(idx - 300, idx + 600));
} else {
  console.log('Not found');
}
