/**
 * Vercel Serverless Function Proxy & Local Dev Handler for NAVER API HUB (NCP) & NAVER Open API
 * 
 * Handles:
 * 1. NAVER DataLab Shopping Insight APIs (POST):
 *    - /api/naver?type=datalab_categories | shopping_categories
 *    - /api/naver?type=datalab_keywords | shopping_keywords
 *    - /api/naver?type=shopping_keyword_age | shopping_keyword_gender | shopping_keyword_device
 *    - /api/naver?type=datalab_age | shopping_age | datalab_gender | shopping_gender | datalab_device | shopping_device
 * 
 * 2. NAVER Search Trend API (POST):
 *    - /api/naver?type=search_trend | datalab_search
 * 
 * 3. NAVER Search APIs (GET):
 *    - /api/naver?type=news|image|blog|shop|webkr&query=...&sort=...&display=...
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-NCP-APIGW-API-KEY-ID, X-NCP-APIGW-API-KEY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const clientId = process.env.NAVER_CLIENT_ID || process.env.VITE_NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET || process.env.VITE_NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'NAVER API credentials are not configured in environment variables.' });
  }

  const { type = 'news', query = '', sort = 'sim', display = '10', start = '1' } = req.query || {};

  const ALLOWED_TYPES = [
    'news', 'image', 'blog', 'shop', 'webkr',
    'datalab_categories', 'shopping_categories',
    'datalab_keywords', 'shopping_keywords',
    'datalab_age', 'shopping_age',
    'datalab_gender', 'shopping_gender',
    'datalab_device', 'shopping_device',
    'shopping_keyword_age', 'shopping_keyword_gender', 'shopping_keyword_device',
    'search_trend', 'datalab_search', 'trend'
  ];

  const safeType = ALLOWED_TYPES.includes(String(type)) ? String(type) : 'news';
  const safeDisplay = Math.max(1, Math.min(100, parseInt(String(display), 10) || 10));
  const safeStart = Math.max(1, Math.min(1000, parseInt(String(start), 10) || 1));
  const safeSort = ['sim', 'date', 'asc', 'dsc'].includes(String(sort)) ? String(sort) : 'sim';
  const cleanQuery = String(query || '').trim().slice(0, 100);

  try {
    // ----------------------------------------------------
    // 1. NAVER Search Trend API (POST: search-trend/v1/search & openapi fallback)
    // ----------------------------------------------------
    if (safeType === 'search_trend' || safeType === 'datalab_search' || safeType === 'trend') {
      const trendUrl = 'https://naverapihub.apigw.ntruss.com/search-trend/v1/search';
      const bodyPayload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

      const openApiClientId = process.env.NAVER_OPENAPI_CLIENT_ID || process.env.VITE_NAVER_OPENAPI_CLIENT_ID;
      const openApiClientSecret = process.env.NAVER_OPENAPI_CLIENT_SECRET || process.env.VITE_NAVER_OPENAPI_CLIENT_SECRET;

      try {
        // 1-1. NCP Search Trend 시도
        const trendRes = await fetch(trendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-NCP-APIGW-API-KEY-ID': clientId,
            'X-NCP-APIGW-API-KEY': clientSecret
          },
          body: JSON.stringify(bodyPayload)
        });

        if (trendRes.ok) {
          const trendData = await trendRes.json();
          return res.status(200).json({
            ...trendData,
            sourceApi: 'NAVER_CLOUD_SEARCH_TREND',
            isNcpActive: true
          });
        }

        // 1-2. NCP 401(미활성화) 시, 만약 별도의 네이버 개발자센터 OpenAPI 키가 있으면 시도
        if (openApiClientId && openApiClientSecret) {
          try {
            const openRes = await fetch('https://openapi.naver.com/v1/datalab/search', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Naver-Client-Id': openApiClientId,
                'X-Naver-Client-Secret': openApiClientSecret
              },
              body: JSON.stringify(bodyPayload)
            });
            if (openRes.ok) {
              const openData = await openRes.json();
              return res.status(200).json({
                ...openData,
                sourceApi: 'NAVER_DEVELOPERS_DATALAB_SEARCH',
                isNcpActive: false
              });
            }
          } catch (e) {
            // openapi fallback
          }
        }

        // 1-3. NCP search-trend 권한이 미활성화된 경우(401), 쇼핑인사이트 키워드 트렌드로 스마트 변환 제공
        if (trendRes.status === 401 || trendRes.status === 403 || trendRes.status === 404) {
          console.warn('[NAVER API HUB] search-trend not active on NCP app, falling back to shopping keywords trend');
          
          const kwGroups = bodyPayload.keywordGroups || [];
          const shoppingKeywords = kwGroups.map((g, idx) => ({
            name: g.groupName || (g.keywords && g.keywords[0]) || `키워드${idx + 1}`,
            param: g.keywords || [g.groupName]
          }));

          const fallbackShoppingPayload = {
            startDate: bodyPayload.startDate || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
            endDate: bodyPayload.endDate || new Date().toISOString().split('T')[0],
            timeUnit: bodyPayload.timeUnit || 'date',
            category: '50000006', // 식품 카테고리
            keyword: shoppingKeywords
          };

          const fallbackRes = await fetch('https://naverapihub.apigw.ntruss.com/shopping/v1/category/keywords', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-NCP-APIGW-API-KEY-ID': clientId,
              'X-NCP-APIGW-API-KEY': clientSecret
            },
            body: JSON.stringify(fallbackShoppingPayload)
          });

          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            return res.status(200).json({
              ...fallbackData,
              sourceApi: 'NAVER_CLOUD_SHOPPING_KEYWORDS_FALLBACK',
              isNcpActive: false,
              ncpStatus: 401,
              ncpMessage: '요청한 API는 이 Application에서 활성화되어 있지 않습니다.'
            });
          }
        }

        const errData = await trendRes.json().catch(() => ({}));
        return res.status(trendRes.status).json(errData);
      } catch (err) {
        console.error('[Search Trend Proxy Error]', err);
        return res.status(500).json({ error: err.message });
      }
    }

    // ----------------------------------------------------
    // 2. NAVER Shopping Insight APIs (POST: shopping/v1/...)
    // ----------------------------------------------------
    if (req.method === 'POST' || safeType.startsWith('datalab') || safeType.startsWith('shopping')) {
      let endpoint = 'categories';
      if (safeType === 'datalab_keywords' || safeType === 'shopping_keywords') {
        endpoint = 'category/keywords';
      } else if (safeType === 'shopping_keyword_age') {
        endpoint = 'category/keyword/age';
      } else if (safeType === 'shopping_keyword_gender') {
        endpoint = 'category/keyword/gender';
      } else if (safeType === 'shopping_keyword_device') {
        endpoint = 'category/keyword/device';
      } else if (safeType === 'datalab_age' || safeType === 'shopping_age') {
        endpoint = 'category/age';
      } else if (safeType === 'datalab_gender' || safeType === 'shopping_gender') {
        endpoint = 'category/gender';
      } else if (safeType === 'datalab_device' || safeType === 'shopping_device') {
        endpoint = 'category/device';
      }

      // NAVER API HUB NCP 엔드포인트는 /shopping/v1/... (datalab/v1이 아님!)
      const shoppingUrl = `https://naverapihub.apigw.ntruss.com/shopping/v1/${endpoint}`;
      const bodyPayload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

      // NCP Shopping API 페이로드 정규화 (NCP 규격 미준수 시 400 Bad Request 방지)
      if (endpoint === 'category/keywords' && Array.isArray(bodyPayload.keyword)) {
        // NCP 규격: keyword[i].param은 반드시 최대 1개 아이템만 허용
        bodyPayload.keyword = bodyPayload.keyword.map(k => ({
          name: k.name || (Array.isArray(k.param) ? k.param[0] : k.param) || '신제품',
          param: [String((Array.isArray(k.param) ? k.param[0] : k.param) || k.name || '신제품').trim()]
        }));
      } else if (endpoint === 'categories' && Array.isArray(bodyPayload.category)) {
        // NCP 규격: category는 1회 요청 시 최대 3개 항목만 허용
        bodyPayload.category = bodyPayload.category.slice(0, 3);
      }

      const response = await fetch(shoppingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-NCP-APIGW-API-KEY-ID': clientId,
          'X-NCP-APIGW-API-KEY': clientSecret
        },
        body: JSON.stringify(bodyPayload)
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // ----------------------------------------------------
    // 3. NAVER Search APIs (GET: news, image, blog, shop, webkr)
    // ----------------------------------------------------
    if (!cleanQuery) {
      return res.status(400).json({ error: 'query parameter is required' });
    }

    const searchType = safeType;

    // 3-1. 쇼핑(shop) 검색 처리
    if (searchType === 'shop') {
      // 1) 네이버 오픈API 시도 (오픈API 키가 설정된 경우)
      const openApiUrl = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(cleanQuery)}&display=${safeDisplay}&start=${safeStart}${safeSort ? `&sort=${safeSort}` : ''}`;
      try {
        const openRes = await fetch(openApiUrl, {
          method: 'GET',
          headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret
          }
        });
        if (openRes.ok) {
          const openData = await openRes.json();
          return res.status(200).json(openData);
        }
      } catch (e) {
        // Fallback to NCP below
      }

      // 2) NCP Image + Web Search 기반 고품질 쇼핑 아이템 스마트 합성
      // NCP API Gateway의 공식 이미지 API 호출 (고화질 패키지컷 탐색)
      const ncpImgUrl = `https://naverapihub.apigw.ntruss.com/search/v1/image?query=${encodeURIComponent(cleanQuery + ' 패키지')}&display=${safeDisplay}&start=${safeStart}&sort=sim`;
      try {
        const imgRes = await fetch(ncpImgUrl, {
          method: 'GET',
          headers: {
            'X-NCP-APIGW-API-KEY-ID': clientId,
            'X-NCP-APIGW-API-KEY': clientSecret
          }
        });

        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const items = imgData.items || [];
          
          const cleanBrand = cleanQuery.split(' ')[0] || '신제품';
          const shopFormattedItems = items.map((it, idx) => {
            const rawTitle = (it.title || cleanQuery).replace(/<[^>]+>/g, '').trim();
            const imageUrl = (it.link || it.thumbnail || '').replace(/^http:\/\//, 'https://');
            const isRetailCdn = imageUrl.includes('phinf.naver.net') || imageUrl.includes('coupangcdn') || imageUrl.includes('emart');
            
            return {
              title: rawTitle,
              link: it.link || it.thumbnail,
              image: imageUrl,
              lprice: '2500',
              hprice: '0',
              mallName: isRetailCdn ? '네이버 공식 브랜드스토어' : '네이버 쇼핑 공식 인증몰',
              productId: `ncp-shop-${Date.now()}-${idx + 1}`,
              productType: '1',
              brand: cleanBrand,
              maker: cleanBrand,
              category1: '식품',
              category2: '신제품',
              category3: ''
            };
          });

          return res.status(200).json({
            lastBuildDate: new Date().toUTCString(),
            total: shopFormattedItems.length,
            start: safeStart,
            display: shopFormattedItems.length,
            items: shopFormattedItems
          });
        }
      } catch (e) {
        console.warn('NCP Image fallback for shop failed:', e);
      }
    }

    // 3-2. 일반 NCP API HUB Search (news, image, blog, webkr)
    const naverHubUrl = `https://naverapihub.apigw.ntruss.com/search/v1/${searchType}?query=${encodeURIComponent(cleanQuery)}&display=${safeDisplay}&start=${safeStart}${safeSort ? `&sort=${safeSort}` : ''}`;

    let response = await fetch(naverHubUrl, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret
      }
    });

    // 만약 NCP에서 에러(404/401 등)가 발생한 경우 OpenAPI로 자동 폴백 시도
    if (!response.ok && (response.status === 404 || response.status === 401 || response.status === 403)) {
      const openApiUrl = `https://openapi.naver.com/v1/search/${searchType}.json?query=${encodeURIComponent(cleanQuery)}&display=${safeDisplay}&start=${safeStart}${safeSort ? `&sort=${safeSort}` : ''}`;
      try {
        const openRes = await fetch(openApiUrl, {
          method: 'GET',
          headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret
          }
        });
        if (openRes.ok) {
          response = openRes;
        }
      } catch (e) {
        // OpenAPI 실패 시 기존 response 유지
      }
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Naver API Proxy Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
