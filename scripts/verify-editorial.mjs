import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { sendProductPage } from '../api/_lib/productPage.js';
import { sendSitemap } from '../api/_lib/sitemap.js';
import { guides } from '../content/guides.js';
import { factSheet } from '../content/product-facts.js';
const snapshotPath=process.argv[2];
const output=process.argv[3]||'dist';
const snapshot=snapshotPath?JSON.parse(await fs.readFile(snapshotPath,'utf8')):{products:factSheet.products.map(p=>({...p,source_url:p.sourceUrl})),deletedProductIds:[]};
const products=snapshot.products;
for(const p of factSheet.products){
 const live=products.find(x=>x.id===p.id);assert(live,p.id);
 assert.equal(p.price,live.price,p.id+' price');assert.equal(p.calories,live.calories,p.id+' calories');assert.equal(p.sourceUrl,live.source_url,p.id+' source');
}
const originalFetch=globalThis.fetch;
const originalEnv={url:process.env.VITE_SUPABASE_URL,key:process.env.VITE_SUPABASE_ANON_KEY};
process.env.VITE_SUPABASE_URL='https://snapshot.invalid';process.env.VITE_SUPABASE_ANON_KEY='read-only-fixture';
globalThis.fetch=async url=>{
 const u=new URL(url);
 if(u.pathname==='/index.html')return {ok:true,text:async()=>fs.readFile(output+'/index.html','utf8')};
 let data;
 if(u.pathname.endsWith('/reviews'))data=[];
 else if(u.searchParams.get('select')==='nutrition')data=[{nutrition:{deletedProductIds:snapshot.deletedProductIds||[]}}];
 else if(u.searchParams.get('id')?.startsWith('eq.'))data=products.filter(p=>p.id===u.searchParams.get('id').slice(3));
 else data=products;
 return {ok:true,json:async()=>data};
};
const res=()=>({code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},send(body){this.body=body;return this;},redirect(n,url){this.code=n;this.headers.Location=url;return this;}});
try{
 for(const p of products){
  const r=res();await sendProductPage({query:{id:p.id}},r,{supabaseUrl:'https://snapshot.invalid',supabaseKey:'read-only-fixture'});
  assert.equal(r.code,200,p.id+' status');
  assert.equal(r.headers['X-Robots-Tag'],'noindex, follow',p.id);
  assert(!r.body.includes('adsbygoogle.js'),p.id+' ads');
  assert(!r.body.includes('분야의 신제품이에요'),p.id);
  assert(r.body.includes('id="ssr-product"'));assert(!r.body.includes('id="web-editorial"'));assert(r.body.includes('type="module"'));assert(r.body.includes('https://pc.sinsangpick.kr/product/'));
 }
 const absent=res();await sendProductPage({query:{id:'__missing_test__'}},absent,{supabaseUrl:'https://snapshot.invalid',supabaseKey:'read-only-fixture'});assert.equal(absent.code,404);
 for(const host of ['www.sinsangpick.kr','pc.sinsangpick.kr']){
  const r=res();await sendSitemap({headers:{host}},r);
  if(host==='www.sinsangpick.kr'){assert.equal(r.code,308);assert.equal(r.headers.Location,'https://pc.sinsangpick.kr/sitemap.xml');continue;}
  assert(!r.body.includes('?tab'));assert(!r.body.includes('/product/'));assert(!r.body.includes('https://www.'));
  for(const g of guides)assert(r.body.includes('/guide/'+g.slug+'</loc>'));
 }
 const home=await fs.readFile(output+'/index.html','utf8');
 const pc=await fs.readFile(output+'/pc.html','utf8');
 for(const h of [home,pc]){assert(h.includes('id="web-editorial"'));assert(h.includes('type="module"'));assert(h.includes('id="root"'));assert(h.indexOf('id="web-editorial"')>h.indexOf('id="root"'));assert(h.includes('/guide/'));assert(!h.includes('adsbygoogle.js'));}
 for(const g of guides){const h=await fs.readFile(output+'/guide/'+g.slug+'/index.html','utf8');assert(h.includes('<table>'));assert(!h.includes('id="root"'));assert(!/src="[^"]*\/assets\//.test(h));}
 console.log(JSON.stringify({snapshotProducts:products.length,curatedFactsMatched:factSheet.products.length,productPagesNoindexWithoutReviews:products.length,missingStatus:absent.code,canonicalSitemaps:2,guides:guides.length,minimumProse:Math.min(...guides.map(g=>g.sections.reduce((n,s)=>n+s[1].length,0))),homeBodies:2}));
}finally{globalThis.fetch=originalFetch;if(originalEnv.url===undefined)delete process.env.VITE_SUPABASE_URL;else process.env.VITE_SUPABASE_URL=originalEnv.url;if(originalEnv.key===undefined)delete process.env.VITE_SUPABASE_ANON_KEY;else process.env.VITE_SUPABASE_ANON_KEY=originalEnv.key;}
