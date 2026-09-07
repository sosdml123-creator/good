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
  const html = await fetch('https://www.baskinrobbins.co.kr/menu/list.php?top=A');
  console.log('BR list length:', html.length);
  fs.writeFileSync('scripts/br_ice.html', html, 'utf-8');

  // Let's find product items: usually <li class="item" or <a href="view.php?seq=..."
  const items = html.match(/<a[^>]*href="[^"]*view\.php[^"]*"[\s\S]*?<\/a>/gi) || [];
  console.log('BR items count:', items.length);
  if (items.length > 0) {
    console.log('Sample BR item:', items[0]);
  } else {
    // search for view.php or image or menu name
    const viewMatches = html.match(/href="[^"]*view\.php\?seq=[^"]*"/gi) || [];
    console.log('BR view matches:', viewMatches.slice(0, 10));
    
    // search for common flavors: 엄마는 외계인, 아몬드 봉봉, 민트 초콜릿 칩
    ['엄마는 외계인', '아몬드 봉봉', '민트', '슈팅스타'].forEach(f => {
      console.log(f, html.includes(f));
    });
  }
}

run();
