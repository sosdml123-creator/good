import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: Naver News Auto-Collector for New Product Releases
 * Endpoint: /api/collect-news
 */

const KEYWORDS = [
  "CU 신상",
  "GS25 신제품",
  "세븐일레븐 신상",
  "이마트24 신상",
  "파리바게뜨 신제품",
  "메가커피 신메뉴",
  "스타벅스 신메뉴",
  "오리온 신제품",
  "롯데 신제품",
  "농심 신제품",
  "CJ 신제품",
  "오뚜기 신제품"
];

const ALLOWED_CATEGORIES = [
  '간편식',
  '음료',
  '빵·디저트',
  '과자',
  '아이스크림',
  '신선식품',
  '밀키트',
  '외식/식당'
];

const ALLOWED_ITEM_TYPES = ['packaged', 'fresh', 'restaurant'];

/**
 * Extract og:image from news article link
 */
async function extractOgImage(url) {
  if (!url) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const html = await response.text();
    const match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                  html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (match && match[1]) {
      let img = match[1].trim();
      if (img.startsWith('//')) img = 'https:' + img;
      return img;
    }
  } catch (e) {
    // Ignore fetch error
  }
  return null;
}

/**
 * Send article title and summary to Claude API for structured extraction
 */
async function extractProductWithClaude(title, description, apiKey) {
  if (!apiKey) return null;

  const cleanTitle = title.replace(/<[^>]+>/g, '').trim();
  const cleanDesc = description.replace(/<[^>]+>/g, '').trim();

  const prompt = `다음 신문 기사 제목과 요약을 분석하여 한국 식품/음료/외식 신제품(신상) 또는 신메뉴 출시 소식인지 판단하고 그 정보만 JSON으로 추출해 주세요.

[기사 제목]: ${cleanTitle}
[기사 요약]: ${cleanDesc}

응답 규칙:
1. 오직 유효한 JSON 객체만 반환하세요 (마크다운 백틱 \`\`\`json 도 넣지 마세요).
2. 신제품/신메뉴 출시 기사가 아니거나 (예: 기업 실적, 경영, 주가 등), 유효한 상품명이 없으면 "isNewProduct": false 로 반환하세요.
3. category는 다음 중 1개만 선택: ['간편식', '음료', '빵·디저트', '과자', '아이스크림', '신선식품', '밀키트', '외식/식당']
4. item_type은 다음 중 1개만 선택: ['packaged', 'fresh', 'restaurant']
5. stores는 판매하는 브랜드/편의점 명칭의 문자열 배열로 추출하세요 (예: ["CU"], ["GS25"], ["스타벅스"]).

JSON 반환 구조:
{
  "isNewProduct": true 또는 false,
  "name": "상품명만 간결하게",
  "brand": "제조사/브랜드명",
  "category": "카테고리명",
  "sub_category": "세부카테고리(예: 라면/면류, 도시락/밥류, 커피, 유제품, 스낵 등)",
  "item_type": "packaged 또는 fresh 또는 restaurant",
  "price": 가격숫자(알수없으면 0),
  "release_date": "YYYY-MM-DD",
  "stores": ["판매처 배열"]
}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      console.warn('[Claude API Warning]', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const rawText = data.content?.[0]?.text || '';
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.warn('[Claude Parsing Error]', err.message);
  }
  return null;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Cron-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Validate CRON_SECRET header (Vercel cron validation)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers['authorization'] || req.headers['x-cron-secret'];
    const expectedHeader = `Bearer ${cronSecret}`;
    if (authHeader !== expectedHeader && authHeader !== cronSecret) {
      console.warn('[Collect News] Unauthorized request: CRON_SECRET mismatch.');
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid CRON_SECRET' });
    }
  }

  // Environment credentials
  const naverClientId = process.env.NAVER_CLIENT_ID || process.env.VITE_NAVER_CLIENT_ID;
  const naverClientSecret = process.env.NAVER_CLIENT_SECRET || process.env.VITE_NAVER_CLIENT_SECRET;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!naverClientId || !naverClientSecret) {
    return res.status(500).json({ success: false, error: 'NAVER_CLIENT_ID / NAVER_CLIENT_SECRET not configured in environment variables.' });
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return res.status(500).json({ success: false, error: 'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured in environment variables.' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  let totalFetchedCount = 0;
  let skippedOlder24hCount = 0;
  let skippedDuplicateUrlCount = 0;
  let skippedDuplicateProductCount = 0;
  let insertedCount = 0;
  const insertedItems = [];

  try {
    console.log(`[Collect News] Starting Naver News collection across ${KEYWORDS.length} keywords...`);

    // Fetch existing pending_products and products to prevent duplicates
    const { data: existingPending } = await supabase
      .from('pending_products')
      .select('name, brand, source_url');

    const { data: existingProducts } = await supabase
      .from('products')
      .select('name, brand');

    const existingUrls = new Set();
    const existingNameBrand = new Set();

    if (existingPending) {
      existingPending.forEach(item => {
        if (item.source_url) existingUrls.add(item.source_url.trim().toLowerCase());
        if (item.name && item.brand) {
          existingNameBrand.add(`${item.brand.trim().toLowerCase()}_${item.name.trim().toLowerCase()}`);
        }
      });
    }

    if (existingProducts) {
      existingProducts.forEach(item => {
        if (item.name && item.brand) {
          existingNameBrand.add(`${item.brand.trim().toLowerCase()}_${item.name.trim().toLowerCase()}`);
        }
      });
    }

    const nowMs = Date.now();
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;

    for (const keyword of KEYWORDS) {
      const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(keyword)}&display=10&sort=date`;
      
      let newsRes;
      try {
        newsRes = await fetch(apiUrl, {
          headers: {
            'X-Naver-Client-Id': naverClientId,
            'X-Naver-Client-Secret': naverClientSecret
          }
        });
      } catch (e) {
        console.warn(`[Naver News Fetch Failed] Keyword: ${keyword}`, e.message);
        continue;
      }

      if (!newsRes.ok) {
        console.warn(`[Naver News HTTP Error] Keyword: ${keyword} Status: ${newsRes.status}`);
        continue;
      }

      const newsData = await newsRes.json();
      const articles = newsData.items || [];
      totalFetchedCount += articles.length;

      for (const article of articles) {
        const link = (article.originallink || article.link || '').trim();
        const pubDateStr = article.pubDate;

        // 1. Check 24 hours window
        if (pubDateStr) {
          const articleTime = new Date(pubDateStr).getTime();
          if (isNaN(articleTime) || (nowMs - articleTime > twentyFourHoursMs)) {
            skippedOlder24hCount++;
            continue;
          }
        }

        // 2. Check source_url uniqueness
        if (!link || existingUrls.has(link.toLowerCase())) {
          skippedDuplicateUrlCount++;
          continue;
        }

        // 3. Extract product metadata via Claude API
        const parsed = await extractProductWithClaude(article.title, article.description, anthropicApiKey);

        if (parsed && parsed.isNewProduct && parsed.name && parsed.brand) {
          const normKey = `${parsed.brand.trim().toLowerCase()}_${parsed.name.trim().toLowerCase()}`;

          // Check duplicate name + brand
          if (existingNameBrand.has(normKey)) {
            skippedDuplicateProductCount++;
            continue;
          }

          // Extract og:image from article link
          const ogImg = await extractOgImage(link);
          const finalImg = ogImg || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600';

          const pendingItem = {
            id: `pending-news-${Date.now()}-${insertedCount}`,
            name: parsed.name.trim(),
            brand: parsed.brand.trim(),
            category: ALLOWED_CATEGORIES.includes(parsed.category) ? parsed.category : '간편식',
            sub_category: parsed.sub_category || null,
            item_type: ALLOWED_ITEM_TYPES.includes(parsed.item_type) ? parsed.item_type : 'packaged',
            image: finalImg,
            release_date: parsed.release_date || new Date().toISOString().split('T')[0],
            price: parseInt(parsed.price, 10) || 0,
            stores: Array.isArray(parsed.stores) && parsed.stores.length > 0 ? parsed.stores : [parsed.brand.trim()],
            description: article.description ? article.description.replace(/<[^>]+>/g, '').trim() : '',
            source_name: '네이버뉴스',
            source_url: link,
            crawled_at: new Date().toISOString(),
            status: 'pending'
          };

          const { error } = await supabase.from('pending_products').insert(pendingItem);

          if (!error) {
            insertedCount++;
            existingUrls.add(link.toLowerCase());
            existingNameBrand.add(normKey);
            insertedItems.push(pendingItem);
          } else {
            console.warn('[Supabase Insert Error]', error.message);
          }
        }
      }
    }

    console.log(`[Collect News Complete] Fetched: ${totalFetchedCount}, Skipped (Older 24h): ${skippedOlder24hCount}, Skipped (URL Duplicate): ${skippedDuplicateUrlCount}, Skipped (Product Duplicate): ${skippedDuplicateProductCount}, Inserted: ${insertedCount}`);

    return res.status(200).json({
      success: true,
      totalFetched: totalFetchedCount,
      skipped: {
        olderThan24h: skippedOlder24hCount,
        duplicateUrl: skippedDuplicateUrlCount,
        duplicateProduct: skippedDuplicateProductCount
      },
      insertedCount,
      insertedItems
    });

  } catch (error) {
    console.error('[Collect News Handler Error]', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
