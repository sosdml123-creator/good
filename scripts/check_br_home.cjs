const fs = require('fs');
const html = fs.readFileSync('scripts/br_ice.html', 'utf-8');
const matches = html.match(/<a[^>]*href="(?:\/|index\.php)[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];
console.log('Home links:', matches.slice(0, 5));
