const fs = require('fs');

const html = fs.readFileSync('scripts/ria.html', 'utf8');

// Pattern:
// <img src="(https://img.lotteeatz.com/upload/product/[^"]+)"\s+alt="([^"]+)"
// or in card:
// alt="name" ... src="url" or vice versa
const regex = /<img\s+src="([^"]+)"\s+alt="([^"]+)"/g;
let m;
const items = [];
while ((m = regex.exec(html)) !== null) {
  items.push({ name: m[2], image: m[1] });
}

console.log('Found with alt:', items.length);
items.forEach(it => {
  if (it.name.includes('버거') || it.name.includes('리아') || it.name.includes('티렉스') || it.name.includes('한우') || it.name.includes('데리') || it.name.includes('새우')) {
    console.log(`${it.name} => ${it.image}`);
  }
});



checkRia();