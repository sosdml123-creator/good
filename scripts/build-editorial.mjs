import { verifyGuideNumbers } from './check-guide-numbers.mjs';
import { replaceRoot } from '../api/_lib/appShell.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { guides, renderGuide, renderGuideList, documentPage, homeEditorial, editorialCss } from '../api/_lib/editorial.js';
verifyGuideNumbers();
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.resolve(root,process.argv[2]||'dist');
if(!output.startsWith(root+path.sep))throw Error('출력 경로는 작업 폴더 안이어야 합니다.');
const put=async(p,s)=>{const f=path.join(output,p);await fs.mkdir(path.dirname(f),{recursive:true});await fs.writeFile(f,s);};
for(const g of guides){
 if(g.sections.reduce((n,s)=>n+s[1].length,0)<1500)throw new Error('본문 1500자 미달: '+g.slug);
 await put('guide/'+g.slug+'/index.html',renderGuide(g));
}
await put('guide/index.html',renderGuideList());
const infoPages={
 about:{title:'신상픽 소개',description:'신상픽의 운영 정보와 콘텐츠 제공 범위',body:'<h1>신상픽 소개</h1><p>신상픽은 식음료 상품 정보를 모아 살펴보고 공개 수치를 비교하는 서비스입니다. 가이드에서는 가격·열량·판매 단위를 직접 계산하고 그 계산이 답하지 못하는 질문도 함께 적습니다. 상품 데이터, 이용자가 등록한 리뷰, 편집 분석을 구분합니다.</p><h2>운영자</h2><p>상호: 플레이팅 · 대표자: 양승현<br>사업자등록번호: 618-09-34774<br>사업장: 서울특별시 양천구 목동중앙남로3가길 108, B02호(목동)<br>문의: <a href="mailto:contact@sinsangpick.com">contact@sinsangpick.com</a></p><h2>무엇을 확인할 수 있나요</h2><p>상품 탐색 화면은 수집된 상품·가격·브랜드 정보를 제공합니다. 가이드의 숫자는 기준일의 공개 기록을 선별해 계산한 것이며 실시간 판매가·재고·출시일을 보증하지 않습니다. 이용자가 남긴 경험은 리뷰에서, 공개 수치를 비교한 내용은 가이드에서 확인할 수 있습니다.</p><h2>제한과 정정</h2><p>브랜드별 자료의 양과 품질에 차이가 있습니다. 제공량이 불명확한 수치는 비교에서 제외하고, 미확인 값은 없음이나 0으로 바꾸지 않습니다. 공식 소개글은 독립적인 리뷰로 간주하지 않습니다. 상품이 판매 종료되거나 가격이 바뀔 수 있으니 구매 전 판매처에서 확인하세요.</p><p><a href="/guide">가이드 전체 보기</a> · <a href="/editorial-policy">편집·수집 원칙</a> · <a href="/contact">정정 및 문의</a></p>'},
 'editorial-policy':{title:'편집·데이터 수집 원칙',description:'출처, 계산, 고유 콘텐츠, 리뷰와 광고를 구분하는 신상픽의 기준',body:'<h1>편집·데이터 수집 원칙</h1><p>기준: 2026년 11월 27일. 공개 자료의 사실과 신상픽의 계산·해석을 구분합니다.</p><h2>출처와 기준일</h2><p>각 가이드에는 자료 기준일과 상품별 공식 수집 출처를 표시합니다. 구매 시점의 가격과 제공량은 링크된 판매처에서 확인해 주세요. 공식 홈페이지 소개 문구를 편집 본문으로 복사하지 않으며, 등록일을 실제 출시일로 바꾸지 않습니다.</p><h2>계산과 비교</h2><p>가격·열량은 확인 가능한 값만 사용합니다. 100kcal당 가격은 가격 ÷ 열량 × 100이며 원 단위 반올림합니다. 이 비율은 맛·포만감·영양·품질의 종합 점수가 아닙니다. 제공량이나 단위가 불명확하면 동일 중량 비교를 하지 않습니다. 누락을 0, 알레르기 없음, 무료로 바꾸지 않습니다. 이상치가 의심되면 비교에서 제외하고 확인할 항목을 밝힙니다.</p><h2>리뷰와 편집 콘텐츠</h2><p>가이드의 수치 분석은 시식 후기가 아닙니다. 가짜 이용자·리뷰·별점·필자 경력을 만들지 않습니다. 상품 페이지는 공식 설명 길이만으로 색인하지 않습니다. 서로 다른 작성자의 충분한 등록 리뷰가 확인되는 경우에만 색인을 허용하는 보수적인 기준을 적용합니다. 등록 리뷰는 구매 인증을 보장하지 않습니다.</p><h2>광고와 화면 범위</h2><p>웹 애드센스 코드는 본문·비교표·출처가 있는 가이드 상세 문서에만 포함합니다. 상품 탐색 앱, 로그인, 설정, 글쓰기, 빈 목록과 noindex 페이지에는 웹 광고를 싣지 않습니다. 광고가 상품의 품질이나 분석 결과를 결정하지 않습니다. 앱 설치 안내로 본문을 가리지 않습니다.</p><h2>정정과 개인정보</h2><p>오류 제보는 상품 또는 글 주소, 확인 날짜, 공식 근거를 함께 보내 주세요. 연락처는 <a href="mailto:contact@sinsangpick.com">contact@sinsangpick.com</a>입니다. 제보에 불필요한 개인정보나 주문번호는 보내지 마세요. 접수한 근거로 수정 여부를 검토하며 미확인 정보를 확정 사실로 표시하지 않습니다.</p>'},
 contact:{title:'문의·오류 제보',description:'신상픽 운영 문의와 상품 데이터 정정 접수 방법',body:'<h1>문의·오류 제보</h1><p>운영 및 데이터 문의는 아래 고객지원 이메일로 받습니다.</p><p><a href="mailto:contact@sinsangpick.com">contact@sinsangpick.com</a></p><h2>가격·성분·출시 정보 정정</h2><p>상품 또는 가이드 주소, 확인한 날짜, 기존 값과 변경된 값, 공식 홈페이지나 포장의 근거를 함께 알려 주세요. 매장·배달·옵션 가격은 다를 수 있으므로 확인한 판매 조건도 적어 주시면 구분하는 데 도움이 됩니다. 공식 페이지 링크를 우선 보내 주세요.</p><h2>리뷰 및 권리 관련 문의</h2><p>문제가 있는 게시물 주소와 구체적인 사유를 알려 주세요. 개인의 민감정보, 결제정보, 계정 비밀번호는 보내지 마세요. 문의 내용과 근거를 확인한 뒤 안내해 드립니다.</p><h2>운영 정보</h2><p>플레이팅 (신상픽) · 대표 양승현 · 사업자등록번호 618-09-34774<br>서울특별시 양천구 목동중앙남로3가길 108, B02호(목동)</p>'}
};
for(const [slug,p] of Object.entries(infoPages))await put(slug+'.html',documentPage({...p,pathname:'/'+slug,body:'<main class="wrap article">'+p.body+'</main>'}));
let html=await fs.readFile(path.join(output,'index.html'),'utf8');
const toss=/<html[^>]*class="[^"]*toss-app/.test(html);
html=html.replace(/<style id="editorial-style">[\s\S]*?<\/style>/g,'');
html=html.replace('</head>','<style id="editorial-style">'+editorialCss+'</style></head>');
html=replaceRoot(html,toss?'':homeEditorial());
await put('index.html',html);
await put('pc.html',html);
await put('404.html',documentPage({title:'페이지를 찾을 수 없습니다',description:'존재하지 않는 주소입니다.',pathname:'/404',noindex:true,body:'<main class="wrap"><h1>페이지를 찾을 수 없습니다</h1><p><a href="/">홈</a> 또는 <a href="/guide">가이드 목록</a>에서 다시 찾아보세요.</p></main>'}));
console.log('Editorial HTML: 15 guides, index, trust pages, both home shells generated.');
