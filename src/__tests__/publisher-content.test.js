import { getPopularProducts, getSearchInfluxCount, calculateReviewScore } from '../utils/ranking';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { guides, renderGuide, renderGuideList } from '../../api/_lib/editorial.js';
import { factSheet } from '../../content/product-facts.js';
import { sendProductPage, hasSubstantiveContent } from '../../api/_lib/productPage.js';
import { sendSitemap } from '../../api/_lib/sitemap.js';
const credentials={supabaseUrl:'https://test.invalid',supabaseKey:'test'};
const product={id:'real',name:'실제 데이터 표본',brand:'브랜드',price:3500,calories:250,description:'공식 소개 문구 '.repeat(50),source_url:'javascript:alert(1)'};
const reviews=[{user_id:'one',user_name:'작성자1',rating:4,content:'직접 등록한 리뷰 내용입니다. '.repeat(22)},{user_id:'two',user_name:'작성자2',rating:3,content:'다른 이용자가 등록한 내용입니다. '.repeat(22)}];
const template='<!doctype html><html><head><title>홈</title><meta name="description" content="홈"><link rel="canonical" href="https://pc.sinsangpick.kr/"><script type="application/ld+json">{"@type":"WebSite"}</script><script src="https://pagead2.googlesyndication.com/adsbygoogle.js"></script></head><body><div id="root"><div id="web-editorial"><div class="cards">HOME_ONLY</div></div></div><script type="module" src="/assets/react-app.js"></script></body></html>';
const response=()=>({headers:{},code:200,body:'',setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},send(s){this.body=s;return this;},redirect(n,url){this.code=n;this.headers.Location=url;return this;}});
function mockData({p=product,r=[],deleted=[],fail=false}={}){
 vi.stubGlobal('fetch',vi.fn(async url=>{
  if(String(url).endsWith('/index.html'))return {ok:true,text:async()=>template};
  if(fail)return {ok:false};
  const u=new URL(url);
  const data=u.pathname.endsWith('/reviews')?r:u.searchParams.get('select')==='nutrition'?[{nutrition:{deletedProductIds:deleted}}]:p?[p]:[];
  return {ok:true,json:async()=>data};
 }));
}
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
describe('publisher content boundaries',()=>{
 it('publishes 15 substantial, independently readable guides with facts and sources',()=>{
  expect(guides.length).toBeGreaterThanOrEqual(15);
  expect(new Set(guides.map(g=>g.slug)).size).toBe(guides.length);
  for(const g of guides){
   expect(g.sections.reduce((n,s)=>n+s[1].length,0)).toBeGreaterThanOrEqual(1500);
   const html=renderGuide(g);
   expect(html).toContain('<table>');
   expect(html).toContain('자료 기준일');
   expect(html).toContain('공식 수집 출처');
   expect(html).toContain('rel="canonical" href="https://pc.sinsangpick.kr/guide/'+g.slug);
   expect(html).not.toMatch(/src="[^"]*(?:main|assets\/).*\.js/);
   expect(html).not.toContain('id="root"');
   for(const id of g.productIds){
    const p=factSheet.products.find(p=>p.id===id);
    expect(p.price).toBeGreaterThan(0);
    expect(p.calories).toBeGreaterThan(0);
    expect(p.sourceUrl).toMatch(/^https:\/\//);
   }
  }
  expect(renderGuideList()).not.toContain('adsbygoogle.js');
 });
 it('does not index official descriptions, counts alone, or one repeated author',()=>{
  expect(hasSubstantiveContent(product,[])).toBe(false);
  expect(hasSubstantiveContent(product,99)).toBe(false);
  expect(hasSubstantiveContent(product,[reviews[0],reviews[0]])).toBe(false);
  expect(hasSubstantiveContent(product,reviews)).toBe(true);
 });
 it('renders a copied-description product without filler, ads, or script URLs',async()=>{
  mockData();const res=response();
  await sendProductPage({query:{id:'real'}},res,credentials);
  expect(res.code).toBe(200);
  expect(res.headers['X-Robots-Tag']).toContain('noindex');
  expect(res.body).toContain('등록된 리뷰가 없습니다');
  expect(res.body).toContain('id="ssr-product"');
  expect(res.body).toContain('/assets/react-app.js');
  expect(res.body).not.toContain('HOME_ONLY');
  expect(res.body).not.toContain('id="web-editorial"');
  expect(res.body).not.toContain('WebSite');
  expect(res.body).not.toContain('모아볼 수 있어요');
  expect(res.body).not.toContain('분야의 신제품');
  expect(res.body).not.toContain('adsbygoogle.js');
  expect(res.body).not.toContain('javascript:');
  expect(res.body).not.toContain('InStock');
 });
 it('returns real 404 for a missing or deleted product and 503 for failure',async()=>{
  for(const data of [{p:null},{deleted:['real']}]){
   mockData(data);const res=response();await sendProductPage({query:{id:'real'}},res,credentials);
   expect(res.code).toBe(404);expect(res.headers['X-Robots-Tag']).toContain('noindex');
  }
  mockData({fail:true});const res=response();await sendProductPage({query:{id:'real'}},res,credentials);
  expect(res.code).toBe(503);expect(res.body).not.toContain('adsbygoogle.js');
 });
 it('indexes only matching substantive reviews and keeps the canonical shared by hosts',async()=>{
  mockData({r:reviews});const res=response();
  await sendProductPage({query:{id:'real'},headers:{host:'pc.sinsangpick.kr'}},res,credentials);
  expect(res.headers['X-Robots-Tag']).toBeUndefined();
  expect(res.body).toContain('rel="canonical" href="https://pc.sinsangpick.kr/product/real"');
  expect(res.body).toContain('href="https://www.sinsangpick.kr/product/real"');
  expect(res.body).not.toContain('adsbygoogle.js');
 });
 it('sitemap excludes copied descriptions and tab URLs, includes guide canonicals',async()=>{
  vi.stubEnv('VITE_SUPABASE_URL',credentials.supabaseUrl);vi.stubEnv('VITE_SUPABASE_ANON_KEY','test');
  mockData();let res=response();await sendSitemap({headers:{host:'pc.sinsangpick.kr'}},res);
  expect(res.body).not.toContain('/product/real');expect(res.body).not.toContain('?tab');
  expect(res.body).not.toContain('https://www.');
  for(const g of guides)expect(res.body).toContain('/guide/'+g.slug+'</loc>');
  mockData({r:reviews.map(r=>({...r,product_id:'real'}))});res=response();await sendSitemap({},res);
  expect(res.body).toContain('/product/real</loc>');
  mockData({r:reviews.map(r=>({...r,product_id:'real'})),deleted:['real']});res=response();await sendSitemap({},res);
  expect(res.body).not.toContain('/product/real');
 });
});

describe('product app shell regression',()=>{
 it('redirects a phone on pc to the same www product',async()=>{
  mockData();const res=response();await sendProductPage({query:{id:'상품 & 한글'},headers:{host:'pc.sinsangpick.kr','user-agent':'Android Mobile'}},res,credentials);
  expect(res.code).toBe(302);expect(res.headers.Location).toBe('https://www.sinsangpick.kr/product/'+encodeURIComponent('상품 & 한글'));
  expect(fetch).not.toHaveBeenCalled();expect(res.headers['Cache-Control']).toContain('no-store');
 });
 it('returns noindex 503 if the app template cannot be loaded',async()=>{
  vi.stubGlobal('fetch',vi.fn(async()=>({ok:false})));const res=response();await sendProductPage({query:{id:'real'}},res,credentials);
  expect(res.code).toBe(503);expect(res.headers['X-Robots-Tag']).toContain('noindex');expect(res.body).not.toContain('adsbygoogle.js');
 });
 it('escapes user data in body and head, including replacement tokens',async()=>{
  mockData({p:{...product,name:'<img src=x onerror=alert(1)> $&',description:'<script>alert(1)</script>',image:'javascript:alert(1)'},r:[{...reviews[0],content:'<img onerror=alert(1)>'}]});const res=response();await sendProductPage({query:{id:'real'}},res,credentials);
  expect(res.body).not.toContain('<img src=x');expect(res.body).not.toContain('<script>alert');expect(res.body).toContain('&lt;img');expect(res.body).toContain('$&');expect(res.body).not.toContain('javascript:');
 });
 it('keeps app scripts even for deleted products and data outages',async()=>{
  for(const data of [{deleted:['real']},{fail:true}]){mockData(data);const res=response();await sendProductPage({query:{id:'real'}},res,credentials);expect(res.body).toContain('/assets/react-app.js');expect(res.body).not.toContain('HOME_ONLY');}
 });
});

describe('no invented popularity', () => {
  it('does not turn badges or stored aggregates into search counts or review ranks', () => {
    const p = { id: 'one', name: '두바이 초콜릿', brand: '표본', overallRating: 5, ratingCount: 999, repurchasePercent: 100, isHot: true, isToday: true };
    expect(getSearchInfluxCount(p)).toBe(0);
    expect(getPopularProducts([p], 10, [])).toEqual([]);
    expect(calculateReviewScore(p, []).reviewScore).toBe(0);
  });
  it('does not count a different product review when the first row matches', () => {
    const p = { id: 'one' };
    const rows = [{ productId: 'one', rating: 4, content: '사용자가 남긴 내용' }, { productId: 'two', rating: 1, content: '다른 상품의 리뷰' }];
    expect(calculateReviewScore(p, rows).postedReviewCount).toBe(1);
  });
});
