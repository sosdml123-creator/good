const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 15000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

function cleanText(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ')
            .trim();
}

async function scrapeAll() {
  console.log('--- 1. Fetching all items from category lists ---');
  const categoryMap = {
    45: '라면',
    46: '스낵',
    47: '유제품',
    48: '소스·간편식',
    89: '냉동 간편식'
  };

  const rawProducts = [];

  for (const [cateCd, cateName] of Object.entries(categoryMap)) {
    let page = 1;
    while (true) {
      const url = `https://www.samyangfoods.com/kor/brand/ajaxProductList.do?pageIndex=${page}&pageUnit=20&searchCateCd1=${cateCd}`;
      const res = await fetchHtml(url);
      if (!res.body) break;

      const lis = [...res.body.matchAll(/<li>([\s\S]*?)<\/li>/gi)].map(m => m[1]);
      let pageCount = 0;
      for (const li of lis) {
        const seqMatch = li.match(/fnView\('\.\/view\.do','(\d+)'\)/);
        const imgMatch = li.match(/<img[^>]+src=["']([^"']+)["']/);
        const nameMatch = li.match(/<div[^>]*>([^<]+)<\/div>\s*<div class="btn-type04">/i) || li.match(/<\/div>\s*<div>([^<]+)<\/div>/i);
        const buyMatch = li.match(/<a[^>]+href=["']([^"']+)["'][^>]*class="btn02"/i);

        if (seqMatch && nameMatch) {
          const seq = seqMatch[1];
          let img = imgMatch ? imgMatch[1] : '';
          if (img && !img.startsWith('http')) {
            img = `https://www.samyangfoods.com${img}`;
          }
          const name = cleanText(nameMatch[1]);
          let buyUrl = buyMatch ? buyMatch[1] : '';
          if (buyUrl.startsWith('//')) buyUrl = `https:${buyUrl}`;

          rawProducts.push({
            seq,
            cateCd,
            cateName,
            name,
            img,
            buyUrl
          });
          pageCount++;
        }
      }
      if (pageCount === 0) break;
      page++;
    }
  }

  console.log(`Total raw products found across all categories: ${rawProducts.length}`);

  // Deduplicate by seq
  const uniqueItems = [];
  const seenSeqs = new Set();
  for (const p of rawProducts) {
    if (!seenSeqs.has(p.seq)) {
      seenSeqs.add(p.seq);
      uniqueItems.push(p);
    }
  }
  console.log(`Unique items count: ${uniqueItems.length}`);

  // 2. Fetch details for each item
  console.log('--- 2. Fetching detail pages for all items ---');
  const detailedProducts = [];

  for (let i = 0; i < uniqueItems.length; i++) {
    const item = uniqueItems[i];
    process.stdout.write(`[${i + 1}/${uniqueItems.length}] Fetching seq ${item.seq}: ${item.name}... `);
    const detailUrl = `https://www.samyangfoods.com/kor/brand/view.do?seq=${item.seq}`;
    const detailRes = await fetchHtml(detailUrl);
    
    if (!detailRes.body) {
      console.log('FAILED to load detail page.');
      detailedProducts.push(item);
      continue;
    }

    const body = detailRes.body;

    // Subtitle / slogan
    const subTitleMatch = body.match(/<div class="prod-tit-txt">([\s\S]*?)<\/div>/i);
    const slogan = subTitleMatch ? cleanText(subTitleMatch[1]) : '';

    // Weight, calories, shelf life, release year
    const weightMatch = body.match(/중량[\s\S]*?<p>([^<]+)<\/p>/i);
    const calMatch = body.match(/칼로리[\s\S]*?<p>([^<]+)<\/p>/i);
    const shelfLifeMatch = body.match(/소비기한[\s\S]*?<p>([^<]+)<\/p>/i);
    const releaseMatch = body.match(/출시년도[\s\S]*?<p>([^<]+)<\/p>/i);

    // Table rows
    const foodTypeMatch = body.match(/<th>식품의 유형<\/th>[\s\S]*?<td>([\s\S]*?)<\/td>/i);
    const packageTypeMatch = body.match(/<th>포장재질<\/th>[\s\S]*?<td>([\s\S]*?)<\/td>/i);
    const manuMatch = body.match(/<th>제조원<\/th>[\s\S]*?<td>([\s\S]*?)<\/td>/i);

    // Product features
    const featMatch = body.match(/<div class="product-view-text area01">[\s\S]*?<p>([\s\S]*?)<\/p>/i);
    const features = featMatch ? cleanText(featMatch[1]) : '';

    // Product banner image
    const bannerMatch = body.match(/<div class="product-view-banner">[\s\S]*?<img[^>]+src=["']([^"']+)["']/i);
    let bannerImg = '';
    if (bannerMatch) {
      let bSrc = bannerMatch[1].replace(/^\.\.\/\.\./, '');
      bannerImg = bSrc.startsWith('http') ? bSrc : `https://www.samyangfoods.com${bSrc}`;
    }

    // Direct buy link on detail page
    const detailBuyMatch = body.match(/<a[^>]+href=["']([^"']+)["'][^>]*class="btn02"[^>]*>구매하기<\/a>/i);
    let finalBuyUrl = item.buyUrl;
    if (detailBuyMatch) {
      let u = detailBuyMatch[1];
      if (u.startsWith('//')) u = `https:${u}`;
      if (u && !u.includes('javascript')) finalBuyUrl = u;
    }

    detailedProducts.push({
      ...item,
      slogan,
      weight: weightMatch ? cleanText(weightMatch[1]) : '',
      calories: calMatch ? cleanText(calMatch[1]) : '',
      shelfLife: shelfLifeMatch ? cleanText(shelfLifeMatch[1]) : '',
      releaseDate: releaseMatch ? cleanText(releaseMatch[1]) : '',
      foodType: foodTypeMatch ? cleanText(foodTypeMatch[1]) : '',
      packageType: packageTypeMatch ? cleanText(packageTypeMatch[1]) : '',
      manufacturer: manuMatch ? cleanText(manuMatch[1]) : '삼양식품(주)',
      features,
      bannerImg,
      buyUrl: finalBuyUrl
    });
    console.log('DONE');
  }

  // Save intermediate JSON
  fs.writeFileSync(path.join(__dirname, 'samyang_scraped_raw.json'), JSON.stringify(detailedProducts, null, 2), 'utf-8');
  console.log(`\nSuccessfully saved ${detailedProducts.length} items to scripts/samyang_scraped_raw.json`);
}

scrapeAll();
