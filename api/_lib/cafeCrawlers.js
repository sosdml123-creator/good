import { fetchText, decodeEntities, detectFoodCategory, detectFoodSubCategory, hashString, isFoodProduct } from './storeCrawlers.js';

function row(brand, key, name, image, url, description = '', category) {
  name = decodeEntities(name);
  category ||= detectFoodCategory(name);
  return {
    id: `${key}-${hashString(name)}`, name, brand, category,
    sub_category: detectFoodSubCategory(name, category) || null,
    item_type: 'restaurant', image: encodeURI(decodeURI(image)),
    release_date: null, price: 0, discount_rate: 0, stores: [brand],
    description: decodeEntities(description), source_name: `${brand} 공식 신메뉴`, source_url: url,
  };
}

export function parseStarbucksProducts(data, page) {
  if (!Array.isArray(data.list)) throw new Error('스타벅스 상품 응답 형식이 변경되었습니다.');
  return data.list.filter(p => p.newicon === 'Y' && p.product_NM && p.file_PATH && isFoodProduct(p.product_NM)).map(p => ({
    ...row('스타벅스', 'starbucks', p.product_NM, `https://image.istarbucks.co.kr${p.file_PATH}`,
      `https://www.starbucks.co.kr/menu/${page.replace('_list', '_view')}?product_cd=${p.product_CD}`, p.content,
      page.startsWith('drink') ? '음료' : undefined),
    id: `starbucks-${p.product_CD}`, calories: Number.isFinite(Number(p.kcal)) && p.kcal !== '' ? Math.round(Number(p.kcal)) : null,
  }));
}

export async function crawlStarbucksNew() {
  const pages = await Promise.all(['drink_list.do', 'food_list.do'].map(async page => {
    const html = await fetchText(`https://www.starbucks.co.kr/menu/${page}`);
    const codes = [...new Set([...html.matchAll(/result\s*=\s*"(W\d{7})"/g)].map(m => m[1]))];
    if (!codes.length) throw new Error('스타벅스 메뉴 분류를 찾지 못했습니다.');
    return (await Promise.all(codes.map(async code => parseStarbucksProducts(
      JSON.parse(await fetchText(`https://www.starbucks.co.kr/upload/json/menu/${code}.js`)), page,
    )))).flat();
  }));
  return [...new Map(pages.flat().map(p => [p.id, p])).values()];
}

export function parseMegaProducts(html) {
  if (!html.includes('신메뉴')) throw new Error('메가커피 신메뉴 목록 형식이 변경되었습니다.');
  return html.split(/class="cont_gallery_list_box"/).slice(1).flatMap(block => {
    const name = block.match(/<b>([\s\S]*?)<\/b>/)?.[1];
    const image = block.match(/<img[^>]+src="([^"]+)"/)?.[1];
    if (!name || !image?.includes('/upload/menu/') || !isFoodProduct(name)) return [];
    return [row('메가MGC커피', 'mega', name, image, 'https://www.mega-mgccoffee.com/',
      block.match(/class="text text2">([\s\S]*?)<\/div>/)?.[1] || '')];
  });
}

export async function crawlMegaNew() {
  // 전체 메뉴가 아닌 홈페이지의 현재 시즌 신메뉴 카드만 수집합니다.
  return parseMegaProducts(await fetchText('https://www.mega-mgccoffee.com/'));
}

export function parsePaikProducts(html) {
  if (!html.includes('new_menu_slider')) throw new Error('빽다방 신메뉴 목록 형식이 변경되었습니다.');
  return html.split(/class="swiper-slide"/).slice(1).flatMap(block => {
    const name = block.match(/class="best_tit">([\s\S]*?)<\/p>/)?.[1];
    const image = block.match(/<img[^>]+src="([^"]+)"/)?.[1];
    if (!name || !image || !isFoodProduct(name)) return [];
    return [row('빽다방', 'paik', name, image, 'https://paikdabang.com/menu/menu_new/',
      block.match(/class="txt">([\s\S]*?)<\/p>/)?.[1] || '')];
  });
}

export async function crawlPaikNew() {
  return parsePaikProducts(await fetchText('https://paikdabang.com/menu/menu_new/'));
}
