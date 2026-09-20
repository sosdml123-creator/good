/**
 * Vercel Serverless Function Proxy for 식품의약품안전처_식품영양성분DB정보
 * Endpoint: https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02
 */
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.FOOD_NUTRITION_API_KEY || 
                 process.env.VITE_FOOD_NUTRITION_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Food Nutrition API key is not configured in environment variables.' });
  }

  const {
    query = '',
    foodName = '',
    name = '',
    pageNo = '1',
    numOfRows = '20'
  } = req.query;

  const rawQuery = query || foodName || name;
  const searchQuery = String(rawQuery || '').trim().slice(0, 100);

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query parameter (query, foodName, or name) is required' });
  }

  const safePageNo = Math.max(1, parseInt(String(pageNo), 10) || 1);
  const safeNumOfRows = Math.max(1, Math.min(100, parseInt(String(numOfRows), 10) || 20));

  try {
    const targetUrl = `https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02?serviceKey=${apiKey}&type=json&FOOD_NM_KR=${encodeURIComponent(searchQuery)}&pageNo=${safePageNo}&numOfRows=${safeNumOfRows}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Public data API returned status ${response.status}`
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Nutrition API Proxy Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error while querying Nutrition API'
    });
  }
}
