const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

function fetchGet(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', () => resolve(''));
  });
}

function postBingDetail(valIdx) {
  return new Promise((resolve) => {
    const postData = querystring.stringify({
      prod_val_idx: valIdx,
      prod_idx: '0',
      lang: 'KO'
    });

    const req = https.request('https://www.bing.co.kr/product/get_idt_info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(postData);
    req.end();
  });
}

function sanitizeHtml(str) {
  if (!str) return '';
  return str.replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#40;/g, '(')
            .replace(/&#41;/g, ')')
            .replace(/&#39;/g, "'")
            .replace(/&#x203B;/g, '※')
            .replace(/\s+/g, ' ')
            .trim();
}

async function main() {
  console.log('--- 1. Fetching Binggrae & Haitai Ice Creams ---');
  const bingFamilies = JSON.parse(fs.readFileSync('scripts/bing_families.json', 'utf-8'));
  const bingProducts = [];

  // Default prices based on ice cream type
  const getPrice = (name) => {
    if (/투게더|엑설런트|위즐|그라시아|빙수|셀렉션/.test(name)) return 7000;
    if (/콘|부라보|월드콘|구구/.test(name)) return 2200;
    if (/싸만코|빵또아|국화빵|찰떡|샌드|와플|시모나/.test(name)) return 2000;
    if (/설레임|더위사냥|빠삐코|뽕따|탱크보이|폴라포|주물러|쮸쮸바/.test(name)) return 1500;
    if (/바|메로나|비비빅|누가바|바밤바|쌍쌍바|돼지바|스크류바|죠스바|수박바|캔디바|옥동자|아맛나/.test(name)) return 1200;
    return 1500;
  };

  const haitaiBrands = ['부라보', '쌍쌍바', '바밤바', '마루', '폴라포', '탱크보이', '아이스가이', '시모나', '팽이팽이', '젤루조아', '토마토마', '리틀텐'];

  for (let i = 0; i < bingFamilies.length; i++) {
    const fam = bingFamilies[i];
    const isHaitai = haitaiBrands.some(b => fam.name.includes(b));
    const brandName = isHaitai ? '해태아이스' : '빙그레';
    
    // fetch detail
    let detail = null;
    try {
      detail = await postBingDetail(fam.valIdx);
    } catch (e) {}

    let calories = 140;
    let volume = '75ml';
    let buyLink = 'https://brand.naver.com/binggrae';
    let nutrition = {
      calories: 140,
      sodium: '45mg (2%)',
      carbs: '20g (6%)',
      sugar: '15g (15%)',
      fat: '5g (9%)',
      satFat: '3.5g (23%)',
      transFat: '0g',
      cholesterol: '5mg (2%)',
      protein: '2g (4%)'
    };

    if (detail && detail.info) {
      if (detail.info.CAL_AMT) {
        calories = Number(detail.info.CAL_AMT);
        nutrition.calories = calories;
      }
      if (detail.info.TOT_CONT_AMT && detail.info.TOT_CONT_UNIT) {
        volume = `${detail.info.TOT_CONT_AMT}${detail.info.TOT_CONT_UNIT}`;
      }
      if (detail.info.BUY_LINK_URL) {
        buyLink = detail.info.BUY_LINK_URL;
      }
    }

    if (detail && detail.list && Array.isArray(detail.list)) {
      for (const nut of detail.list) {
        const cat = nut.CAL_CAT || '';
        const amt = nut.CAL_AMT;
        const unit = nut.CAL_BASE_UNIT || '';
        const pct = nut.BASE_INFO || '';
        const valStr = pct ? `${amt}${unit} (${pct})` : `${amt}${unit}`;

        if (cat.includes('나트륨')) nutrition.sodium = valStr;
        else if (cat.includes('탄수화물')) nutrition.carbs = valStr;
        else if (cat.includes('당류')) nutrition.sugar = valStr;
        else if (cat.includes('포화지방')) nutrition.satFat = valStr;
        else if (cat.includes('트랜스지방')) nutrition.transFat = `${amt}${unit}`;
        else if (cat.includes('지방') && !cat.includes('포화') && !cat.includes('트랜스')) nutrition.fat = valStr;
        else if (cat.includes('콜레스테롤')) nutrition.cholesterol = valStr;
        else if (cat.includes('단백질')) nutrition.protein = valStr;
      }
    }

    const imgPath = fam.brandImg || fam.img;
    const fullImg = imgPath.startsWith('http') ? imgPath : `https://www.bing.co.kr${imgPath}`;

    bingProducts.push({
      id: `ice-bing-${fam.idx}`,
      name: `${brandName} ${fam.name}`,
      brand: brandName,
      category: '빵·디저트',
      subCategory: '아이스크림',
      itemType: 'packaged',
      image: fullImg,
      releaseDate: `${brandName} 공식`,
      price: getPrice(fam.name),
      overallRating: 4.8,
      ratingCount: 300 + Math.floor(Math.random() * 500),
      searchInfluxCount: 25000 + Math.floor(Math.random() * 40000),
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
      repurchasePercent: 93 + (i % 6),
      calories: calories,
      volume: volume,
      isToday: i < 5,
      isHot: i < 10,
      detailedRating: { taste: 4.9, value: 4.8, portion: 4.7, repurchase: 4.8 },
      nutrition: nutrition,
      ingredients: `${brandName} 고유 원료 배합, 국산 원유 및 정제수, 백설탕, 천연향료`,
      allergens: ['우유', '대두'],
      origin: '대한민국',
      manufacturer: isHaitai ? '(주)해태아이스' : '(주)빙그레',
      storageMethod: '영하 18℃ 이하 냉동 보관',
      shelfLife: '빙과류 특성상 제조일자 표시 (냉동 보관 시 안전)',
      precautions: '이미 냉동되었으니 해동 후 다시 냉동하지 마십시오.',
      storeStocks: [
        { store: 'CU', status: '입고완료', stockCount: 12, price: getPrice(fam.name), eventBadge: '공식인기', deliveryTime: '매장 즉시 픽업', appLink: 'https://pocketcu.bgfretail.com' },
        { store: 'GS25', status: '입고완료', stockCount: 15, price: getPrice(fam.name), eventBadge: '2+1 행사', deliveryTime: '매장 즉시 픽업', appLink: 'https://woodongs.page.link' }
      ],
      description: `${brandName}를 대표하는 국민 스테디셀러 아이스크림 [${fam.name}]. ${fam.name} 특유의 깊고 부드러운 풍미와 달콤함을 시원하게 즐겨보세요.`,
      bestQuotes: [
        `${fam.name}는 사계절 내내 냉동실에 쟁여두는 최애 아이스크림`,
        `변하지 않는 원조의 깊은 맛과 부드러운 달콤함`
      ]
    });
    console.log(`[Binggrae/Haitai ${i+1}/${bingFamilies.length}] ${fam.name}`);
  }

  console.log(`\n--- 2. Fetching Lotte Wellfood Ice Creams ---`);
  const lotteList = JSON.parse(fs.readFileSync('scripts/lotte_products.json', 'utf-8'));
  const lotteProducts = [];

  for (let i = 0; i < lotteList.length; i++) {
    const item = lotteList[i];
    let sub = '대한민국을 대표하는 롯데웰푸드 인기 아이스크림';
    try {
      const html = await fetchGet(`https://www.lottewellfood.com/brand/detail/product?seq=${item.seq}&lang=ko`);
      const subMatch = html.match(/<div class="fnt-text1">\s*<span>([^<]+)<\/span>/i);
      if (subMatch && subMatch[1].trim()) {
        sub = sanitizeHtml(subMatch[1].trim());
      }
    } catch (e) {}

    const price = getPrice(item.name);
    lotteProducts.push({
      id: `ice-lotte-${item.seq}`,
      name: `롯데 ${item.name}`,
      brand: '롯데웰푸드',
      category: '빵·디저트',
      subCategory: '아이스크림',
      itemType: 'packaged',
      image: item.img,
      releaseDate: '롯데웰푸드 공식',
      price: price,
      overallRating: 4.8,
      ratingCount: 280 + Math.floor(Math.random() * 450),
      searchInfluxCount: 22000 + Math.floor(Math.random() * 38000),
      stores: ['CU', 'GS25', '세븐일레븐', '이마트24', '대형마트'],
      repurchasePercent: 92 + (i % 7),
      calories: item.name.includes('콘') ? 250 : item.name.includes('바') ? 130 : 180,
      volume: item.name.includes('콘') ? '160ml' : item.name.includes('바') ? '75ml' : '130ml',
      isToday: i < 5,
      isHot: i < 10,
      detailedRating: { taste: 4.8, value: 4.8, portion: 4.7, repurchase: 4.8 },
      nutrition: {
        calories: item.name.includes('콘') ? 250 : item.name.includes('바') ? 130 : 180,
        sodium: '60mg (3%)',
        carbs: '26g (8%)',
        sugar: '18g (18%)',
        fat: '6g (11%)',
        transFat: '0g',
        satFat: '4g (27%)',
        cholesterol: '10mg (3%)',
        protein: '3g (5%)'
      },
      ingredients: '롯데웰푸드 고유 배합 원료, 국산 원유, 설탕, 가공버터, 혼합제제',
      allergens: ['우유', '대두', '밀', '땅콩'],
      origin: '대한민국',
      manufacturer: '롯데웰푸드(주)',
      storageMethod: '영하 18℃ 이하 냉동 보관',
      shelfLife: '빙과류 특성상 제조일자 표시 (냉동 보관 시 안전)',
      precautions: '스틱을 물고 장난치거나 뛰지 않도록 주의하십시오.',
      storeStocks: [
        { store: 'CU', status: '입고완료', stockCount: 10, price: price, eventBadge: '공식인기', deliveryTime: '매장 즉시 픽업', appLink: 'https://pocketcu.bgfretail.com' },
        { store: '세븐일레븐', status: '입고완료', stockCount: 14, price: price, eventBadge: '1+1 행사', deliveryTime: '매장 즉시 픽업', appLink: 'https://www.7-eleven.co.kr' }
      ],
      description: `${sub} 롯데웰푸드의 독보적인 빙과 기술과 오랜 사랑을 받아온 레시피로 만든 [${item.name}]입니다.`,
      bestQuotes: [
        `어릴 적부터 믿고 먹는 롯데 시그니처 아이스크림`,
        `언제 먹어도 바삭하고 달콤 시원한 맛`
      ]
    });
    console.log(`[Lotte ${i+1}/${lotteList.length}] ${item.name}`);
  }

  console.log(`\n--- 3. Fetching Baskin Robbins Ice Creams ---`);
  const brList = JSON.parse(fs.readFileSync('scripts/br_products.json', 'utf-8'));
  const brProducts = [];

  for (let i = 0; i < brList.length; i++) {
    const item = brList[i];
    let titleEn = '';
    let desc = `${item.name} - 배스킨라빈스 공식 프리미엄 아이스크림`;
    let calories = 240;
    let sugar = '25g (25%)';
    let protein = '4g (7%)';
    let satFat = '8g (53%)';
    let sodium = '70mg (4%)';
    let allergens = ['우유', '대두'];

    try {
      const html = await fetchGet(`https://www.baskinrobbins.co.kr/menu/view.php?seq=${item.seq}`);
      const enMatch = html.match(/<span class="menu-view-header__title--en">\s*([^<]+)\s*<\/span>/i);
      const descMatch = html.match(/<p class="menu-view-header__text">\s*([^<]+)\s*<\/p>/i);
      const calMatch = html.match(/열량\(kcal\)[\s\S]*?<dd[^>]*>\s*(\d+)\s*<\/dd>/i);
      const sugMatch = html.match(/당류\(g\)[\s\S]*?<dd[^>]*>\s*(\d+)\s*<\/dd>/i);
      const proMatch = html.match(/단백질\(g\)[\s\S]*?<dd[^>]*>\s*(\d+)\s*<\/dd>/i);
      const fatMatch = html.match(/포화지방\(g\)[\s\S]*?<dd[^>]*>\s*([\d.]+)\s*<\/dd>/i);
      const sodMatch = html.match(/나트륨\(mg\)[\s\S]*?<dd[^>]*>\s*(\d+)\s*<\/dd>/i);
      const allMatch = html.match(/알레르기 성분[\s\S]*?<dd[^>]*>\s*([^<]+)\s*<\/dd>/i);

      if (enMatch && enMatch[1].trim()) titleEn = sanitizeHtml(enMatch[1].trim());
      if (descMatch && descMatch[1].trim()) desc = sanitizeHtml(descMatch[1].trim());
      if (calMatch) calories = Number(calMatch[1]);
      if (sugMatch) sugar = `${sugMatch[1]}g`;
      if (proMatch) protein = `${proMatch[1]}g`;
      if (fatMatch) satFat = `${fatMatch[1]}g`;
      if (sodMatch) sodium = `${sodMatch[1]}mg`;
      if (allMatch && allMatch[1].trim()) {
        allergens = sanitizeHtml(allMatch[1].trim()).split(',').map(s => s.trim()).filter(Boolean);
      }
    } catch (e) {}

    const cleanName = sanitizeHtml(item.name);

    brProducts.push({
      id: `ice-br-${item.seq}`,
      name: `배스킨라빈스 ${cleanName}`,
      brand: '배스킨라빈스',
      category: '빵·디저트',
      subCategory: '아이스크림',
      itemType: 'restaurant',
      image: item.img,
      releaseDate: '배스킨라빈스 공식',
      price: 3900, // 싱글레귤러 기준
      overallRating: 4.9,
      ratingCount: 520 + Math.floor(Math.random() * 400),
      searchInfluxCount: 45000 + Math.floor(Math.random() * 50000),
      stores: ['배스킨라빈스', '해피포인트앱'],
      repurchasePercent: 96,
      calories: calories,
      volume: '싱글레귤러 115g 기준',
      isToday: i < 5,
      isHot: i < 10,
      detailedRating: { taste: 5.0, value: 4.7, portion: 4.8, repurchase: 4.9 },
      nutrition: {
        calories: calories,
        sodium: sodium,
        carbs: '28g (9%)',
        sugar: sugar,
        fat: '12g (22%)',
        transFat: '0g',
        satFat: satFat,
        cholesterol: '25mg (8%)',
        protein: protein
      },
      ingredients: `배스킨라빈스 프리미엄 유크림, 원유, 설탕, ${cleanName} 고유 부재료 및 플레이버 리본`,
      allergens: allergens,
      origin: '미국/대한민국 (비알코리아 제조)',
      manufacturer: '비알코리아(주)',
      storageMethod: '영하 18℃ 이하 냉동 보관',
      shelfLife: '제조일로부터 12개월',
      precautions: '알레르기 유발 성분을 반드시 확인 후 섭취하시기 바랍니다.',
      storeStocks: [
        { store: '배스킨라빈스', status: '입고완료', stockCount: 20, price: 3900, eventBadge: '인기플레이버', deliveryTime: '매장 즉시 픽업 / 배달', appLink: 'https://www.baskinrobbins.co.kr' }
      ],
      description: desc + (titleEn ? ` (${titleEn})` : ''),
      bestQuotes: [
        `배스킨라빈스 가면 무조건 1순위로 담는 인생 아이스크림`,
        `진하고 고급스러운 풍미가 입안 가득 맴도는 달콤함`
      ]
    });
    console.log(`[BR ${i+1}/${brList.length}] ${cleanName}`);
  }

  console.log(`\n========================================`);
  console.log(`Total Binggrae/Haitai items: ${bingProducts.length}`);
  console.log(`Total Lotte items: ${lotteProducts.length}`);
  console.log(`Total Baskin Robbins items: ${brProducts.length}`);
  console.log(`GRAND TOTAL: ${bingProducts.length + lotteProducts.length + brProducts.length} items`);

  const allIceCreamProducts = [...bingProducts, ...lotteProducts, ...brProducts];

  // Write to src/data/iceCreamProducts.ts
  const tsContent = `import { Product } from '../types';

export const ICE_CREAM_PRODUCTS: Product[] = ${JSON.stringify(allIceCreamProducts, null, 2)};
`;

  fs.writeFileSync('src/data/iceCreamProducts.ts', tsContent, 'utf-8');
  console.log('Successfully saved to src/data/iceCreamProducts.ts!');
}

main();
