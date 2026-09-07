const fs = require('fs');
const html = fs.readFileSync('scripts/lotte_lc700.html', 'utf-8');

const inlineScripts = html.match(/<script>(?![\s\S]*src=)[\s\S]*?<\/script>/gi) ||
                      html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || [];

for (const s of inlineScripts) {
  if (s.includes('seq') || s.includes('product') || s.includes('ajax')) {
    console.log('--- Inline script ---');
    console.log(s.substring(0, 500));
  }
}
