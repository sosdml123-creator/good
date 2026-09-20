/**
 * Vercel Serverless Function Proxy for NAVER Cloud Platform (NAVER API HUB) & NAVER Open API
 * Handles:
 * 1. Search APIs: GET /api/naver?type=news|image|blog|shop&query=...&sort=...&display=...
 * 2. DataLab Shopping Insight APIs: POST /api/naver?type=datalab_categories|datalab_keywords|datalab_age|datalab_gender
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

  const { type = 'news', query = '', sort = 'sim', display = '10', start = '1' } = req.query;

  // Input Sanitization & Range Validation
  const ALLOWED_TYPES = [
    'news', 'image', 'blog', 'shop', 'webkr',
    'datalab_categories', 'datalab_keywords', 'datalab_age', 'datalab_gender', 'datalab_device',
    'shopping_keywords', 'shopping_age', 'shopping_gender', 'shopping_device'
  ];

  const safeType = ALLOWED_TYPES.includes(String(type)) ? String(type) : 'news';
  const safeDisplay = Math.max(1, Math.min(100, parseInt(String(display), 10) || 10));
  const safeStart = Math.max(1, Math.min(1000, parseInt(String(start), 10) || 1));
  const safeSort = ['sim', 'date', 'asc', 'dsc'].includes(String(sort)) ? String(sort) : 'sim';
  const cleanQuery = String(query || '').trim().slice(0, 100);

  try {
    // 1. DataLab Shopping Insight APIs (POST)
    if (req.method === 'POST' || safeType.startsWith('datalab') || safeType.startsWith('shopping')) {
      let endpoint = 'categories';
      if (safeType === 'datalab_keywords' || safeType === 'shopping_keywords') {
        endpoint = 'category/keywords';
      } else if (safeType === 'datalab_age' || safeType === 'shopping_age') {
        endpoint = 'category/age';
      } else if (safeType === 'datalab_gender' || safeType === 'shopping_gender') {
        endpoint = 'category/gender';
      } else if (safeType === 'datalab_device' || safeType === 'shopping_device') {
        endpoint = 'category/device';
      }

      const datalabUrl = `https://naverapihub.apigw.ntruss.com/datalab/v1/shopping/${endpoint}`;
      const bodyPayload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

      const response = await fetch(datalabUrl, {
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

    // 2. NAVER Search APIs (GET: news, image, blog, shop)
    if (!cleanQuery) {
      return res.status(400).json({ error: 'query parameter is required' });
    }

    // Attempt NAVER API HUB first
    const searchType = safeType === 'shop' ? 'shop' : safeType;
    const naverHubUrl = `https://naverapihub.apigw.ntruss.com/search/v1/${searchType}?query=${encodeURIComponent(cleanQuery)}&display=${safeDisplay}&start=${safeStart}${safeSort ? `&sort=${safeSort}` : ''}`;

    let response = await fetch(naverHubUrl, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret
      }
    });

    // If API Hub returned 404 or unsupported endpoint, fallback to Open API
    if (!response.ok && (response.status === 404 || response.status === 401)) {
      const openApiUrl = `https://openapi.naver.com/v1/search/${searchType}.json?query=${encodeURIComponent(cleanQuery)}&display=${safeDisplay}&start=${safeStart}${safeSort ? `&sort=${safeSort}` : ''}`;
      response = await fetch(openApiUrl, {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret
        }
      });
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Naver API Proxy Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
