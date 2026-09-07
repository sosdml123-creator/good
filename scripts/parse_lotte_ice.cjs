const fs = require('fs');

const html = fs.readFileSync('scripts/lotte_lc700.html', 'utf-8');

const regex = /<li[^>]*data-class="page"[^>]*>[\s\S]*?data-value='([^']+)'[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<div class="fnt-title-s3">\s*<span>([^<]+)<\/span>/gi;
let match;
const products = [];
while ((match = regex.exec(html)) !== null) {
  products.push({
    dataValue: match[1],
    img: match[2].trim(),
    name: match[3].trim()
  });
}

console.log(`Parsed ${products.length} products from Lotte LC700:`);
console.log(products);

// Check pagination or total count
const totalMatch = html.match(/총\s*<span>\s*(\d+)\s*<\/span>\s*개/i) ||
                   html.match(/totalCount\s*=\s*['"]?(\d+)['"]?/i) ||
                   html.match(/class="[^"]*paging[^"]*"[\s\S]*?<\/div>/i);
console.log('Total count or paging:', totalMatch ? totalMatch[0] : 'none');
