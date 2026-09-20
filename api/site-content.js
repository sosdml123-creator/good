/**
 * Vercel Serverless Function for Synchronizing Banners, Products, and Home Sections
 * Endpoint: /api/site-content
 * 
 * Supports both GET (fetching latest remote content) and POST (updating content from admin)
 * Allows web browsers and native apps (iOS / Android Capacitor) to share identical state in real-time.
 */

export default async function handler(req, res) {
  // Enable CORS for web and Capacitor native apps (capacitor://localhost, ionic://localhost, etc.)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const adminSecret = process.env.ADMIN_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  const SYSTEM_RECORD_ID = '__sinsangpick_system_banners__';

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Database credentials not configured in environment.' });
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
  };

  // GET: Fetch latest remote banners, homeSections, and custom products
  if (req.method === 'GET') {
    try {
      // 1. Fetch system banners and settings record
      const sysRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${SYSTEM_RECORD_ID}&select=*`, {
        headers
      });

      let systemData = null;
      if (sysRes.ok) {
        const rows = await sysRes.json();
        if (rows && rows.length > 0) {
          systemData = rows[0];
        }
      }

      const banners = systemData?.nutrition?.banners || null;
      const homeSections = systemData?.nutrition?.homeSections || null;
      const deletedProductIds = systemData?.nutrition?.deletedProductIds || null;
      const deletedBannerIds = systemData?.nutrition?.deletedBannerIds || null;
      const lastUpdated = systemData?.updated_at || null;

      // 2. Fetch active products from Supabase
      const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?id=neq.${SYSTEM_RECORD_ID}&select=*&order=created_at.desc`, {
        headers
      });

      let products = [];
      if (prodRes.ok) {
        products = await prodRes.json();
      }

      return res.status(200).json({
        success: true,
        banners,
        homeSections,
        deletedProductIds,
        deletedBannerIds,
        products,
        lastUpdated,
        serverTime: new Date().toISOString()
      });
    } catch (err) {
      console.error('[site-content GET error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST: Update banners, homeSections, handle deletions, or sync data from Admin
  if (req.method === 'POST') {
    // Admin / Service Authentication Check
    const authHeader = req.headers['authorization'] || '';
    const xAdminKey = req.headers['x-admin-key'] || req.headers['apikey'] || '';
    const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
    const providedSecret = tokenFromHeader || xAdminKey;

    if (adminSecret && (!providedSecret || (providedSecret !== adminSecret && providedSecret !== process.env.VITE_SUPABASE_ANON_KEY))) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Admin authorization required.' });
    }

    try {
      const { action, id, ids, banners, homeSections, deletedProductIds, deletedBannerIds, products } = req.body || {};

      // 0-A. Handle Direct Product Deletion via Serverless Service Role
      if (action === 'delete_products' || action === 'delete_product') {
        const targetIds = ids || (id ? [id] : []);
        if (targetIds.length > 0) {
          const inQuery = targetIds.map(t => `"${t}"`).join(',');
          const delRes = await fetch(`${supabaseUrl}/rest/v1/products?id=in.(${inQuery})`, {
            method: 'DELETE',
            headers
          });
          if (!delRes.ok) {
            const errTxt = await delRes.text();
            console.warn('[site-content DELETE products warning]', errTxt);
          }
        }
      }

      // 0-B. Handle Direct Review Deletion via Serverless Service Role
      if (action === 'delete_review' && (id || ids)) {
        const targetIds = ids || (id ? [id] : []);
        const inQuery = targetIds.map(t => `"${t}"`).join(',');
        await fetch(`${supabaseUrl}/rest/v1/reviews?id=in.(${inQuery})`, {
          method: 'DELETE',
          headers
        });
      }

      // 0-C. Handle Direct Community Post Deletion via Serverless Service Role
      if (action === 'delete_post' && (id || ids)) {
        const targetIds = ids || (id ? [id] : []);
        const inQuery = targetIds.map(t => `"${t}"`).join(',');
        await fetch(`${supabaseUrl}/rest/v1/community_posts?id=in.(${inQuery})`, {
          method: 'DELETE',
          headers
        });
      }

      // 1. Save banners, homeSections, and deleted IDs in system record inside products table
      if (banners !== undefined || homeSections !== undefined || deletedProductIds !== undefined || deletedBannerIds !== undefined) {
        // Fetch existing record first to merge safely
        let existingNutrition = {};
        try {
          const curRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${SYSTEM_RECORD_ID}&select=nutrition`, { headers });
          if (curRes.ok) {
            const curRows = await curRes.json();
            if (curRows && curRows.length > 0 && curRows[0].nutrition) {
              existingNutrition = curRows[0].nutrition;
            }
          }
        } catch {
          // ignore
        }

        const mergedDeletedProductIds = Array.from(new Set([
          ...(existingNutrition.deletedProductIds || []),
          ...(deletedProductIds || [])
        ]));

        const mergedDeletedBannerIds = Array.from(new Set([
          ...(existingNutrition.deletedBannerIds || []),
          ...(deletedBannerIds || [])
        ]));

        const payload = {
          id: SYSTEM_RECORD_ID,
          name: 'SYSTEM_SETTINGS_CONTAINER',
          brand: '신상픽_시스템',
          category: '시스템',
          price: 0,
          image: '',
          description: '신상픽 배너 및 홈 섹션 글로벌 동기화 컨테이너',
          is_today: false,
          is_hot: false,
          nutrition: {
            ...existingNutrition,
            banners: banners !== undefined ? banners : existingNutrition.banners,
            homeSections: homeSections !== undefined ? homeSections : existingNutrition.homeSections,
            deletedProductIds: mergedDeletedProductIds,
            deletedBannerIds: mergedDeletedBannerIds,
            updatedAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        };

        const upsertRes = await fetch(`${supabaseUrl}/rest/v1/products?on_conflict=id`, {
          method: 'POST',
          headers: {
            ...headers,
            Prefer: 'resolution=merge-duplicates,return=representation',
          },
          body: JSON.stringify(payload)
        });

        if (!upsertRes.ok) {
          const errMsg = await upsertRes.text();
          console.warn('[site-content system record upsert warning]', errMsg);
        }
      }

      // 2. If single product or products array provided, upsert to products table
      if (products && Array.isArray(products) && products.length > 0) {
        const formattedProducts = products.map(p => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          sub_category: p.subCategory || p.sub_category,
          item_type: p.itemType || p.item_type || 'packaged',
          image: p.image,
          release_date: p.releaseDate || p.release_date,
          price: p.price || 0,
          discount_rate: p.discountRate || p.discount_rate || 0,
          overall_rating: p.overallRating || p.overall_rating || 5.0,
          rating_count: p.ratingCount || p.rating_count || 1,
          description: p.description || '',
          stores: p.stores || [],
          calories: p.calories,
          volume: p.volume,
          is_today: p.isToday ?? p.is_today ?? false,
          is_hot: p.isHot ?? p.is_hot ?? false,
          updated_at: new Date().toISOString()
        }));

        await fetch(`${supabaseUrl}/rest/v1/products?on_conflict=id`, {
          method: 'POST',
          headers: {
            ...headers,
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify(formattedProducts)
        });
      }

      return res.status(200).json({
        success: true,
        message: '클라우드 동기화 및 삭제 처리가 성공적으로 완료되었습니다.',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[site-content POST error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
}
