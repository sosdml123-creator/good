const fs = require('fs');
const html = fs.readFileSync('scripts/br_ice.html', 'utf-8');
const logos = html.match(/src="([^"]*logo[^"]*)"/gi);
console.log('BR logo matches:', logos);
