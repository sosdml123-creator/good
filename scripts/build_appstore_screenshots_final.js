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
    titleLine1: '오늘 출시된 모든 신상,',
    titleLine2: '<span class="highlight">가장 먼저</span> 만나보세요',
    sub: '편의점부터 마트까지 매일 실시간 업데이트',
    image: img1
  },
  {
    id: '02_편의점행사',
    engName: 'AppStore_02_SaleEvents',
    titleLine1: '이번 달 편의점 1+1,',
    titleLine2: '<span class="highlight">놓치지 말고</span> 알뜰하게',
    sub: 'CU · GS25 · 세븐 · 이마트24 전국 행사 총정리',
    image: img2
  },
  {
    id: '03_솔직리뷰',
    engName: 'AppStore_03_Reviews',
    titleLine1: '광고 없이 솔직한',
    titleLine2: '<span class="highlight">내돈내산 찐리뷰</span>',
    sub: '맛·가성비·양 세부 지표부터 영양정보까지',
    image: img3
  },
  {
    id: '04_실시간랭킹',
    engName: 'AppStore_04_RankingRecipes',
    titleLine1: '지금 가장 인기 있는',
    titleLine2: '<span class="highlight">실시간 랭킹 & 꿀조합</span>',
    sub: '실시간 반응 좋은 대세 메뉴와 편의점 레시피',
    image: img4
  },
  {
    id: '05_브랜드관',
    engName: 'AppStore_05_Brands',
    titleLine1: '좋아하는 브랜드 신메뉴만',
    titleLine2: '<span class="highlight">한곳에 모아보기</span>',
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
      background-color: #FFFFFF;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Top Typography Area (당근 / 알바몬 / 오늘의집 Style) */
    .header-area {
      width: 100%;
      padding-top: 175px;
      padding-left: 60px;
      padding-right: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      z-index: 10;
    }

    .headline {
      font-size: 76px;
      font-weight: 800;
      color: #191F28;
      line-height: 1.32;
      letter-spacing: -2px;
      word-break: keep-all;
    }

    .headline .highlight {
      color: #0066FF;
    }

    .sub-copy {
      margin-top: 22px;
      font-size: 32px;
      font-weight: 500;
      color: #8B95A1;
      letter-spacing: -0.6px;
      line-height: 1.4;
      word-break: keep-all;
    }

    /* Phone Screen Card Container (심플한 폰 화면 형태) */
    .screen-card-wrapper {
      position: absolute;
      top: 500px;
      left: 50%;
      transform: translateX(-50%);
      width: 1050px;
      height: 2296px;
      background: #FFFFFF;
      border-radius: 56px 56px 0 0;
      border: 1.5px solid rgba(0, 0, 0, 0.08);
      border-bottom: none;
      box-shadow: 
        0 24px 60px -10px rgba(0, 0, 0, 0.08),
        0 10px 24px -6px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      z-index: 20;
    }

    /* iOS Authentic Status Bar */
    .status-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 130px;
      pointer-events: none;
      z-index: 50;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 36px 56px 0 56px;
    }

    .status-time {
      font-size: 28px;
      font-weight: 700;
      color: #191F28;
      letter-spacing: -0.3px;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif;
    }

    /* Clean Dynamic Island */
    .dynamic-island-pill {
      position: absolute;
      top: 25px;
      left: 50%;
      transform: translateX(-50%);
      width: 220px;
      height: 52px;
      background: #000000;
      border-radius: 26px;
      z-index: 60;
    }

    .status-right-icons {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #191F28;
      padding-top: 2px;
    }

    /* Real App Screenshot Image */
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
      bottom: 22px;
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      height: 7px;
      background: #000000;
      border-radius: 9999px;
      z-index: 50;
      opacity: 0.65;
    }
  </style>
</head>
<body>
  <!-- Clean Header -->
  <div class="header-area">
    <h1 class="headline">
      ${data.titleLine1}<br>${data.titleLine2}
    </h1>
    <p class="sub-copy">${data.sub}</p>
  </div>

  <!-- Screen Card (No bulky phone frame, purely screen-shaped) -->
  <div class="screen-card-wrapper">
    <!-- Dynamic Island -->
    <div class="dynamic-island-pill"></div>

    <!-- Status Bar -->
    <div class="status-bar">
      <div class="status-time">9:41</div>
      <div class="status-right-icons">
        <!-- Cellular -->
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="16" width="3" height="5" rx="1"/>
          <rect x="8" y="12" width="3" height="9" rx="1"/>
          <rect x="13" y="8" width="3" height="13" rx="1"/>
          <rect x="18" y="4" width="3" height="17" rx="1"/>
        </svg>
        <!-- Wi-Fi -->
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21L24 8.98C20.93 5.9 16.69 4 12 4ZM12 8C15.11 8 17.96 9.17 20.15 11.12L12 19.34L3.85 11.12C6.04 9.17 8.89 8 12 8Z"/>
        </svg>
        <!-- Battery -->
        <svg width="34" height="20" viewBox="0 0 28 16" fill="none">
          <rect x="1" y="1" width="22" height="14" rx="4" stroke="currentColor" stroke-width="2"/>
          <rect x="3" y="3" width="16" height="10" rx="2" fill="currentColor"/>
          <path d="M25 5.5C25.8 6.2 26 7 26 8C26 9 25.8 9.8 25 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <!-- Real App Screen -->
    <img src="${data.image}" class="screen-img" alt="Screen Content">

    <!-- Home Indicator -->
    <div class="home-indicator"></div>
  </div>
</body>
</html>`;
}

async function run() {
  console.log('Launching browser to render 5 clean app store screenshots...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1290,
    height: 2796,
    deviceScaleFactor: 1
  });

  for (let i = 0; i < screensData.length; i++) {
    const data = screensData[i];
    console.log(`[${i + 1}/5] Rendering ${data.id}...`);

    const html = generateHTML(data);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Wait a brief moment for fonts and rendering to settle
    await new Promise(resolve => setTimeout(resolve, 600));

    const desktopKrPath = path.join(desktopDir, `신상픽_앱스토어_${data.id}.png`);
    const desktopEngPath = path.join(desktopDir, `${data.engName}.png`);
    const repoPath = path.join(repoScreenshotsDir, `${data.engName}.png`);

    await page.screenshot({
      path: desktopKrPath,
      type: 'png'
    });

    // Copy to English filename on Desktop and Repo
    fs.copyFileSync(desktopKrPath, desktopEngPath);
    fs.copyFileSync(desktopKrPath, repoPath);

    console.log(` -> Saved: ${desktopKrPath}`);
  }

  await browser.close();
  console.log('All 5 screenshots successfully generated!');
}

run().catch(err => {
  console.error('Error generating screenshots:', err);
  process.exit(1);
});
