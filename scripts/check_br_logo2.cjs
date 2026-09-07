const fs = require('fs');
const html = fs.readFileSync('scripts/br_ice.html', 'utf-8');
const logoIdx = html.indexOf('header__logo');
if (logoIdx !== -1) {
  console.log(html.substring(logoIdx - 50, logoIdx + 300));
}
