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
  const html = await fetch('https://www.bing.co.kr/product/detail?PDT=6');
  console.log('HTML length:', html.length);
  // Find product names, nutrition, descriptions, images
  const titles = html.match(/<[^>]*class="[^"]*(?:title|name|info|taste)[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi) || [];
  console.log('Sample titles/classes:', titles.slice(0, 10));

  const imgMatches = html.match(/<img[^>]+src="([^"]*upload\/product[^"]*)"/gi) || [];
  console.log('Product images:', imgMatches);

  // Let's check for nutrition table or list of variants
  const h3s = html.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi) || [];
  console.log('Headings:', h3s.slice(0, 10));
  
  // Find javascript variables or JSON in page
  const jsonMatches = html.match(/var\s+\w+\s*=\s*(\[[^;]+\]|\{[^;]+\});/gi);
  console.log('JS JSON matches:', jsonMatches ? jsonMatches.length : 0);
}

run();
