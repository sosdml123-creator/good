const fs = require('fs');
const html = fs.readFileSync('scripts/br_view.html', 'utf-8');

['열량', '당류', '단백질', '포화지방', '나트륨', '알레르기'].forEach(k => {
  const idx = html.indexOf(k);
  if (idx !== -1) {
    console.log(`Found ${k}:`);
    console.log(html.substring(idx - 50, idx + 200));
  }
});
