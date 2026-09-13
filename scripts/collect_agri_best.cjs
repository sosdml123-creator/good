const fs = require('fs');

async function fetchNaverSearch(query) {
  const url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=' + encodeURIComponent(query);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    }
  });
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} for query: ${query}`);
  }
  return await res.text();
}

function parseNaverShoppingItem(html, targetKeyword) {
  const imgRegex = /<img[^>]+src="(https:\/\/shopping-phinf\.pstatic\.net\/main_[^"]+)"[^>]+alt="([^"]+)"/g;
  const items = [];

  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const img = match[1];
    let title = match[2].replace(/<\/?mark>/g, '').replace(/&lt;\/?mark&gt;/g, '').trim();
    if (!title) continue;

    const pos = match.index;
    const chunk = html.substring(pos, pos + 4500);

    let price = 0;
    let originalPrice = 0;
    let discountRate = 0;

    const origMatch = chunk.match(/<span class="blind">할인 전 판매가<\/span>\s*<span[^>]*>([0-9,]+)<\/span>/);
    if (origMatch) {
      originalPrice = parseInt(origMatch[1].replace(/,/g, ''), 10);
    }

    const discMatch = chunk.match(/<span class="[^"]*">([0-9]+)<!-- -->%<span class="blind">할인<\/span>/);
    if (discMatch) {
      discountRate = parseInt(discMatch[1], 10);
    }

    const priceMatches = [...chunk.matchAll(/<span class="lfETsaia">([0-9,]+)<\/span>\s*<span class="TVuGseeW">원<\/span>/g)];
    if (priceMatches.length > 0) {
      const lastPrice = priceMatches[priceMatches.length - 1][1];
      price = parseInt(lastPrice.replace(/,/g, ''), 10);
    } else {
      const fallbackPriceMatch = chunk.match(/([0-9,]{4,10})\s*원/);
      if (fallbackPriceMatch) {
        price = parseInt(fallbackPriceMatch[1].replace(/,/g, ''), 10);
      }
    }

    if (price < 1000) continue;

    if (originalPrice === 0 && price > 0) {
      originalPrice = discountRate > 0 ? Math.round(price / (1 - discountRate / 100)) : price;
    }

    let rating = 4.8;
    let reviewCount = 150;
    const ratingMatch = chunk.match(/<span class="mlLzqQ3t">([0-9.]+)<\/span>\s*<span class="zZrIETI9">\((?:<!-- -->)?([0-9,]+)(?:<!-- -->)?\)/);
    if (ratingMatch) {
      rating = parseFloat(ratingMatch[1]);
      reviewCount = parseInt(ratingMatch[2].replace(/,/g, ''), 10);
    }

    let purchaseCount = 0;
    const purchaseMatch = chunk.match(/구매\s*(?:<!-- -->)?\s*([0-9,]+)/);
    if (purchaseMatch) {
      purchaseCount = parseInt(purchaseMatch[1].replace(/,/g, ''), 10);
    }

    let mallName = '';
    const mallMatch = chunk.match(/class="iMhVFYLc"[^>]*>([^<]+)<\/a>/) ||
                     chunk.match(/class="[^"]*(?:mall|seller|brand)[^"]*"[^>]*>([^<]+)<\/a>/) ||
                     chunk.match(/>([가-힣A-Za-z0-9\s]{2,15}(?:농원|농장|스토어|팜|몰|상회|푸드|마켓|유통|상사|축산|한우|청과|과일|정육|목장|마을))</);
    if (mallMatch) {
      mallName = mallMatch[1].trim();
    }
    if (!mallName) {
      mallName = '네이버 산지직송';
    }

    let deliveryText = '무료배송 🚀';
    const deliveryMatch = chunk.match(/([내모레\s0-9.()]+\s*도착)/);
    if (deliveryMatch) {
      deliveryText = deliveryMatch[1].trim() + ' 도착';
    }

    items.push({
      title,
      price,
      originalPrice,
      discountRate,
      image: img,
      rating,
      reviewCount,
      purchaseCount,
      mallName,
      deliveryText
    });
  }

  // Sort by purchase count + review count to pick the #1 best-selling product
  items.sort((a, b) => (b.purchaseCount * 3 + b.reviewCount) - (a.purchaseCount * 3 + a.reviewCount));

  return items;
}

const CATEGORY_TARGETS = [
  // 1. 과일 카테고리
  { category: '과일', subCategory: '사과', query: '사과' },
  { category: '과일', subCategory: '복숭아', query: '복숭아' },
  { category: '과일', subCategory: '딸기', query: '딸기' },
  { category: '과일', subCategory: '수박', query: '수박' },
  { category: '과일', subCategory: '귤', query: '제주 감귤' },
  { category: '과일', subCategory: '포도', query: '샤인머스캣' },
  { category: '과일', subCategory: '바나나', query: '바나나' },
  { category: '과일', subCategory: '배', query: '나주배' },
  { category: '과일', subCategory: '참외', query: '성주 참외' },

  // 2. 축산물 카테고리 (고기·수산)
  { category: '고기·수산', subCategory: '소고기', query: '한우 꽃등심' },
  { category: '고기·수산', subCategory: '돼지고기', query: '한돈 삼겹살' },
  { category: '고기·수산', subCategory: '닭고기', query: '닭볶음탕용 생닭' },
  { category: '고기·수산', subCategory: '오리고기', query: '생오리로스' },

  // 3. 식재료 카테고리 (농산물 채소, 쌀, 난류)
  { category: '식재료', subCategory: '계란', query: '무항생제 동물복지 계란' },
  { category: '식재료', subCategory: '두부', query: '국산콩 부침두부' },
  { category: '식재료', subCategory: '감자', query: '강원도 수미 감자' },
  { category: '식재료', subCategory: '고구마', query: '베니하루카 꿀고구마' },
  { category: '식재료', subCategory: '양파', query: '국내산 햇양파' },
  { category: '식재료', subCategory: '쌀·잡곡', query: '햅쌀 10kg' }
];

async function collectAll() {
  const results = [];

  for (let i = 0; i < CATEGORY_TARGETS.length; i++) {
    const target = CATEGORY_TARGETS[i];
    console.log(`[${i+1}/${CATEGORY_TARGETS.length}] Fetching ${target.category} > ${target.subCategory} ("${target.query}")...`);
    try {
      const html = await fetchNaverSearch(target.query);
      const items = parseNaverShoppingItem(html, target.subCategory);
      if (items.length > 0) {
        const best = items[0];
        console.log(`  -> 🏆 BEST 1위: ${best.title}`);
        console.log(`     가격: ${best.price.toLocaleString()}원 (할인전 ${best.originalPrice.toLocaleString()}원, -${best.discountRate}%)`);
        console.log(`     판매처: ${best.mallName} | 구매수: ${best.purchaseCount.toLocaleString()}건 | 리뷰: ${best.reviewCount.toLocaleString()}개 (★${best.rating})`);
        console.log(`     이미지: ${best.image}`);
        results.push({
          category: target.category,
          subCategory: target.subCategory,
          query: target.query,
          best
        });
      } else {
        console.warn(`  -> ⚠️ 검색 결과 상품 없음: ${target.query}`);
      }
    } catch (e) {
      console.error(`  -> ❌ Error fetching ${target.query}:`, e.message);
    }

    // Delay 800ms
    await new Promise(r => setTimeout(r, 800));
  }

  fs.writeFileSync('scripts/naver_agri_best_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n🎉 수집 완료! 총 ${results.length}개 카테고리 1위 상품 저장됨 (scripts/naver_agri_best_results.json)`);
}

collectAll();
