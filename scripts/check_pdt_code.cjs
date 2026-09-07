const fs = require('fs');
const html = fs.readFileSync('scripts/bing_ice.html', 'utf-8');

// Find all pdt_code or data-code or categories
const codes = html.match(/[\w_-]*(?:pdt|cat)[\w_-]*\s*[:=]\s*["']?[^"'\s>]+["']?/gi);
console.log('Codes found:', codes ? codes.slice(0, 30) : 'none');

// Also look around target_pdt_code
const tIdx = html.indexOf('target_pdt_code');
if (tIdx !== -1) {
  console.log(html.substring(tIdx - 300, tIdx + 200));
}
