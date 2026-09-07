const fs = require('fs');
const html = fs.readFileSync('scripts/br_ice.html', 'utf-8');
const header = html.match(/<header[\s\S]*?<\/header>/i);
if (header) {
  const imgs = header[0].match(/<img[^>]+>/gi) || [];
  console.log('Header imgs:', imgs);
  const svgs = header[0].match(/<svg[\s\S]*?<\/svg>/gi) || [];
  console.log('Header svgs:', svgs.length);
}
