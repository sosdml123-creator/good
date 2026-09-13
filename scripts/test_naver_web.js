async function searchDuckDuckGo(query) {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    // check if any results
    console.log(`DDG status for ${query}:`, res.status, 'html len:', html.length);
  } catch (e) {
    console.log('DDG error:', e.message);
  }
}

// Let's test Naver blog/shopping web search without API key:
async function searchNaverWeb(query) {
  try {
    const res = await fetch(`https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    const html = await res.text();
    console.log(`Naver Image search status for ${query}:`, res.status, 'len:', html.length);
    // Find image URLs in Naver
    // Naver image search has JSON data or img tags
    const matches = [...html.matchAll(/"_img"[^>]*src="([^"]+)"/g)].map(m => m[1]);
    const originMatches = [...html.matchAll(/"origin"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
    const bMatches = [...html.matchAll(/https:\/\/[^"'\s]+\.(?:jpg|jpeg|png)/g)].map(m => m[0]);
    console.log('Sample images found:', [...new Set(bMatches)].filter(u => !u.includes('ssl.pstatic') && !u.includes('static') && !u.includes('icon') && !u.includes('thumb')).slice(0, 5));
  } catch (e) {
    console.log('Naver error:', e.message);
  }
}

searchNaverWeb('연세우유 우유생크림빵');
