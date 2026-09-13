async function searchDaumImage(query) {
  try {
    const url = `https://search.daum.net/search?w=img&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    // match image src
    const imgMatches = [...html.matchAll(/data-src="([^"]+)"/g)].map(m => m[1]);
    const originMatches = [...html.matchAll(/data-original-src="([^"]+)"/g)].map(m => m[1]);
    const all = [...originMatches, ...imgMatches].filter(u => u.startsWith('http') && !u.includes('icon') && !u.includes('static'));
    console.log(`Daum Image for "${query}":`, all.slice(0, 3));
    return all[0];
  } catch (e) {
    console.error(`Daum error for ${query}:`, e.message);
    return null;
  }
}

async function run() {
  await searchDaumImage('CU 연세우유 우유생크림빵');
  await searchDaumImage('GS25 오모리 김치찌개라면');
  await searchDaumImage('세븐일레븐 세븐셀렉트 대파라면');
  await searchDaumImage('이마트24 속풀송송 대파라면');
}

run();
