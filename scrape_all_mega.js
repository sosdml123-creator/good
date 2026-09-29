import https from 'https';
import fs from 'fs';

async function fetchMenuPage(page) {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({
      page: page.toString(),
      menu_category1: '1',
      menu_category2: '1',
      category: '',
      list_checkbox_all: 'all'
    }).toString();

    const url = `https://www.mega-mgccoffee.com/menu/menu.php?${query}`;

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.mega-mgccoffee.com/menu/?menu_category1=1&menu_category2=1',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

function parseItemsFromHtml(html) {
  const items = [];
  
  const startIdx = html.indexOf('id="menu_list"');
  if (startIdx === -1) return { items, maxPage: 1 };
  
  const endIdx = html.indexOf('class="board_page_wrap"', startIdx);
  const content = endIdx !== -1 ? html.slice(startIdx, endIdx) : html.slice(startIdx);

  const rawBlocks = content.split(/<li\b[^>]*>\s*<a class="inner_modal_open">/i).slice(1);

  for (const block of rawBlocks) {
    const labelMatch = block.match(/<div class="cont_gallery_list_label[^"]*">([\s\S]*?)<\/div>/i);
    const tempLabel = labelMatch ? labelMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    const imgMatch = block.match(/<img[^>]+src="([^"]*)"/i);
    const image = imgMatch ? imgMatch[1].trim() : '';

    const titleMatch = block.match(/<div class="cont_text_inner text_wrap cont_text_title">[\s\S]*?<b>([\s\S]*?)<\/b>/i);
    const name = titleMatch ? titleMatch[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';

    const enMatch = block.match(/<div class="cont_text_inner text_wrap cont_text_info">[\s\S]*?<div class="text text1">([\s\S]*?)<\/div>/i);
    const nameEn = enMatch ? enMatch[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';

    const volumeMatch = block.match(/컵용량\s*:\s*([\s\S]*?)<\/div>/i);
    const volume = volumeMatch ? volumeMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    const calMatch = block.match(/1회\s*제공량\s*([\d\.]+)\s*kcal/i);
    const calories = calMatch ? parseFloat(calMatch[1]) : 0;

    const descMatch = block.match(/<div class="cont_text cont_text_info">\s*<div class="text_wrap">\s*<div class="text text2">([\s\S]*?)<\/div>/i)
      || block.match(/<div class="cont_text">\s*([^<]+(?:\n[^<]+)*)\s*<\/div>\s*<div class="cont_text cont_text_info">/i);
    const description = descMatch ? descMatch[1].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim() : '';

    const allergyMatch = block.match(/알레르기\s*성분\s*:\s*([^<\n\r]+)/i);
    const allergensStr = allergyMatch ? allergyMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const allergens = allergensStr && allergensStr !== '-' ? allergensStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    const hasCaffeineWarning = /고카페인\s*함유/i.test(block);

    const satFatMatch = block.match(/포화지방\s*([\d\.]+(?:g|mg)?)/i);
    const sugarMatch = block.match(/당류\s*([\d\.]+(?:g|mg)?)/i);
    const sodiumMatch = block.match(/나트륨\s*([\d\.]+(?:g|mg)?)/i);
    const proteinMatch = block.match(/단백질\s*([\d\.]+(?:g|mg)?)/i);
    const caffeineMatch = block.match(/카페인\s*([\d\.]+(?:g|mg)?)/i);

    const nutrition = {
      calories: calories,
      satFat: satFatMatch ? satFatMatch[1].trim() : '',
      sugar: sugarMatch ? sugarMatch[1].trim() : '',
      sodium: sodiumMatch ? sodiumMatch[1].trim() : '',
      protein: proteinMatch ? proteinMatch[1].trim() : '',
      caffeine: caffeineMatch ? caffeineMatch[1].trim() : ''
    };

    if (name) {
      items.push({
        name,
        nameEn,
        tempLabel,
        image,
        volume,
        calories,
        description,
        allergens,
        hasCaffeineWarning,
        nutrition
      });
    }
  }

  // Find max page
  const pageMatches = [...html.matchAll(/data-page='(\d+)'/g)];
  let maxPage = 1;
  for (const pm of pageMatches) {
    const p = parseInt(pm[1], 10);
    if (p > maxPage) maxPage = p;
  }

  return { items, maxPage };
}

async function scrapeAll() {
  let page = 1;
  let maxPage = 1;
  const allItems = [];
  const seen = new Set();

  while (page <= maxPage) {
    console.log(`Fetching page ${page}...`);
    const html = await fetchMenuPage(page);
    const result = parseItemsFromHtml(html);
    if (result.maxPage > maxPage) {
      maxPage = result.maxPage;
    }
    console.log(`Page ${page} parsed: ${result.items.length} items. (Max page: ${maxPage})`);
    
    for (const item of result.items) {
      const key = `${item.name}_${item.tempLabel}`;
      if (!seen.has(key)) {
        seen.add(key);
        allItems.push(item);
      }
    }

    page++;
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== Total unique items scraped: ${allItems.length} ===`);
  fs.writeFileSync('mega_coffee_drinks.json', JSON.stringify(allItems, null, 2), 'utf-8');
  console.log('Saved to mega_coffee_drinks.json');
}

scrapeAll().catch(console.error);
