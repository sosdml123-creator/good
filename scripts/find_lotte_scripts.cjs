const fs = require('fs');
const html = fs.readFileSync('scripts/lotte_lc700.html', 'utf-8');

let pos = 0;
while (true) {
  const next = html.indexOf('button-more', pos);
  if (next === -1) break;
  if (!html.substring(next - 30, next).includes('class=')) {
    console.log('Non-class occurrence at', next);
    console.log(html.substring(next - 50, next + 300));
  }
  pos = next + 11;
}

// Check scripts included
const scriptTags = html.match(/<script[^>]*src="([^"]+)"/gi) || [];
console.log('Script tags:', scriptTags);
