const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scripts/naver_agri_best_results.json', 'utf8'));

async function fetchLinksForTargets() {
  const linkResults = {};

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    const query = item.query;
    console.log(`[${i+1}/${raw.length}] Fetching link for: ${query} (${item.best.title.slice(0, 20)})...`);

    try {
      const url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=' + encodeURIComponent(query);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
        }
      });
      const html = await res.text();

      // Find cr3 links
      const cr3Matches = [...html.matchAll(/href="(https:\/\/cr3\.shopping\.naver\.com\/v2\/bridge\/searchGate[^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&'));
      
      // Find smartstore outlinks
      const ssMatches = [...html.matchAll(/href="(https:\/\/(?:smartstore\.naver\.com|shopping\.naver\.com)\/inflow\/outlink\/url\?url=[^"]+)"/g)].map(m => {
        try {
          const rawU = m[1].replace(/&amp;/g, '&');
          const u = new URL(rawU);
          return decodeURIComponent(u.searchParams.get('url') || '');
        } catch (e) {
          return '';
        }
      }).filter(Boolean);

      // Extract image nv_mid
      const imgMatch = item.best.image.match(/main_[0-9]+\/([0-9]+)/);
      const nv_mid = imgMatch ? imgMatch[1] : '';

      // Direct Naver Shopping query link
      const directSearchLink = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(item.best.mallName + ' ' + item.best.title.replace(/<[^>]+>/g, '').slice(0, 30))}`;

      // Pick the best primary link
      let primaryBuyLink = '';
      if (cr3Matches.length > 0) {
        primaryBuyLink = cr3Matches[0];
      } else if (ssMatches.length > 0) {
        primaryBuyLink = ssMatches[0];
      } else {
        primaryBuyLink = directSearchLink;
      }

      linkResults[item.subCategory] = {
        subCategory: item.subCategory,
        title: item.best.title,
        mallName: item.best.mallName,
        nv_mid,
        primaryBuyLink,
        directSearchLink,
        smartstoreLink: ssMatches[0] || '',
        cr3Link: cr3Matches[0] || ''
      };
      console.log('  -> Primary Buy Link:', primaryBuyLink.slice(0, 80) + '...');
    } catch (e) {
      console.error('Error for', query, e.message);
      linkResults[item.subCategory] = {
        subCategory: item.subCategory,
        primaryBuyLink: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(item.best.mallName + ' ' + item.best.title.slice(0, 30))}`
      };
    }

    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync('scripts/agri_real_links.json', JSON.stringify(linkResults, null, 2), 'utf8');
  console.log('Saved all links to scripts/agri_real_links.json');
}

fetchLinksForTargets();
