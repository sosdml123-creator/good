const fs = require('fs');

let content = fs.readFileSync('src/data/iceCreamProducts.ts', 'utf-8');

// Replace any corrupted characters if any
if (content.includes('스퇴르')) {
  content = content.replace(/스퇴르/g, '파스퇴르');
}

fs.writeFileSync('src/data/iceCreamProducts.ts', content, 'utf-8');

// Just parse the JSON from content
const jsonMatch = content.match(/export const ICE_CREAM_PRODUCTS: Product\[\] = ([\s\S]*?);\s*$/);
if (jsonMatch) {
  const list = JSON.parse(jsonMatch[1]);
  console.log(`Verified ${list.length} ice cream products:`);
  console.log('Binggrae count:', list.filter(p => p.brand === '빙그레').length);
  console.log('Haitai count:', list.filter(p => p.brand === '해태아이스').length);
  console.log('Lotte count:', list.filter(p => p.brand === '롯데웰푸드').length);
  console.log('Baskin Robbins count:', list.filter(p => p.brand === '배스킨라빈스').length);
  
  // Show sample from each
  console.log('\n--- Sample Binggrae ---');
  console.log(list.find(p => p.name.includes('메로나')));
  
  console.log('\n--- Sample Haitai ---');
  console.log(list.find(p => p.name.includes('부라보')));

  console.log('\n--- Sample Lotte ---');
  console.log(list.find(p => p.name.includes('월드콘')));

  console.log('\n--- Sample BR ---');
  console.log(list.find(p => p.name.includes('엄마는 외계인')));
}
