const fs = require('fs');
const html = fs.readFileSync('scripts/br_ice.html', 'utf-8');

const regex = /<a href="view\.php\?seq=(\d+)" class="menu-list__link">[\s\S]*?<img [^>]*src="([^"]+)" [^>]*alt="([^"]+)"[\s\S]*?<span class="menu-list__hash"[^>]*>([\s\S]*?)<\/span>/gi;
let match;
const brProducts = [];
while ((match = regex.exec(html)) !== null) {
  brProducts.push({
    seq: match[1],
    img: match[2].trim().startsWith('http') ? match[2].trim() : 'https://www.baskinrobbins.co.kr' + match[2].trim(),
    name: match[3].trim(),
    hashtag: match[4].replace(/\s+/g, ' ').trim()
  });
}

console.log(`Parsed ${brProducts.length} BR products:`);
console.log(brProducts.map(p => `${p.name} (${p.seq})`));
fs.writeFileSync('scripts/br_products.json', JSON.stringify(brProducts, null, 2), 'utf-8');
