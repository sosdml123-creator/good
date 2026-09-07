const fs = require('fs');
const html = fs.readFileSync('scripts/br_ice.html', 'utf-8');
const css = html.match(/href="[^"]*\.css[^"]*"/gi);
console.log('CSS:', css);
