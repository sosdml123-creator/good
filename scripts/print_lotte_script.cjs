const fs = require('fs');
const html = fs.readFileSync('scripts/lotte_lc700.html', 'utf-8');

const idx = html.indexOf("'use strict';");
if (idx !== -1) {
  console.log(html.substring(idx, idx + 1500));
}
