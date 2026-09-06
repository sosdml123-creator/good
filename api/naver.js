/**
 * Vercel Serverless Function Proxy for NAVER Cloud Platform (NAVER API HUB)
 * Handles:
 * 1. Search APIs: GET /api/naver?type=news|image|blog&query=...&sort=...&display=...
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

  const clientId = process.env.NAVER_CLIENT_ID || process.env.VITE_NAVER_CLIENT_ID || 'ha89ylxb53';
  const clientSecret = process.env.NAVER_CLIENT_SECRET || process.env.VITE_NAVER_CLIENT_SECRET || '4hm7znMnOmGyvtw2xnvEjTWoRG1UZeLqlccI7b4p';

  const { type = 'news', query = '', sort = 'date', display = '10', start = '1' } = req.query;

  try {
    // 1. DataLab Shopping Insight APIs (POST)
    if (req.method === 'POST' || type.startsWith('datalab') || type.startsWith('shopping')) {
      let endpoint = 'categories';
      if (type === 'datalab_keywords' || type === 'shopping_keywords') {
        endpoint = 'category/keywords';
      } else if (type === 'datalab_age' || type === 'shopping_age') {
        endpoint = 'category/age';
      } else if (type === 'datalab_gender' || type === 'shopping_gender') {
        endpoint = 'category/gender';
      } else if (type === 'datalab_device' || type === 'shopping_device') {
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

    // 2. NAVER Search APIs (GET: news, image, blog)
    if (!query) {
      return res.status(400).json({ error: 'query parameter is required' });
    }

    const naverUrl = `https://naverapihub.apigw.ntruss.com/search/v1/${type}?query=${encodeURIComponent(String(query))}&display=${display}&start=${start}${sort ? `&sort=${sort}` : ''}`;

    const response = await fetch(naverUrl, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Naver API Proxy Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
