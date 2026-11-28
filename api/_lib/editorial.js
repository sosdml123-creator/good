import { guideSummaries, serviceIntro } from '../../src/data/guideSummaries.js';
import { guides } from '../../content/guides.js';
import { factSheet } from '../../content/product-facts.js';
export { guides };
export const ORIGIN = 'https://pc.sinsangpick.kr';
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const won = n => Math.round(n).toLocaleString('ko-KR') + '원';
export const editorialCss = [
'.editorial{font-family:system-ui,-apple-system,"Malgun Gothic",sans-serif;color:#20242c;background:#fff;line-height:1.85;word-break:keep-all;overflow-wrap:anywhere;user-select:text;font-size:16px;text-align:left}',
'.editorial *{box-sizing:border-box}.editorial a{color:#5932a8;text-decoration:underline;text-underline-offset:4px}.editorial a:focus-visible{outline:3px solid #855be8;outline-offset:4px}',
'.editorial .wrap{max-width:1080px;margin:auto;padding:24px}.editorial header{border-bottom:1px solid #e5e1ec}.editorial header .wrap{display:flex;gap:24px;align-items:center;flex-wrap:wrap}.editorial .logo{font-size:24px;font-weight:800;text-decoration:none;color:#241638}',
'.editorial nav{display:flex;gap:12px 24px;flex-wrap:wrap}.editorial h1{font-size:clamp(27px,4vw,40px);font-weight:800;line-height:1.35;margin:24px 0}.editorial h2{font-size:24px;font-weight:750;line-height:1.5;margin:32px 0 14px}.editorial h3{font-size:19px;font-weight:700;margin:0 0 10px}.editorial p{margin:14px 0}.editorial ul{list-style:disc;padding-left:24px}.editorial li{margin:8px 0}',
'.editorial .meta{color:#665e70;font-size:14px}.editorial .lede{font-size:19px;color:#554964;max-width:850px}.editorial .cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin:24px 0}.editorial .card{border:1px solid #ddd5e7;border-radius:12px;padding:22px;background:#faf8fd}.editorial .card p{font-size:15px;margin-bottom:0}',
'.editorial .article{max-width:820px}.editorial .article p{line-height:2.05;margin:18px 0}.editorial .note{border-left:4px solid #8460b4;padding:14px 18px;background:#f5f1fb}.editorial .table-scroll{overflow-x:auto;max-width:100%;margin:20px 0;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}.editorial .table-scroll:focus-visible{outline:3px solid #855be8;outline-offset:3px}.editorial table{width:100%;border-collapse:collapse;font-size:14px;min-width:640px}.editorial caption{text-align:left;font-weight:700;padding:10px 0}.editorial th,.editorial td{border-bottom:1px solid #ddd;padding:12px;text-align:left;vertical-align:top}.editorial th{background:#f1ecf7;font-weight:700}.editorial footer{border-top:1px solid #e5e1ec;margin-top:40px;font-size:14px}.editorial .pill{display:inline-block;padding:8px 16px;margin:4px;border:1px solid #d4c7e5;border-radius:24px}.editorial details{border:1px solid #ddd5e7;border-radius:10px;padding:16px;margin:20px 0}.editorial summary{cursor:pointer;font-weight:700}',
'@media(max-width:700px){.editorial .cards{grid-template-columns:1fr}.editorial .wrap{padding:18px}.editorial header .wrap{gap:12px}.editorial .lede{font-size:17px}.editorial h2{font-size:21px}.editorial nav{gap:10px 16px}}',
'html.native-app #web-editorial,html.toss-app #web-editorial,html.app-route #web-editorial{display:none!important}'
].join('\n');
export const header = () => '<header><div class="wrap"><a class="logo" href="/">신상픽</a><nav aria-label="주 메뉴"><a href="/guide">데이터 가이드</a><a href="/?tab=category">상품 탐색</a><a href="/about">소개</a><a href="/editorial-policy">편집 원칙</a></nav></div></header>';
export const footer = () => '<footer><div class="wrap"><nav aria-label="정책 및 문의"><a href="/about">소개</a><a href="/editorial-policy">편집·데이터 수집 원칙</a><a href="/contact">문의</a><a href="/privacy.html">개인정보처리방침</a><a href="/terms.html">이용약관</a></nav><p>플레이팅 (신상픽) · 대표 양승현 · 사업자등록번호 618-09-34774<br>서울특별시 양천구 목동중앙남로3가길 108, B02호(목동)<br><a href="mailto:contact@sinsangpick.com">contact@sinsangpick.com</a></p><p>공개 자료의 기록과 계산을 제공합니다. 실시간 판매가·재고·시식 평가를 보증하지 않습니다.</p></div></footer>';
export function documentPage({title,description,pathname,body,noindex=false,ads=false}) {
 return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+esc(title)+' | 신상픽</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+ORIGIN+esc(pathname)+'"><meta property="og:type" content="article"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(description)+'"><meta property="og:url" content="'+ORIGIN+esc(pathname)+'"><meta name="google-adsense-account" content="ca-pub-3878859120989916">'+(noindex?'<meta name="robots" content="noindex, follow">':'')+'<style>'+editorialCss+'</style>'+(ads&&!noindex?'<script async crossorigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3878859120989916"></script>':'')+'</head><body class="editorial">'+header()+body+footer()+'</body></html>';
}
export const guideCards = (items=guides) => '<div class="cards">'+items.map(g=>'<article class="card"><h3><a href="/guide/'+g.slug+'">'+esc(g.title)+'</a></h3><p>'+esc(g.summary)+'</p><p class="meta">자료 기준 '+g.updated+' · 가격·열량 직접 계산</p></article>').join('')+'</div>';
const productsFor = g => g.productIds.map(id=>factSheet.products.find(p=>p.id===id));
export function comparisonTable(g) {
 const products=productsFor(g);
 const pairs=g.mode==='pairs'||g.mode==='sizes';
 const budget = ['burger-budget-ladder', 'bakery-cart-budget'].includes(g.slug);
 const extras = g.mode==='pieces' ? ['판매 조각 수','조각당 가격'] : pairs ? ['앞 행 대비 가격 차이','앞 행 대비 열량 차이'] : budget ? ['1만 원에서 남는 금액'] : g.slug==='data-coverage-and-release-dates' ? ['등록일 (출시일 아님)'] : g.slug==='allergen-data-gaps' ? ['알레르기 안전성 판단'] : [];
 const rows=products.map((p,i)=>{
  const count=Number(p.name.match(/(\d+)조각/)?.[1]);
  const prev=products[i-1];
  const extra=g.mode==='pieces' ? [count||'미확인',count?won(p.price/count):'계산 제외'] : pairs ? (i%2===1?[won(p.price-prev.price),(p.calories-prev.calories)+'kcal']:['기준 행','기준 행']) : budget ? [p.price<=10000?won(10000-p.price):'상한 초과'] : g.slug==='data-coverage-and-release-dates' ? [p.registeredAt.slice(0,10)] : g.slug==='allergen-data-gaps' ? ['이 수치로 판단 불가'] : [];
  return '<tr><th scope="row"><a href="/product/'+encodeURIComponent(p.id)+'">'+esc(p.name)+'</a></th><td>'+won(p.price)+'</td><td>'+p.calories+'kcal</td><td>'+won(p.price/p.calories*100)+'</td>'+extra.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>';
 }).join('');
 return '<div class="table-scroll" tabindex="0" role="region" aria-label="비교표, 작은 화면에서는 가로로 스크롤"><table><caption>'+esc(g.title)+' — 공개 기록과 직접 계산</caption><thead><tr>'+['상품 / 관련 상세','기록 가격','기록 열량','100kcal당 가격',...extras].map(h=>'<th scope="col">'+h+'</th>').join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div><p class="meta">계산: 가격 ÷ 열량 × 100, 원 단위 반올림. 차이 열은 앞 행 대비 값입니다. 제공 단위와 해석 범위는 글 끝에서 확인하세요.</p>';
}
export function renderGuide(g) {
 const sources=productsFor(g).map(p=>'<li>'+esc(p.name)+': <a href="'+esc(p.sourceUrl)+'" rel="noopener noreferrer">브랜드 공식 수집 출처</a> · <a href="/product/'+encodeURIComponent(p.id)+'">관련 상품 기록</a></li>').join('');
 const sections=g.sections.map(([h,p],i)=>'<section><h2>'+esc(h)+'</h2><p>'+esc(p)+'</p></section>'+(i===0?comparisonTable(g):'')).join('');
 const body='<main class="wrap article"><nav aria-label="현재 위치"><a href="/guide">가이드 목록</a> / 데이터 분석</nav><article><h1>'+esc(g.title)+'</h1><p class="lede">'+esc(g.summary)+'</p><p class="meta">신상픽 편집 콘텐츠 · 자료 기준일 '+g.updated+' · 공개 데이터 분석 · 시식 후기 아님</p>'+sections+'<section class="note"><h2>자료 기준·출처·정정</h2><p>자료 기준일은 2026-11-27입니다. 기준일의 상품 기록으로 가격·열량을 비교했습니다. 아래 공식 수집 출처에서 현재 가격과 제공량·판매 여부를 확인해 주세요. 매장·배달·개인 옵션에 따라 실제 주문 조건이 달라질 수 있습니다.</p><ul>'+sources+'</ul><p><a href="/editorial-policy">편집 및 수집 원칙</a> · <a href="/contact">오류 제보</a></p></section></article><h2>다른 관점으로 더 읽기</h2>'+guideCards(guides.filter(x=>x.slug!==g.slug).slice(0,3))+'</main>';
 return documentPage({title:g.title,description:g.summary,pathname:'/guide/'+g.slug,body,ads:true});
}
export function renderGuideList(){return documentPage({title:'가격·열량을 읽는 데이터 가이드',description:'실제 공개 기록으로 계산한 15편의 식음료 선택 가이드. 예산, 단품, 제공량과 데이터의 한계를 함께 살펴봅니다.',pathname:'/guide',body:'<main class="wrap"><h1>먹거리 선택에 필요한 숫자와 질문</h1><p class="lede">가격·열량·판매 단위를 직접 계산하고, 그 숫자가 말해 주지 않는 것도 함께 적습니다. 시식 평가나 전체 시장 순위가 아닌 공개 기록 기반의 편집 분석입니다.</p><p>2026년 11월 27일 기록을 바탕으로 작성한 15편입니다. 브랜드별 자료 편차가 있어 확인 가능한 표본만 사용했습니다. 제공량이 불명확한 수치, 없는 영양정보, 검증하지 못한 출시일은 비교와 순위에서 제외합니다. 각 글에서 데이터 기준과 공식 수집 출처를 확인하세요.</p>'+guideCards()+'</main>'});}
export function homeEditorial(){
 return '<div id="web-editorial" class="editorial"><main class="wrap"><h1>신상픽: 식음료 신제품과 리뷰</h1>'+serviceIntro.map(text=>'<p>'+esc(text)+'</p>').join('')+'<h2>가격·열량 데이터 가이드</h2>'+guideCards(guideSummaries)+'</main>'+footer()+'</div>';
}
