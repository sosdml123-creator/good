import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const desktopDir = 'C:\\Users\\did\\Desktop';
const repoScreenshotsDir = path.resolve(__dirname, '..', 'public', 'screenshots');

if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });
if (!fs.existsSync(repoScreenshotsDir)) fs.mkdirSync(repoScreenshotsDir, { recursive: true });

function getBase64Image(filename) {
  const filePath = path.join(repoScreenshotsDir, filename);
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

console.log('Loading 5 real screen captures...');
const img1 = getBase64Image('real_screen_safe_01.png');
const img2 = getBase64Image('real_screen_safe_02.png');
const img3 = getBase64Image('real_screen_safe_03.png');
const img4 = getBase64Image('real_screen_safe_04.png');
const img5 = getBase64Image('real_screen_safe_05.png');

const screensData = [
  {
    id: '01_신상탐색',
    engName: 'AppStore_01_Discover',
    tag: '신상 탐색',
    title: '편의점·마트 신상품,<br>가장 먼저 만나보세요',
    sub: '매일 업데이트되는 실시간 먹거리 신상',
    image: img1
  },
  {
    id: '02_편의점행사',
    engName: 'AppStore_02_SaleEvents',
    tag: '편의점 행사',
    title: 'CU · GS25 · 세븐 · 이마트24<br>이번 달 1+1 · 2+1 행사',
    sub: '놓치기 아쉬운 편의점 할인 혜택을 한눈에',
    image: img2
  },
  {
    id: '03_솔직리뷰',
    engName: 'AppStore_03_Reviews',
    tag: '솔직 리뷰',
    title: '실패 없는 내돈내산 소비,<br>맛·가성비 세부 평점',
    sub: '직접 먹어본 소비자들의 100% 솔직한 후기',
    image: img3
  },
  {
    id: '04_실시간랭킹',
    engName: 'AppStore_04_RankingRecipes',
    tag: '실시간 랭킹',
    title: '요즘 어떤 게 제일 핫할까?<br>실시간 신상 랭킹',
    sub: '리뷰와 만족도로 검증된 인기 순위',
    image: img4
  },
  {
    id: '05_브랜드관',
    engName: 'AppStore_05_Brands',
    tag: '브랜드관',
    title: '좋아하는 브랜드의 신메뉴만<br>한곳에서 모아보기',
    sub: '전국 인기 브랜드 66개 공식 신메뉴 총집합',
    image: img5
  }
];

function generateHTML(data) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      width: 1290px;
      height: 2796px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", Roboto, sans-serif;
      background-color: #F8F9FA;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Top Typography Area (오늘의집 / 쿠팡 / 토스 style) */
    .header-area {
      width: 100%;
      padding-top: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      z-index: 10;
    }

    .kicker-tag {
      font-size: 26px;
      font-weight: 700;
      color: #0066FF;
      letter-spacing: -0.4px;
      margin-bottom: 16px;
    }

    .headline {
      font-size: 68px;
      font-weight: 800;
      color: #191F28;
      line-height: 1.28;
      letter-spacing: -2px;
      margin-bottom: 18px;
    }

    .sub-copy {
      font-size: 32px;
      font-weight: 500;
      color: #6B7684;
      letter-spacing: -0.6px;
    }

    /* iPhone 16 Pro Precision Titanium Chassis */
    .iphone-wrapper {
      position: absolute;
      top: 525px;
      left: 50%;
      transform: translateX(-50%);
      width: 1020px;
      height: 2271px;
      display: flex;
      justify-content: center;
      z-index: 20;
    }

    /* Natural Titanium Side Hardware Buttons */
    .btn-action {
      position: absolute;
      left: 3px;
      top: 260px;
      width: 5px;
      height: 54px;
      background: #94A3B8;
      border-radius: 4px 0 0 4px;
    }

    .btn-vol-up {
      position: absolute;
      left: 3px;
      top: 345px;
      width: 5px;
      height: 105px;
      background: #94A3B8;
      border-radius: 4px 0 0 4px;
    }

    .btn-vol-down {
      position: absolute;
      left: 3px;
      top: 475px;
      width: 5px;
      height: 105px;
      background: #94A3B8;
      border-radius: 4px 0 0 4px;
    }

    .btn-power {
      position: absolute;
      right: 3px;
      top: 380px;
      width: 5px;
      height: 150px;
      background: #94A3B8;
      border-radius: 0 4px 4px 0;
    }

    /* Outer Titanium Chassis Frame */
    .iphone-body {
      width: 1000px;
      height: 2271px;
      background: linear-gradient(145deg, #CBD5E1 0%, #94A3B8 50%, #64748B 100%);
      border-radius: 64px;
      padding: 5px;
      box-shadow: 
        0 40px 90px -20px rgba(15, 23, 42, 0.22),
        0 20px 40px -15px rgba(15, 23, 42, 0.12),
        0 0 0 1px rgba(0, 0, 0, 0.08);
      position: relative;
    }

    /* Inner Ultra-slim Black Bezel Rim */
    .iphone-inner-rim {
      width: 100%;
      height: 100%;
      background: #000000;
      border-radius: 60px;
      padding: 10px;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    /* Top Speaker Earpiece Slit */
    .speaker-slit {
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 4px;
      background: #1E293B;
      border-radius: 2px;
      z-index: 40;
    }

    /* Inner Screen */
    .iphone-screen {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border-radius: 50px;
      overflow: hidden;
      position: relative;
    }

    /* iOS 18 Dynamic Island Pill */
    .dynamic-island-pill {
      position: absolute;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: 240px;
      height: 56px;
      background: #000000;
      border-radius: 28px;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    .camera-lens {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #0D1322;
      border: 1px solid #1E293B;
      position: relative;
    }
    .camera-lens::after {
      content: '';
      position: absolute;
      top: 3.5px;
      left: 3.5px;
      width: 6.5px;
      height: 6.5px;
      border-radius: 50%;
      background: #1E3A8A;
      opacity: 0.9;
    }

    /* Authentic iOS Status Bar */
    .status-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 140px;
      pointer-events: none;
      z-index: 50;
      display: flex;
      justify-content: space-between;
      padding: 34px 58px 0 58px;
    }

    .status-time {
      font-size: 29px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.4px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif;
    }

    .status-right-icons {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #111827;
    }

    /* Real App Screenshot */
    .screen-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
    }

    /* iOS Home Indicator Bar */
    .home-indicator {
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      height: 8px;
      background: #191F28;
      border-radius: 9999px;
      z-index: 50;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="header-area">
    <div class="kicker-tag">${data.tag}</div>
    <h1 class="headline">${data.title}</h1>
    <p class="sub-copy">${data.sub}</p>
  </div>

  <div class="iphone-wrapper">
    <!-- Physical Side Buttons -->
    <div class="btn-action"></div>
    <div class="btn-vol-up"></div>
    <div class="btn-vol-down"></div>
    <div class="btn-power"></div>

    <div class="iphone-body">
      <div class="iphone-inner-rim">
        <div class="speaker-slit"></div>

        <div class="iphone-screen">
          <!-- Dynamic Island -->
          <div class="dynamic-island-pill">
            <div class="camera-lens"></div>
          </div>

          <!-- iOS Status Bar -->
          <div class="status-bar">
            <div class="status-time">9:41</div>
            <div class="status-right-icons">
              <!-- Cellular -->
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="16" width="3" height="5" rx="1"/>
                <rect x="8" y="12" width="3" height="9" rx="1"/>
                <rect x="13" y="8" width="3" height="13" rx="1"/>
                <rect x="18" y="4" width="3" height="17" rx="1"/>
              </svg>
              <!-- Wi-Fi -->
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21L24 8.98C20.93 5.9 16.69 4 12 4ZM12 8C15.11 8 17.96 9.17 20.15 11.12L12 19.34L3.85 11.12C6.04 9.17 8.89 8 12 8Z"/>
              </svg>
              <!-- Battery -->
              <svg width="36" height="24" viewBox="0 0 28 16" fill="currentColor">
                <rect x="1" y="1" width="22" height="14" rx="3.5" stroke="currentColor" stroke-width="1.8" fill="none"/>
                <rect x="3.5" y="3.5" width="17" height="9" rx="2" fill="currentColor"/>
                <path d="M25 5.5C25.55 5.95 26 6.9 26 8C26 9.1 25.55 10.05 25 10.5V5.5Z"/>
              </svg>
            </div>
          </div>

          <img class="screen-img" src="${data.image}" alt="App Screen" />
          <div class="home-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  console.log('Rendering 5 App Store Screenshots (iPhone 16 Pro Chassis, Minimal Ohouse/Coupang style)...');

  for (let i = 0; i < screensData.length; i++) {
    const s = screensData[i];
    console.log(`[${i + 1}/5] Generating: ${s.id} (${s.engName})...`);

    const page = await browser.newPage();
    await page.setViewport({
      width: 1290,
      height: 2796,
      deviceScaleFactor: 1
    });

    const html = generateHTML(s);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const desktopKorPath = path.join(desktopDir, `신상픽_앱스토어_${s.id}.png`);
    const desktopEngPath = path.join(desktopDir, `${s.engName}.png`);
    const repoPath = path.join(repoScreenshotsDir, `${s.engName}.png`);

    await page.screenshot({ path: desktopKorPath, type: 'png' });
    fs.copyFileSync(desktopKorPath, desktopEngPath);
    fs.copyFileSync(desktopKorPath, repoPath);

    console.log(` -> Saved to Desktop: ${desktopKorPath}`);
    console.log(` -> Saved to Desktop: ${desktopEngPath}`);
    console.log(` -> Saved to Repo: ${repoPath}`);

    await page.close();
  }

  await browser.close();
  console.log('All 5 App Store screenshots re-rendered successfully!');
}

run().catch(console.error);
