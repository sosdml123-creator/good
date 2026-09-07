const fs = require('fs');
const list = JSON.parse(fs.readFileSync('scripts/lotte_products.json', 'utf-8'));
console.log(list.map(x => x.name));
