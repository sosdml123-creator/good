const fs = require('fs');
const html = fs.readFileSync('scripts/bing_ice.html', 'utf-8');

const clickIdx = html.indexOf('FAMILY_IDX');
if (clickIdx !== -1) {
  console.log(html.substring(clickIdx - 200, clickIdx + 400));
} else {
  console.log('Not found');
}
