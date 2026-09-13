import fs from 'fs';

async function testNaverImages() {
  const query = '연세우유 우유생크림빵';
  const res = await fetch(`https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${encodeURIComponent(query)}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/naver_img.html', html, 'utf-8');
  console.log('Saved. Looking for image patterns...');
  // Find searchcdn or img patterns
  const matches = [...html.matchAll(/https:\/\/[^"'\s<>]+type=b400/g)].map(m => m[0]);
  console.log('type=b400 matches:', matches.slice(0, 5));
  // also search for search.pstatic.net
  const pstatic = [...html.matchAll(/https:\/\/search\.pstatic\.net\/common\/\?src=[^"'\s&]+/g)].map(m => m[0]);
  console.log('pstatic matches:', pstatic.slice(0, 5));
  if (pstatic.length > 0) {
    const decoded = decodeURIComponent(pstatic[0].replace('https://search.pstatic.net/common/?src=', ''));
    console.log('Decoded original image:', decoded);
  }
}

testNaverImages();
