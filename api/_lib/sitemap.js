import { hasSubstantiveContent } from './productPage.js';
import { guides, ORIGIN } from './editorial.js';
const SYSTEM_RECORD_ID='__sinsangpick_system_banners__';
const escapeXml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
export async function sendSitemap(req,res){
 const host=String(req.headers?.['x-forwarded-host']||req.headers?.host||'').toLowerCase();
 if(host==='www.sinsangpick.kr'||host==='sinsangpick.kr')return res.redirect(308,ORIGIN+'/sitemap.xml');
 const pages=[['/','2026-11-27'],['/guide','2026-11-27'],['/about','2026-11-27'],['/editorial-policy','2026-11-27'],['/contact','2026-11-27'],...guides.map(g=>['/guide/'+g.slug,g.updated])];
 const supabaseUrl=process.env.VITE_SUPABASE_URL||process.env.SUPABASE_URL;
 const supabaseKey=process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.VITE_SUPABASE_ANON_KEY;
 if(supabaseUrl&&supabaseKey)try{
  const headers={apikey:supabaseKey,Authorization:'Bearer '+supabaseKey};
  const [pr,sr,rr]=await Promise.all([
   fetch(supabaseUrl+'/rest/v1/products?select=id,updated_at&id=neq.'+SYSTEM_RECORD_ID+'&order=created_at.desc&limit=45000',{headers}),
   fetch(supabaseUrl+'/rest/v1/products?select=nutrition&id=eq.'+SYSTEM_RECORD_ID,{headers}),
   fetch(supabaseUrl+'/rest/v1/reviews?select=product_id,id,user_id,rating,content,user_name,created_at&order=created_at.desc&limit=50000',{headers})
  ]);
  // 삭제 목록 또는 리뷰를 확인 못 하면 상품을 색인 대상으로 추측하지 않습니다.
  if(pr.ok&&sr.ok&&rr.ok){
   const deleted=new Set(((await sr.json())?.[0]?.nutrition?.deletedProductIds||[]).map(String));
   const byProduct=new Map();
   for(const r of await rr.json()){const key=String(r.product_id);const group=byProduct.get(key)||[];if(group.length<50)group.push(r);byProduct.set(key,group);}
   for(const p of await pr.json()){
    if(!p?.id||deleted.has(String(p.id))||!hasSubstantiveContent(p,byProduct.get(String(p.id))))continue;
    const date=/^\d{4}-\d{2}-\d{2}/.test(p.updated_at||'')?p.updated_at.slice(0,10):null;
    pages.push(['/product/'+encodeURIComponent(p.id),date]);
   }
  }
 }catch(error){console.error('[sitemap]',error.message);}
 const urls=pages.map(([p,d])=>'<url><loc>'+escapeXml(ORIGIN+p)+'</loc>'+(d?'<lastmod>'+d+'</lastmod>':'')+'</url>').join('\n');
 res.setHeader('Content-Type','application/xml; charset=utf-8');
 res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
 return res.status(200).send('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'\n</urlset>');
}
