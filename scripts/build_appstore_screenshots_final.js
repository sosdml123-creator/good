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

function getBase64Image(filename) {
  const filePath = path.join(repoScreenshotsDir, filename);
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

console.log('Loading real captured screens...');
const img1 = getBase64Image('real_screen_safe_01.png');
const img2 = getBase64Image('real_screen_safe_02.png');
const img3 = getBase64Image('real_screen_safe_03.png');
const img4 = getBase64Image('real_screen_safe_04.png');

const screensData = [
  {
    id: '1_실시간신상',
    engName: 'AppStore_01_Discover',
    badge: '✨ NEW IN · 실시간 신상 탐색',
    title: '매일 쏟아지는 먹거리 신상<br><span class="highlight">가장 빠르게 발견해요</span>',
    subtitle: '편의점·마트 신상품부터 전국 브랜드관 신메뉴까지',
    image: img1
  },
  {
    id: '2_행사캘린더',
    engName: 'AppStore_02_SaleEvents',
    badge: '🏷️ 1+1 & 2+1 · 편의점 행사 소식',
    title: '편의점 4사 1+1 · 2+1 행사<br><span class="highlight">놓치지 말고 한눈에 확인</span>',
    subtitle: 'CU · GS25 · 세븐일레븐 · 이마트24 매달 실시간 업데이트',
    image: img2
  },
  {
    id: '3_솔직리뷰',
    engName: 'AppStore_03_Reviews',
    badge: '⭐ 100% REAL REVIEW · 솔직 별점 검증',
    title: '실패 없는 내돈내산 소비<br><span class="highlight">직접 먹어본 솔직 리뷰</span>',
    subtitle: '맛 · 가성비 · 양 세부 지표와 생생한 100% 소비자 평가',
    image: img3
  },
  {
    id: '4_랭킹꿀조합',
    engName: 'AppStore_04_RankingRecipes',
    badge: '🏆 REAL-TIME RANKING · 신상 랭킹 LIVE',
    title: '요즘 가장 핫한 신상은?<br><span class="highlight">실시간 랭킹 LIVE</span>',
    subtitle: '소비자 리뷰와 인기도를 실시간 집계한 TOP 3 명예의 전당',
    image: img4
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
      font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #F8FAFC;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(0, 102, 255, 0.09) 0%, rgba(248, 250, 252, 0) 55%),
        radial-gradient(rgba(15, 23, 42, 0.04) 1.5px, transparent 1.5px);
      background-size: 100% 100%, 36px 36px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Ambient glow */
    .ambient-glow {
      position: absolute;
      top: 360px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 700px;
      background: radial-gradient(circle, rgba(0, 102, 255, 0.12) 0%, rgba(0, 102, 255, 0) 70%);
      pointer-events: none;
      z-index: 1;
    }

    /* Top Marketing Banner */
    .header-banner {
      width: 100%;
      padding-top: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      z-index: 10;
    }

    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 102, 255, 0.08);
      border: 1.5px solid rgba(0, 102, 255, 0.22);
      color: #0066FF;
      font-size: 27px;
      font-weight: 700;
      padding: 12px 34px;
      border-radius: 9999px;
      margin-bottom: 22px;
      box-shadow: 0 4px 16px rgba(0, 102, 255, 0.08);
    }

    .main-title {
      font-size: 72px;
      font-weight: 850;
      color: #0F172A;
      line-height: 1.28;
      letter-spacing: -2px;
      margin-bottom: 18px;
    }

    .main-title .highlight {
      color: #0066FF;
    }

    .sub-title {
      font-size: 33px;
      font-weight: 500;
      color: #64748B;
      letter-spacing: -0.6px;
    }

    /* iPhone 16 Pro Mockup Frame */
    .device-mockup {
      position: absolute;
      top: 540px;
      width: 1040px;
      height: 2221px;
      background: #111827;
      border-radius: 68px;
      padding: 14px;
      box-shadow: 
        0 50px 120px -20px rgba(15, 23, 42, 0.38),
        0 25px 60px -15px rgba(0, 102, 255, 0.18),
        inset 0 0 0 2px rgba(255, 255, 255, 0.14);
      border: 3.5px solid #334155;
      z-index: 10;
      display: flex;
      flex-direction: column;
    }

    .screen-inner {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border-radius: 54px;
      overflow: hidden;
      position: relative;
    }

    /* Dynamic Island & iOS Status Bar */
    .status-bar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 162px;
      pointer-events: none;
      z-index: 50;
    }

    .status-time {
      position: absolute;
      top: 48px;
      left: 60px;
      font-size: 32px;
      font-weight: 700;
      color: #0F172A;
      letter-spacing: -0.5px;
    }

    .dynamic-island {
      position: absolute;
      top: 34px;
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      height: 72px;
      background: #000000;
      border-radius: 36px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 24px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .island-camera {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #181B28;
      border: 1px solid #2B3045;
      position: relative;
    }
    .island-camera::after {
      content: '';
      position: absolute;
      top: 5px;
      left: 5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #1A3059;
      opacity: 0.85;
    }

    .status-icons {
      position: absolute;
      top: 48px;
      right: 60px;
      display: flex;
      align-items: center;
      gap: 14px;
      color: #0F172A;
    }

    /* Actual App Screenshot */
    .app-screen-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
    }

    /* iOS Home Indicator */
    .home-indicator {
      position: absolute;
      bottom: 22px;
      left: 50%;
      transform: translateX(-50%);
      width: 320px;
      height: 10px;
      background: #0F172A;
      border-radius: 9999px;
      z-index: 50;
      opacity: 0.85;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <div class="header-banner">
    <div class="pill-badge">${data.badge}</div>
    <h1 class="main-title">${data.title}</h1>
    <p class="sub-title">${data.subtitle}</p>
  </div>

  <div class="device-mockup">
    <div class="screen-inner">
      <div class="status-bar-overlay">
        <div class="status-time">9:41</div>
        <div class="dynamic-island">
          <div class="island-camera"></div>
        </div>
        <div class="status-icons">
          <!-- Cellular -->
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="16" width="3" height="5" rx="1"/>
            <rect x="8" y="12" width="3" height="9" rx="1"/>
            <rect x="13" y="8" width="3" height="13" rx="1"/>
            <rect x="18" y="4" width="3" height="17" rx="1"/>
          </svg>
          <!-- Wi-Fi -->
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21L24 8.98C20.93 5.9 16.69 4 12 4ZM12 8C15.11 8 17.96 9.17 20.15 11.12L12 19.34L3.85 11.12C6.04 9.17 8.89 8 12 8Z"/>
          </svg>
          <!-- Battery -->
          <svg width="40" height="28" viewBox="0 0 28 16" fill="currentColor">
            <rect x="1" y="1" width="22" height="14" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <rect x="3" y="3" width="18" height="10" rx="2"/>
            <path d="M25 5.5C25.55 5.95 26 6.9 26 8C26 9.1 25.55 10.05 25 10.5V5.5Z"/>
          </svg>
        </div>
      </div>

      <img class="app-screen-img" src="${data.image}" alt="App Screen" />

      <div class="home-indicator"></div>
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

  console.log('Rendering all 4 final Apple App Store Screenshots (1290 x 2796 px)...');

  for (let i = 0; i < screensData.length; i++) {
    const s = screensData[i];
    console.log(`[${i + 1}/4] Generating: ${s.id} (${s.engName})...`);

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
  console.log('All 4 App Store screenshots generated successfully with real app screens!');
}

run().catch(console.error);
