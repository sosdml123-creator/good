const fs = require('fs');

async function testFetchLinks(query) {
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
  const cr3Matches = [...html.matchAll(/href="(https:\/\/cr3\.shopping\.naver\.com\/v2\/bridge\/searchGate[^"]+)"/g)];
  console.log(`Query: ${query}, found cr3 links:`, cr3Matches.length);
  if (cr3Matches.length > 0) {
    console.log('Sample cr3 link:', cr3Matches[0][1].replace(/&amp;/g, '&'));
  }

  // Find smartstore outlinks
  const ssMatches = [...html.matchAll(/href="(https:\/\/(?:smartstore\.naver\.com|shopping\.naver\.com)\/inflow\/outlink\/url\?url=[^"]+)"/g)];
  console.log('Smartstore outlinks:', ssMatches.length);
  if (ssMatches.length > 0) {
    const rawUrl = ssMatches[0][1].replace(/&amp;/g, '&');
    const u = new URL(rawUrl);
    console.log('Decoded Smartstore URL:', decodeURIComponent(u.searchParams.get('url') || ''));
  }
}

testFetchLinks('사과');
