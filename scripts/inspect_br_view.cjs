const https = require('https');

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
  const html = await fetch('https://www.baskinrobbins.co.kr/menu/view.php?seq=1139');
  console.log('BR view length:', html.length);
  
  // Find title, description, nutrition table
  const titleMatch = html.match(/<h\d[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h\d>/i) ||
                     html.match(/<div class="menu-view__title">([\s\S]*?)<\/div>/i) ||
                     html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  console.log('Title match:', titleMatch ? titleMatch[1].trim() : 'none');

  const descMatch = html.match(/<p class="menu-view__content">([\s\S]*?)<\/p>/i) ||
                    html.match(/<div class="menu-view__sub">([\s\S]*?)<\/div>/i);
  console.log('Desc match:', descMatch ? descMatch[1].trim() : 'none');

  // Nutrition table
  const nutMatch = html.match(/<table[\s\S]*?<\/table>/gi) ||
                   html.match(/<div class="menu-view__nutrition"[\s\S]*?<\/div>/gi);
  console.log('Nutrition snippet:', nutMatch ? nutMatch[0].substring(0, 500) : 'none');
}

run();
