// 앱스토어 상세 이미지(리뷰·포인트 중심) 합성: 실제 앱 캡처 + 실사 배경(Codex) + 문구
// 사용: node scripts/build_appstore_review_screenshots.mjs <캡처폴더> <배경폴더> <출력폴더>
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const [shotsDir, bgDir, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const b64 = (f) => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;

const slides = [
  { id: '01', shot: 's_write.png', bg: 'bg1.png', badge: '리뷰 1건 +10P', l1: '리뷰 쓰면', l2: '포인트가 쌓여요', sub: '사진·글자 수 상관없이 1건당 10P', ink: '#1b1712', accent: '#e8590c' },
  { id: '02', shot: 'p_coupon.png', bg: 'bg2.png', badge: '1P = 1원', l1: '모은 포인트는', l2: 'e쿠폰으로 교환', sub: '카페 · 편의점 · 아이스크림까지', ink: '#2a1a14', accent: '#d9480f' },
  { id: '03', shot: 'p_my.png', bg: 'bg3.png', badge: '신규 가입 혜택', l1: '가입만 해도', l2: '100P 바로 지급', sub: '내 포인트와 적립 내역을 한눈에', ink: '#14231f', accent: '#0b7a5a' },
  { id: '04', shot: 's_new.png', bg: 'bg4.png', badge: '실제 리뷰 반영', l1: '새로 나온 신상', l2: '리뷰 랭킹으로 확인', sub: '리뷰 평점으로 매기는 신제품 순위', ink: '#1d1a16', accent: '#e8590c' },
  { id: '05', shot: 's_home.png', bg: 'bg5.png', badge: '매일 업데이트', l1: '오늘 나온 신상,', l2: '홈에서 한눈에', sub: '편의점 · 카페 · 디저트 신제품 모아보기', ink: '#ffffff', accent: '#e8590c', dark: true },
];

const html = (s) => `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1290px;height:2796px;overflow:hidden;position:relative;font-family:Pretendard,-apple-system,sans-serif;background:#eee}
.bg{position:absolute;inset:0;background:url('${b64(path.join(bgDir, s.bg))}') center/cover no-repeat}
.veil{position:absolute;inset:0;background:${s.dark ? "linear-gradient(180deg,rgba(15,9,4,.45) 0%,rgba(15,9,4,.25) 45%,rgba(15,9,4,0) 65%)" : "linear-gradient(180deg,rgba(255,255,255,.7) 0%,rgba(255,255,255,.5) 38%,rgba(255,255,255,0) 60%)"}}
.copy{position:absolute;left:0;right:0;top:150px;text-align:center;color:${s.ink}}
.badge{display:inline-block;padding:16px 38px;border-radius:999px;background:${s.accent};color:#fff;font-weight:700;font-size:44px;letter-spacing:-1px}
h1{margin-top:44px;font-weight:800;font-size:132px;line-height:1.14;letter-spacing:-5px}
.sub{margin-top:36px;font-weight:500;font-size:46px;letter-spacing:-1.5px;opacity:.78}
.phone{position:absolute;left:150px;top:900px;width:990px;border-radius:120px;background:#16161a;padding:15px;box-shadow:0 40px 90px rgba(30,20,10,.32),0 6px 18px rgba(30,20,10,.25)}
.phone img{display:block;width:960px}
.sb{position:relative;height:118px;border-radius:106px 106px 0 0;background:#fff;color:#111;font-weight:600;font-size:40px;display:flex;align-items:center;justify-content:space-between;padding:6px 78px 0 86px}
.sb svg{height:34px;fill:currentColor}
.island{position:absolute;left:50%;top:26px;width:250px;height:72px;margin-left:-125px;border-radius:40px;background:#0a0a0c}
</style></head><body>
<div class="bg"></div><div class="veil"></div>
<div class="copy"><span class="badge">${s.badge}</span><h1>${s.l1}<br>${s.l2}</h1><p class="sub">${s.sub}</p></div>
<div class="phone"><div class="sb" id="sb"><span>9:41</span><div class="island"></div><svg viewBox="0 0 120 34"><rect x="0" y="22" width="6" height="10" rx="1.5"/><rect x="11" y="16" width="6" height="16" rx="1.5"/><rect x="22" y="9" width="6" height="23" rx="1.5"/><rect x="33" y="2" width="6" height="30" rx="1.5"/><path d="M62 10c6-6 18-6 24 0l-3 3c-4.5-4.5-13.500-4.500-18 0zM67 16c3.500-3 10.500-3 14 0l-3 3c-2-2-6-2-8 0zM72 22h4l-2 3z"/><rect x="96" y="4" width="22" height="26" rx="5" opacity=".0"/></svg></div><img id="shot" src="${b64(path.join(shotsDir, s.shot))}"></div>
</body></html>`;

const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1290, height: 2796, deviceScaleFactor: 1 });
for (const s of slides) {
  await page.setContent(html(s), { waitUntil: 'load', timeout: 90000 });
  await Promise.race([page.evaluate(() => document.fonts.ready), new Promise(r => setTimeout(r, 15000))]); await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => { const im = document.getElementById('shot'); const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(20, 6, 1, 1).data; const sb = document.getElementById('sb'); sb.style.background = `rgb(${d[0]},${d[1]},${d[2]})`; sb.style.color = (d[0]*0.299+d[1]*0.587+d[2]*0.114) < 120 ? '#fff' : '#111'; });
  const out = path.join(outDir, `appstore_${s.id}.png`);
  await page.screenshot({ path: out });
  console.log('saved', out);
}
await browser.close();
