import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { factSheet } from '../content/product-facts.js';
import { guides, guideDrafts, numericClaims } from '../content/guides.js';
export function verifyGuideNumbers() {
 let minimumProse=Infinity;
 for(const g of guideDrafts){
  for(const section of g.sections)for(const text of section)assert(!/\d/.test(text.replace(/\{\{[^{}]+\}\}/g,'')),g.slug+': 검증식 밖의 숫자');
  const length=guides.find(x=>x.slug===g.slug).sections.reduce((n,s)=>n+s[1].length,0);
  assert(length>=1500,g.slug+': '+length+'자');minimumProse=Math.min(minimumProse,length);
 }
 for(const claim of numericClaims){
  const g=guideDrafts.find(g=>g.slug===claim.slug),products=g.productIds.map(id=>factSheet.products.find(p=>p.id===id));
  const expression=claim.expression.replace(/p(\d+)\.(price|calories)|c\.(total|priced|calories|both)/g,(_,i,f,c)=>String(c?factSheet.coverage[c]:products[Number(i)][f]));
  assert(/^[\d.()+*/\s-]+$/.test(expression),'검증 수식 문자 제한');
  const expected=Function('"use strict";return ('+expression+')')();
  assert(Number.isFinite(expected),claim.expression);assert.equal(claim.value,expected,claim.slug+': '+claim.expression);
  assert.equal(claim.rendered,expected.toLocaleString('ko-KR',{minimumFractionDigits:claim.digits,maximumFractionDigits:claim.digits}));
 }
 return {guides:guides.length,numericClaims:numericClaims.length,minimumProse};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(verifyGuideNumbers()));
