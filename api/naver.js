/**
 * Vercel Serverless Function Proxy for NAVER Cloud Platform (NAVER API HUB)
 * Handles /api/naver?type=news|image|blog&query=...&sort=...&display=...
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-NCP-APIGW-API-KEY-ID, X-NCP-APIGW-API-KEY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type = 'news', query = '', sort = 'date', display = '10', start = '1' } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'query parameter is required' });
  }

  const clientId = process.env.NAVER_CLIENT_ID || process.env.VITE_NAVER_CLIENT_ID || 'ha89ylxb53';
  const clientSecret = process.env.NAVER_CLIENT_SECRET || process.env.VITE_NAVER_CLIENT_SECRET || '4hm7znMnOmGyvtw2xnvEjTWoRG1UZeLqlccI7b4p';

  try {
    const naverUrl = `https://naverapihub.apigw.ntruss.com/search/v1/${type}?query=${encodeURIComponent(String(query))}&display=${display}&start=${start}${sort ? `&sort=${sort}` : ''}`;

    const response = await fetch(naverUrl, {
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
