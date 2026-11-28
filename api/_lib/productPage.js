import { documentPage, esc, guides, ORIGIN } from './editorial.js';
import { replaceRoot } from './appShell.js';
const MOBILE_ORIGIN = 'https://www.sinsangpick.kr';
const ALLOWED_HOSTS = new Set(['www.sinsangpick.kr', 'pc.sinsangpick.kr']);
const MOBILE_UA = /iPhone|iPod|Android.*Mobile|Mobile.*Android|Windows Phone|BlackBerry|Opera Mini/i;

export function productShell(template, { title, pathname, body, noindex }) {
 const canonical = ORIGIN + pathname;
 // 홈의 메타와 구조화 데이터는 상품에 재사용하지 않습니다.
 let html = template
  .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
  .replace(/<link\b(?=[^>]*\brel=["'](?:canonical|alternate)["'])[^>]*>/gi, '')
  .replace(/<meta\b(?=[^>]*(?:name=["'](?:description|robots)["']|property=["']og:[^"']+["']))[^>]*>/gi, '')
  .replace(/<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<script\b(?=[^>]*src=["'][^"']*(?:adsbygoogle|googlesyndication)[^"']*["'])[^>]*>[\s\S]*?<\/script>/gi, '');
 const meta = '<title>'+esc(title)+' | 신상픽</title><meta name="description" content="'+esc(title)+'"><meta property="og:type" content="product"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(title)+'"><meta property="og:url" content="'+esc(canonical)+'"><link rel="canonical" href="'+esc(canonical)+'"><link rel="alternate" media="only screen and (max-width: 640px)" href="'+esc(MOBILE_ORIGIN+pathname)+'">'+(noindex?'<meta name="robots" content="noindex, follow">':'');
 html = html.replace('</head>', ()=>meta+'</head>');
 return replaceRoot(html, '<main id="ssr-product" class="editorial"><div class="wrap article">'+body+'</div></main>');
}
const SYSTEM_RECORD_ID = '__sinsangpick_system_banners__';
export const safeUrl = value => { try { const u=new URL(String(value)); return /^https?:$/.test(u.protocol)&&!u.username&&!u.password?u.href:''; } catch { return ''; } };
export function substantiveReviews(reviews) {
 if(!Array.isArray(reviews)) return [];
 return reviews.filter(r=>r && String(r.content||'').trim().length>=120 && Number(r.rating)>=1 && Number(r.rating)<=5 && r.user_id && !['탈퇴한 회원','탈퇴회원'].includes(r.user_name));
}
// 공식 설명의 길이·수치 개수만으로는 고유 콘텐츠가 되지 않습니다.
export function hasSubstantiveContent(product, reviews) {
 const valid=substantiveReviews(reviews);
 return Boolean(product?.id) && new Set(valid.map(r=>r.user_id)).size>=2 && valid.reduce((s,r)=>s+String(r.content).trim().length,0)>=500;
}
export async function sendProductPage(req,res,{supabaseUrl,supabaseKey}) {
 const id=String(req.query?.id||'').trim();
 const pathname='/product/'+encodeURIComponent(id);
 const host=String(req.headers?.['x-forwarded-host']||req.headers?.host||'').toLowerCase();
 const origin=ALLOWED_HOSTS.has(host)?'https://'+host:MOBILE_ORIGIN;
 res.setHeader('Vary','User-Agent');
 if(host==='pc.sinsangpick.kr' && MOBILE_UA.test(String(req.headers?.['user-agent']||'')) && id){
  res.setHeader('Cache-Control','private, no-store');
  return res.redirect(302,MOBILE_ORIGIN+pathname);
 }
 let template;
 try {
  const response=await fetch(origin+'/index.html',{headers:{'x-sinsangpick-template':'1'},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('App template unavailable');
  template=await response.text();
  replaceRoot(template,''); // 잘못된 템플릿은 200으로 반환하지 않습니다.
 } catch {
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex, follow');
  return res.status(503).send(documentPage({title:'상품 정보를 불러올 수 없습니다',description:'잠시 후 다시 확인해 주세요.',pathname,noindex:true,body:'<main class="wrap"><h1>상품 정보를 불러올 수 없습니다</h1><p>잠시 후 다시 확인해 주세요.</p></main>'}));
 }
 const send=(status,title,body,noindex=true)=>{
  res.setHeader('Content-Type','text/html; charset=utf-8');
  // 휴대폰 리다이렉트가 데스크톱 HTML 캐시와 섞이지 않게 합니다.
  res.setHeader('Cache-Control','private, no-store');
  if(noindex)res.setHeader('X-Robots-Tag','noindex, follow');
  return res.status(status).send(productShell(template,{title,pathname,body,noindex}));
 };
 const missing=()=>send(404,'상품을 찾을 수 없습니다','<h1>상품을 찾을 수 없습니다</h1><p>삭제됐거나 존재하지 않는 상품 주소입니다.</p><a href="/guide">데이터 가이드 보기</a>');
 const unavailable=()=>send(503,'상품 정보를 확인할 수 없습니다','<h1>일시적으로 상품 정보를 확인할 수 없습니다</h1><p>잠시 후 다시 확인해 주세요.</p><a href="/guide">데이터 가이드 보기</a>');
 if(!id||id===SYSTEM_RECORD_ID||id.length>200)return missing();
 if(!supabaseUrl||!supabaseKey)return unavailable();
 const headers={apikey:supabaseKey,Authorization:'Bearer '+supabaseKey};
 try{
  const [pr,rr,sr]=await Promise.all([
   fetch(supabaseUrl+'/rest/v1/products?select=*&id=eq.'+encodeURIComponent(id)+'&limit=1',{headers}),
   fetch(supabaseUrl+'/rest/v1/reviews?select=id,user_id,rating,content,user_name,created_at&product_id=eq.'+encodeURIComponent(id)+'&order=created_at.desc&limit=50',{headers}),
   fetch(supabaseUrl+'/rest/v1/products?select=nutrition&id=eq.'+encodeURIComponent(SYSTEM_RECORD_ID),{headers})
  ]);
  if(!pr.ok||!sr.ok)return unavailable();
  const rows=await pr.json(), system=await sr.json();
  const deleted=system?.[0]?.nutrition?.deletedProductIds||[];
  const p=rows?.[0];
  if(!p||deleted.map(String).includes(id))return missing();
  const reviews=rr.ok?(await rr.json()).filter(r=>r?.content&&Number(r.rating)>=1&&Number(r.rating)<=5&&!['탈퇴한 회원','탈퇴회원'].includes(r.user_name)):[];
  const substantive=rr.ok&&hasSubstantiveContent(p,reviews);
  const release=/^20\d{2}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?$/.test(p.release_date||'')?p.release_date:'미확인';
  const info=[['브랜드',p.brand],['분류',p.category],['기록 가격',p.price>0?Number(p.price).toLocaleString('ko-KR')+'원':'미확인'],['등록 열량',Number(p.calories)>0?p.calories+'kcal':'미확인'],['제공량',p.volume||'미확인'],['출시일 표기',release],['원재료',p.ingredients||'미확인'],['알레르기',p.allergens||'미확인']];
  const related=guides.filter(g=>g.productIds.includes(id));
  const source=safeUrl(p.source_url), image=safeUrl(p.image);
  const body='<article><h1>'+esc(p.name)+'</h1><p>'+esc(p.brand)+' · 공개 상품 기록</p>'+(image?'<img src="'+esc(image)+'" alt="'+esc(p.name)+'" width="320" height="320" style="max-width:100%;height:auto" loading="lazy">':'')+
   '<dl>'+info.map(([k,v])=>'<dt><strong>'+esc(k)+'</strong></dt><dd>'+esc(v)+'</dd>').join('')+'</dl>'+
   (p.description?'<section><h2>수집된 상품 설명</h2><p class="meta">브랜드·판매처의 소개 자료일 수 있으며 신상픽의 시식 평가가 아닙니다.</p><p>'+esc(p.description)+'</p></section>':'')+
   '<p class="note">가격·열량·성분은 수집 기록입니다. 미확인은 0 또는 성분 없음이 아닙니다. 현재 판매가·재고·제공량·알레르기 안내는 판매처에서 다시 확인하세요.</p>'+
   (source?'<p><a href="'+esc(source)+'" rel="noopener noreferrer">공식 수집 출처 확인</a></p>':'<p>공식 수집 출처가 등록되지 않았습니다.</p>')+
   '<section><h2>등록된 이용자 리뷰 '+reviews.length+'개</h2>'+(reviews.length?'<ul>'+reviews.map(r=>'<li><p>'+esc(r.user_name||'이용자')+' · '+Number(r.rating).toFixed(1)+'점</p><p>'+esc(r.content)+'</p></li>').join('')+'</ul>':'<p>등록된 리뷰가 없습니다.</p>')+'</section>'+
   (related.length?'<section><h2>이 상품 수치로 읽는 가이드</h2><ul>'+related.map(g=>'<li><a href="/guide/'+g.slug+'">'+esc(g.title)+'</a></li>').join('')+'</ul></section>':'')+
   '<p><a href="/guide">전체 데이터 가이드</a></p></article>';
  // 재고를 검증하지 않았으므로 InStock/가짜 aggregateRating 구조화 데이터는 생성하지 않습니다.
  return send(200,p.name+' - '+p.brand+' 가격·상품 기록',body,!substantive);
 }catch(error){console.error('[product-page]',error.message);return unavailable();}
}
