const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const brList = JSON.parse(fs.readFileSync('scripts/br_products.json', 'utf-8'));
  for (const item of brList.slice(0, 3)) {
    const html = await fetch(`https://www.baskinrobbins.co.kr/menu/view.php?seq=${item.seq}`);
    console.log(`=== BR: ${item.name} (${item.seq}) ===`);
    const titleKo = html.match(/<span class="menu-view-header__title--ko">\s*([^<]+)\s*<\/span>/i);
    const titleEn = html.match(/<span class="menu-view-header__title--en">\s*([^<]+)\s*<\/span>/i);
    const desc = html.match(/<p class="menu-view-header__text">\s*([^<]+)\s*<\/p>/i);
    
    // Nutrition
    const calories = html.match(/열량\(kcal\)[\s\S]*?<dd[^>]*>\s*(\d+)\s*<\/dd>/i);
    const sugar = html.match(/당류\(g\)[\s\S]*?<dd[^>]*>\s*(\d+)\s*<\/dd>/i);
    const protein = html.match(/단백질\(g\)[\s\S]*?<dd[^>]*>\s*(\d+)\s*<\/dd>/i);
    const fat = html.match(/포화지방\(g\)[\s\S]*?<dd[^>]*>\s*([\d.]+)\s*<\/dd>/i);
    const sodium = html.match(/나트륨\(mg\)[\s\S]*?<dd[^>]*>\s*(\d+)\s*<\/dd>/i);
    const allergens = html.match(/알레르기 성분[\s\S]*?<dd[^>]*>\s*([^<]+)\s*<\/dd>/i);

    console.log('Title Ko:', titleKo ? titleKo[1].trim() : item.name);
    console.log('Title En:', titleEn ? titleEn[1].trim() : '');
    console.log('Desc:', desc ? desc[1].trim() : '');
    console.log('Calories:', calories ? calories[1] : '');
    console.log('Allergens:', allergens ? allergens[1].trim() : '');
  }
}

run();
