import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { replaceRoot } from '../../api/_lib/appShell.js';
import { homeEditorial } from '../../api/_lib/editorial.js';
import { guideSummaries } from '../data/guideSummaries.js';
import { verifyGuideNumbers } from '../../scripts/check-guide-numbers.mjs';
const diskPath=p=>fileURLToPath(new URL('../../'+p,import.meta.url));
const source=p=>fs.readFileSync(diskPath(p),'utf8');
const config=JSON.parse(source('vercel.json'));
function destination(url,host='www.sinsangpick.kr'){
 const pathname=new URL(url,'https://'+host).pathname;
 const rule=config.rewrites.find(r=>(!r.has||r.has.every(h=>h.type==='host'&&h.value===host))&&new RegExp('^'+r.source.replace(/:slug|:id/g,'[^/]+')+'$').test(pathname));
 return rule?.destination;
}
describe('editorial app preservation',()=>{
 it('replaces the entire nested home root without losing app assets',()=>{
  const html='<html><body><div id="root"><div><div>home</div></div></div><script type="module" src="/assets/app.js"></script></body></html>';
  expect(replaceRoot(html,'product')).toBe('<html><body><div id="root">product</div><script type="module" src="/assets/app.js"></script></body></html>');
  expect(()=>replaceRoot('<div id="root"><div>','')).toThrow();
 });
 it('shares the summary cards and service links with the React home',()=>{
  const html=homeEditorial();for(const g of guideSummaries){expect(html).toContain(g.title.replaceAll('&','&amp;'));expect(html).toContain('/guide/'+g.slug);}
  for(const route of ['/about','/editorial-policy','/contact','/terms'])expect(html).toContain(route);
  const entry=source('src/components/home/GuideEntry.tsx');expect(entry).toContain('IS_TOSS || Capacitor.isNativePlatform()');expect(entry).toContain('guideSummaries.map');
  for(const p of ['src/components/home/HomeView.tsx','src/pc/PcHome.tsx']){const text=source(p);expect(text).toContain('<GuideEntry');expect(text.indexOf('<GuideEntry')).toBeGreaterThan(text.indexOf('return ('));}
  expect(source('src/main.tsx')).toContain('ReactDOM.createRoot');expect(source('src/data/guideSummaries.js')).not.toContain('sections');
 });
 it('hides native editorial content before React paints',()=>{
  const script=source('index.html').match(/<script>([\s\S]*?)<\/script>/)[1];
  for(const [protocol,hostname,port,hidden] of [['capacitor:','localhost','',true],['https:','localhost','',true],['https:','www.sinsangpick.kr','',false],['http:','localhost','3000',false]]){
   const classes=[];runInNewContext(script,{location:{protocol,hostname,port,pathname:'/',search:'',hash:''},window:{},document:{documentElement:{classList:{add:c=>classes.push(c)}}}});expect(classes.includes('native-app')).toBe(hidden);
  }
  expect(source('vite.config.ts')).toContain('class="toss-app"');expect(source('index.html')).toContain('html.toss-app #web-editorial');
 });
 it('keeps app tabs, auth, deep links, admin and toss paths out of 404',()=>{
  for(const path of ['/?tab=home','/?tab=admin','/?tab=write','/?tab=detail&p=id','/beauty','/admin','/apps-in-toss','/auth-callback?code=abc','/product/id','/tteok','/donki','/agri']){
   for(const host of ['www.sinsangpick.kr','pc.sinsangpick.kr'])expect(destination(path,host),path+' '+host).toBeTruthy();
  }
  expect(destination('/?tab=ranking','pc.sinsangpick.kr')).toBe('/pc.html');
  expect(destination('/auth-callback')).toBe('/auth-callback.html');
  for(const p of fs.readdirSync(diskPath('public')).filter(p=>p.endsWith('.html')))expect(destination('/'+p.slice(0,-5))).toBe('/'+p);
  expect(config.rewrites.filter(r=>r.source.startsWith('/guide/'))).toHaveLength(1);
  expect(destination('/guide/missing')).toBe('/guide/:slug/index.html');
 });
 it('recalculates every prose number from the facts',()=>{expect(verifyGuideNumbers().numericClaims).toBeGreaterThan(200);});
});
