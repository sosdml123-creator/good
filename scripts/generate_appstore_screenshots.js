import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possiblePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let executablePath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    executablePath = p;
    break;
  }
}

if (!executablePath) {
  console.error('No Chrome or Edge browser executable found.');
  process.exit(1);
}

const desktopDir = 'C:\\Users\\did\\Desktop';
const repoScreenshotsDir = path.resolve(__dirname, '..', 'public', 'screenshots');

if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });
if (!fs.existsSync(repoScreenshotsDir)) fs.mkdirSync(repoScreenshotsDir, { recursive: true });

// Common CSS Styles for 1290x2796 App Store Screenshots
const commonStyles = `
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
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    background-color: #F8FAFC;
    background-image: 
      radial-gradient(circle at 50% 0%, rgba(0, 102, 255, 0.08) 0%, rgba(248, 250, 252, 0) 50%),
      radial-gradient(rgba(15, 23, 42, 0.035) 1.5px, transparent 1.5px);
    background-size: 100% 100%, 36px 36px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Ambient light accent */
  .ambient-glow {
    position: absolute;
    top: 500px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(0, 102, 255, 0.12) 0%, rgba(0, 102, 255, 0) 70%);
    pointer-events: none;
    z-index: 1;
  }

  /* Top Banner Text Area */
  .header-banner {
    width: 100%;
    padding-top: 150px;
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
    font-size: 28px;
    font-weight: 700;
    padding: 12px 34px;
    border-radius: 9999px;
    margin-bottom: 24px;
    box-shadow: 0 4px 16px rgba(0, 102, 255, 0.08);
  }

  .main-title {
    font-size: 74px;
    font-weight: 850;
    color: #0F172A;
    line-height: 1.26;
    letter-spacing: -2px;
    margin-bottom: 20px;
  }

  .main-title .highlight {
    color: #0066FF;
  }

  .sub-title {
    font-size: 34px;
    font-weight: 500;
    color: #64748B;
    letter-spacing: -0.6px;
  }

  /* iPhone 16 Pro Frame */
  .device-mockup {
    position: absolute;
    top: 610px;
    width: 1050px;
    height: 2200px;
    background: #111827;
    border-radius: 72px;
    padding: 16px;
    box-shadow: 
      0 60px 140px -20px rgba(15, 23, 42, 0.4),
      0 30px 60px -15px rgba(0, 102, 255, 0.2),
      inset 0 0 0 2px rgba(255, 255, 255, 0.16);
    border: 3px solid #334155;
    z-index: 10;
    display: flex;
    flex-direction: column;
  }

  .screen-inner {
    width: 100%;
    height: 100%;
    background: #F8F9FA;
    border-radius: 56px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* Dynamic Island */
  .dynamic-island {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 290px;
    height: 70px;
    background: #000000;
    border-radius: 35px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 28px;
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
    opacity: 0.8;
  }

  /* Status Bar */
  .status-bar {
    width: 100%;
    height: 100px;
    padding: 24px 50px 0 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 90;
    background: transparent;
  }

  .status-time {
    font-size: 32px;
    font-weight: 700;
    color: #0F172A;
    letter-spacing: -0.5px;
  }

  .status-icons {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #0F172A;
  }

  /* Screen Content Scroll Area */
  .app-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #F8F9FA;
    padding-bottom: 140px;
  }

  /* In-App Bottom Navigation Bar */
  .app-bottom-nav {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 145px;
    background: #FFFFFF;
    border-top: 1px solid #E2E8F0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-bottom: 30px;
    z-index: 80;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: #94A3B8;
    font-size: 22px;
    font-weight: 600;
  }

  .nav-item.active {
    color: #0066FF;
  }

  .nav-item svg {
    width: 44px;
    height: 44px;
  }

  .home-indicator {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 270px;
    height: 8px;
    background: #0F172A;
    border-radius: 9999px;
  }
`;

// Screenshot 1 HTML: Real-time New Product Feed
const screen1HTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>신상픽 - 실시간 신상 발견</title>
  <style>
    ${commonStyles}

    /* Home UI Specific Styles */
    .app-header {
      padding: 10px 32px 18px 32px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #F1F5F9;
    }

    .app-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .app-logo-icon {
      width: 46px;
      height: 46px;
      background: linear-gradient(135deg, #0066FF, #3B82F6);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 26px;
      font-weight: 900;
      box-shadow: 0 6px 14px rgba(0, 102, 255, 0.25);
    }

    .app-logo-text {
      font-size: 34px;
      font-weight: 900;
      color: #0066FF;
      letter-spacing: -1px;
    }

    .header-icons {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #F1F5F9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #334155;
      position: relative;
    }

    .bell-badge {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #EF4444;
      border: 2px solid #FFFFFF;
    }

    /* Search Bar */
    .search-box-wrap {
      padding: 16px 32px;
      background: #FFFFFF;
    }

    .search-bar {
      height: 68px;
      background: #F1F5F9;
      border-radius: 20px;
      display: flex;
      align-items: center;
      padding: 0 24px;
      gap: 16px;
      color: #94A3B8;
      font-size: 26px;
      font-weight: 500;
    }

    /* Category Chips */
    .category-scroll {
      display: flex;
      gap: 14px;
      padding: 18px 32px;
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      overflow: hidden;
    }

    .cat-chip {
      padding: 12px 26px;
      border-radius: 9999px;
      font-size: 24px;
      font-weight: 700;
      white-space: nowrap;
      background: #F1F5F9;
      color: #64748B;
    }

    .cat-chip.active {
      background: #0066FF;
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(0, 102, 255, 0.25);
    }

    /* Hero Banner */
    .hero-banner {
      margin: 24px 32px;
      height: 220px;
      border-radius: 28px;
      background: linear-gradient(135deg, #0052CC 0%, #0066FF 60%, #38BDF8 100%);
      padding: 34px 40px;
      color: #FFFFFF;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-shadow: 0 16px 36px -8px rgba(0, 102, 255, 0.35);
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.22);
      backdrop-filter: blur(8px);
      padding: 6px 18px;
      border-radius: 9999px;
      font-size: 20px;
      font-weight: 700;
      width: fit-content;
      margin-bottom: 14px;
    }

    .hero-title {
      font-size: 38px;
      font-weight: 850;
      line-height: 1.25;
      letter-spacing: -1px;
    }

    .hero-desc {
      font-size: 24px;
      font-weight: 500;
      opacity: 0.92;
      margin-top: 8px;
    }

    /* Section Header */
    .section-head {
      padding: 24px 32px 14px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-title {
      font-size: 34px;
      font-weight: 800;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-more {
      font-size: 24px;
      font-weight: 600;
      color: #0066FF;
    }

    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 10px 32px 40px 32px;
    }

    .product-card {
      background: #FFFFFF;
      border-radius: 26px;
      padding: 22px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
      display: flex;
      flex-direction: column;
    }

    .product-img-box {
      width: 100%;
      height: 240px;
      border-radius: 20px;
      background: #F8FAFC;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-bottom: 18px;
    }

    .product-img-box img {
      width: 85%;
      height: 85%;
      object-fit: contain;
    }

    .badge-corner {
      position: absolute;
      top: 14px;
      left: 14px;
      background: #0066FF;
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 10px;
    }

    .badge-cu {
      position: absolute;
      top: 14px;
      right: 14px;
      background: #6D28D9;
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 10px;
    }

    .badge-gs {
      position: absolute;
      top: 14px;
      right: 14px;
      background: #0284C7;
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 10px;
    }

    .prod-brand {
      font-size: 20px;
      font-weight: 600;
      color: #64748B;
      margin-bottom: 6px;
    }

    .prod-name {
      font-size: 26px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.3;
      height: 68px;
      overflow: hidden;
      margin-bottom: 12px;
    }

    .prod-bottom {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .prod-price {
      font-size: 28px;
      font-weight: 850;
      color: #0F172A;
    }

    .prod-rating {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 22px;
      font-weight: 700;
      color: #F59E0B;
    }

    .prod-tags {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }

    .prod-tag {
      font-size: 18px;
      font-weight: 600;
      color: #0066FF;
      background: #EFF6FF;
      padding: 4px 10px;
      border-radius: 6px;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <!-- Top Banner -->
  <div class="header-banner">
    <div class="pill-badge">✨ NEW ARRIVALS · 실시간 신상 탐색</div>
    <h1 class="main-title">
      매일 쏟아지는 먹거리 신상<br>
      <span class="highlight">가장 빠르게 발견해요</span>
    </h1>
    <p class="sub-title">편의점 4사 · 대형마트 · 카페 신제품 실시간 업데이트</p>
  </div>

  <!-- iPhone 16 Pro Frame -->
  <div class="device-mockup">
    <div class="screen-inner">
      <div class="dynamic-island">
        <div class="island-camera"></div>
      </div>

      <!-- iOS Status Bar -->
      <div class="status-bar">
        <span class="status-time">9:41</span>
        <div class="status-icons">
          <!-- 5G -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h3v4H2v-4zm6-5h3v9H8v-9zm6-5h3v14h-3V7zm6-5h3v19h-3V2z"/>
          </svg>
          <!-- Wifi -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
          </svg>
          <!-- Battery -->
          <svg width="34" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <rect x="2" y="6" width="18" height="12" rx="3"/>
            <path d="M22 10v4"/>
            <rect x="4" y="8" width="12" height="8" rx="1.5" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <!-- In-App Content -->
      <div class="app-content">
        <!-- Header -->
        <div class="app-header">
          <div class="app-logo">
            <div class="app-logo-icon">P</div>
            <span class="app-logo-text">신상픽</span>
          </div>
          <div class="header-icons">
            <div class="icon-btn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              <div class="bell-badge"></div>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-box-wrap">
          <div class="search-bar">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>어떤 신상이 궁금하세요?</span>
          </div>
        </div>

        <!-- Category Chips -->
        <div class="category-scroll">
          <div class="cat-chip active">전체 신상 ✨</div>
          <div class="cat-chip">편의점 🏪</div>
          <div class="cat-chip">과자·스낵 🍪</div>
          <div class="cat-chip">음료 🥤</div>
          <div class="cat-chip">아이스크림 🍦</div>
          <div class="cat-chip">베이커리 🥐</div>
        </div>

        <!-- Hero Card -->
        <div class="hero-banner">
          <div class="hero-badge">🔥 9월 3주차 SNS 대란템</div>
          <div class="hero-title">지금 가장 뜨거운 신상 모음</div>
          <div class="hero-desc">연세우유 생크림빵 & 품절대란 스낵 랭킹</div>
        </div>

        <!-- Live Feed Section -->
        <div class="section-head">
          <div class="section-title">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#0066FF">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            오늘의 따끈따끈 신상
          </div>
          <span class="section-more">더보기 &gt;</span>
        </div>

        <!-- Product Grid -->
        <div class="product-grid">
          <!-- Card 1 -->
          <div class="product-card">
            <div class="product-img-box">
              <span class="badge-corner">NEW</span>
              <span class="badge-cu">CU 단독</span>
              <img src="https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801753108478_4.png" alt="연세우유">
            </div>
            <div class="prod-brand">연세우유 · CU</div>
            <div class="prod-name">연세우유 우유생크림빵</div>
            <div class="prod-bottom">
              <span class="prod-price">2,900원</span>
              <div class="prod-rating">★ 4.9 <span style="color:#94A3B8; font-weight:500;">(520)</span></div>
            </div>
            <div class="prod-tags">
              <span class="prod-tag">#생크림폭탄</span>
              <span class="prod-tag">#베스트1위</span>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="product-card">
            <div class="product-img-box">
              <span class="badge-corner" style="background:#EF4444;">HOT</span>
              <span class="badge-gs">GS25</span>
              <img src="https://shopping-phinf.pstatic.net/main_9118948/91189484597.1.jpg?type=f300" alt="복숭아">
            </div>
            <div class="prod-brand">산지직송 명품</div>
            <div class="prod-name">햇사레 프리미엄 꿀복숭아</div>
            <div class="prod-bottom">
              <span class="prod-price">18,900원</span>
              <div class="prod-rating">★ 4.9 <span style="color:#94A3B8; font-weight:500;">(430)</span></div>
            </div>
            <div class="prod-tags">
              <span class="prod-tag">#당도14Brix</span>
              <span class="prod-tag">#산지직송</span>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="product-card">
            <div class="product-img-box">
              <span class="badge-corner">NEW</span>
              <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80" alt="코카콜라">
            </div>
            <div class="prod-brand">코카콜라</div>
            <div class="prod-name">코카콜라 제로 레몬 500ml</div>
            <div class="prod-bottom">
              <span class="prod-price">2,200원</span>
              <div class="prod-rating">★ 4.8 <span style="color:#94A3B8; font-weight:500;">(310)</span></div>
            </div>
            <div class="prod-tags">
              <span class="prod-tag">#1+1행사</span>
              <span class="prod-tag">#상큼제로</span>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="product-card">
            <div class="product-img-box">
              <span class="badge-corner" style="background:#F59E0B;">인기</span>
              <img src="https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80" alt="하겐다즈">
            </div>
            <div class="prod-brand">하겐다즈</div>
            <div class="prod-name">하겐다즈 스트로베리 파인트</div>
            <div class="prod-bottom">
              <span class="prod-price">15,900원</span>
              <div class="prod-rating">★ 4.9 <span style="color:#94A3B8; font-weight:500;">(640)</span></div>
            </div>
            <div class="prod-tags">
              <span class="prod-tag">#특가할인</span>
              <span class="prod-tag">#골라담기</span>
            </div>
          </div>
        </div>
      </div>

      <!-- In-App Bottom Navigation -->
      <div class="app-bottom-nav">
        <div class="nav-item active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>홈</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="14" width="7" height="7" rx="2"/>
            <rect x="3" y="14" width="7" height="7" rx="2"/>
          </svg>
          <span>카테고리</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>행사소식</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
          <span>랭킹</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>MY</span>
        </div>
        <div class="home-indicator"></div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Screenshot 2 HTML: 편의점 행사 & 1+1 캘린더
const screen2HTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>신상픽 - 편의점 행사 캘린더</title>
  <style>
    ${commonStyles}

    .app-header {
      padding: 16px 32px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #F1F5F9;
    }

    .header-title-wrap {
      display: flex;
      flex-direction: column;
    }

    .header-page-title {
      font-size: 34px;
      font-weight: 850;
      color: #0F172A;
    }

    .header-page-sub {
      font-size: 22px;
      font-weight: 600;
      color: #0066FF;
      margin-top: 4px;
    }

    /* Store Tabs */
    .store-tabs {
      display: flex;
      gap: 12px;
      padding: 18px 32px;
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      overflow: hidden;
    }

    .store-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 22px;
      border-radius: 9999px;
      font-size: 22px;
      font-weight: 700;
      background: #F1F5F9;
      color: #475569;
      white-space: nowrap;
    }

    .store-pill.active {
      background: #0066FF;
      color: #FFFFFF;
      box-shadow: 0 4px 12px rgba(0, 102, 255, 0.25);
    }

    .store-badge-cu {
      background: #6D28D9;
      color: #FFF;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 18px;
    }

    .store-badge-gs {
      background: #0284C7;
      color: #FFF;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 18px;
    }

    .store-badge-seven {
      background: #059669;
      color: #FFF;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 18px;
    }

    /* Deal Type Chips */
    .deal-filter-row {
      display: flex;
      gap: 12px;
      padding: 18px 32px 14px 32px;
    }

    .deal-chip {
      padding: 10px 24px;
      border-radius: 16px;
      font-size: 24px;
      font-weight: 800;
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      color: #475569;
    }

    .deal-chip.active {
      background: #EFF6FF;
      border-color: #0066FF;
      color: #0066FF;
    }

    /* Sale Card List */
    .sale-list {
      padding: 10px 32px 30px 32px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sale-card {
      background: #FFFFFF;
      border-radius: 28px;
      padding: 26px;
      border: 1.5px solid #E2E8F0;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
      display: flex;
      gap: 24px;
      position: relative;
    }

    .sale-img-wrap {
      width: 210px;
      height: 210px;
      border-radius: 22px;
      background: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      flex-shrink: 0;
      overflow: hidden;
    }

    .sale-img-wrap img {
      width: 85%;
      height: 85%;
      object-fit: contain;
    }

    .sale-badge-1plus1 {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #EF4444;
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 900;
      padding: 6px 14px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
    }

    .sale-badge-2plus1 {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #10B981;
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 900;
      padding: 6px 14px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
    }

    .sale-badge-special {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #8B5CF6;
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 900;
      padding: 6px 14px;
      border-radius: 10px;
    }

    .sale-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .sale-store-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 700;
      color: #64748B;
    }

    .sale-title {
      font-size: 28px;
      font-weight: 850;
      color: #0F172A;
      line-height: 1.3;
      margin: 6px 0 10px 0;
    }

    .sale-price-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }

    .sale-calc-price {
      font-size: 32px;
      font-weight: 900;
      color: #0066FF;
    }

    .sale-orig-price {
      font-size: 22px;
      color: #94A3B8;
      text-decoration: line-through;
    }

    .sale-unit-desc {
      font-size: 22px;
      font-weight: 700;
      color: #EF4444;
      background: #FEF2F2;
      padding: 4px 12px;
      border-radius: 8px;
      width: fit-content;
      margin-top: 8px;
    }

    .sale-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      color: #64748B;
      font-weight: 600;
      border-top: 1px dashed #E2E8F0;
      padding-top: 10px;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <!-- Top Banner -->
  <div class="header-banner">
    <div class="pill-badge">🏷️ 1+1 · 2+1 · 편의점 할인 행사</div>
    <h1 class="main-title">
      편의점 4사 1+1 · 2+1 행사<br>
      <span class="highlight">놓치지 말고 한눈에 확인</span>
    </h1>
    <p class="sub-title">CU · GS25 · 세븐일레븐 · 이마트24 전국 할인 총집합</p>
  </div>

  <!-- iPhone 16 Pro Frame -->
  <div class="device-mockup">
    <div class="screen-inner">
      <div class="dynamic-island">
        <div class="island-camera"></div>
      </div>

      <!-- iOS Status Bar -->
      <div class="status-bar">
        <span class="status-time">9:41</span>
        <div class="status-icons">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h3v4H2v-4zm6-5h3v9H8v-9zm6-5h3v14h-3V7zm6-5h3v19h-3V2z"/>
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
          </svg>
          <svg width="34" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <rect x="2" y="6" width="18" height="12" rx="3"/>
            <path d="M22 10v4"/>
            <rect x="4" y="8" width="12" height="8" rx="1.5" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <!-- In-App Content -->
      <div class="app-content">
        <!-- Header -->
        <div class="app-header">
          <div class="header-title-wrap">
            <span class="header-page-title">행사 & 할인 소식</span>
            <span class="header-page-sub">9월 전국 편의점 1,420개 행사 진행 중</span>
          </div>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2.5">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
        </div>

        <!-- Store Filter Tabs -->
        <div class="store-tabs">
          <div class="store-pill active">전체 1,420</div>
          <div class="store-pill"><span class="store-badge-cu">CU</span> 380</div>
          <div class="store-pill"><span class="store-badge-gs">GS25</span> 410</div>
          <div class="store-pill"><span class="store-badge-seven">7-11</span> 320</div>
          <div class="store-pill">이마트24 310</div>
        </div>

        <!-- Deal Type Filters -->
        <div class="deal-filter-row">
          <div class="deal-chip active">1+1 행사 🔥</div>
          <div class="deal-chip">2+1 행사</div>
          <div class="deal-chip">할인특가</div>
          <div class="deal-chip">카드제휴</div>
        </div>

        <!-- Sale Card List -->
        <div class="sale-list">
          <!-- Card 1 -->
          <div class="sale-card">
            <div class="sale-img-wrap">
              <span class="sale-badge-1plus1">1+1</span>
              <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80" alt="코카콜라">
            </div>
            <div class="sale-info">
              <div class="sale-store-row">
                <span class="store-badge-cu">CU</span>
                <span class="store-badge-gs">GS25</span>
                <span>전국 매장</span>
              </div>
              <div class="sale-title">코카콜라 제로 500ml PET</div>
              <div class="sale-price-row">
                <span class="sale-calc-price">2,200원</span>
                <span class="sale-orig-price">4,400원</span>
              </div>
              <div class="sale-unit-desc">개당 1,100원꼴 (50% 할인)</div>
              <div class="sale-footer">
                <span>교차선택 가능 (레몬/체리)</span>
                <span style="color:#0066FF;">D-14 남음</span>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="sale-card">
            <div class="sale-img-wrap">
              <span class="sale-badge-special">4개 1.8만</span>
              <img src="https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80" alt="하겐다즈">
            </div>
            <div class="sale-info">
              <div class="sale-store-row">
                <span class="store-badge-gs">GS25 단독</span>
                <span>파인트 전품목</span>
              </div>
              <div class="sale-title">하겐다즈 파인트 골라담기</div>
              <div class="sale-price-row">
                <span class="sale-calc-price">18,000원</span>
                <span class="sale-orig-price">63,600원</span>
              </div>
              <div class="sale-unit-desc">4개 구매 시 개당 4,500원</div>
              <div class="sale-footer">
                <span>바닐라, 딸기, 초코, 녹차</span>
                <span style="color:#0066FF;">D-10 남음</span>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="sale-card">
            <div class="sale-img-wrap">
              <span class="sale-badge-2plus1">2+1</span>
              <img src="https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80" alt="스낵">
            </div>
            <div class="sale-info">
              <div class="sale-store-row">
                <span class="store-badge-cu">CU</span>
                <span class="store-badge-seven">7-11</span>
              </div>
              <div class="sale-title">오리온 스윙칩 갈릭디핑맛</div>
              <div class="sale-price-row">
                <span class="sale-calc-price">3,400원</span>
                <span class="sale-orig-price">5,100원</span>
              </div>
              <div class="sale-unit-desc">3봉 구매 시 개당 1,133원</div>
              <div class="sale-footer">
                <span>신제품 출시 기념 2+1</span>
                <span style="color:#0066FF;">이달 말까지</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- In-App Bottom Navigation -->
      <div class="app-bottom-nav">
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>홈</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="14" width="7" height="7" rx="2"/>
            <rect x="3" y="14" width="7" height="7" rx="2"/>
          </svg>
          <span>카테고리</span>
        </div>
        <div class="nav-item active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>행사소식</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
          <span>랭킹</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>MY</span>
        </div>
        <div class="home-indicator"></div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Screenshot 3 HTML: 100% 솔직 리뷰 & 평점 분석
const screen3HTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>신상픽 - 100% 솔직 리뷰 & 별점</title>
  <style>
    ${commonStyles}

    .app-header {
      padding: 16px 32px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #F1F5F9;
    }

    .header-nav-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #F1F5F9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #334155;
    }

    .header-detail-title {
      font-size: 30px;
      font-weight: 800;
      color: #0F172A;
    }

    /* Product Mini Profile */
    .prod-profile-card {
      margin: 20px 32px;
      background: #FFFFFF;
      border-radius: 28px;
      padding: 24px;
      border: 1px solid #E2E8F0;
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .prod-profile-img {
      width: 140px;
      height: 140px;
      border-radius: 20px;
      background: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .prod-profile-img img {
      width: 90%;
      height: 90%;
      object-fit: contain;
    }

    .prod-profile-info {
      flex: 1;
    }

    .prod-badge-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
    }

    .badge-pill-sm {
      background: #6D28D9;
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .badge-pill-best {
      background: #FEF3C7;
      color: #B45309;
      font-size: 18px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .prod-profile-name {
      font-size: 28px;
      font-weight: 850;
      color: #0F172A;
      margin-bottom: 6px;
    }

    .prod-profile-price {
      font-size: 26px;
      font-weight: 800;
      color: #0066FF;
    }

    /* Rating Big Score Card */
    .rating-summary-card {
      margin: 0 32px 24px 32px;
      background: #FFFFFF;
      border-radius: 32px;
      padding: 34px;
      border: 1.5px solid #E2E8F0;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
    }

    .score-top-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #F1F5F9;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }

    .score-big-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .score-number {
      font-size: 72px;
      font-weight: 900;
      color: #0F172A;
      letter-spacing: -2px;
    }

    .score-stars-col {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .stars-row {
      display: flex;
      gap: 6px;
      color: #F59E0B;
      font-size: 28px;
    }

    .score-count-txt {
      font-size: 22px;
      color: #64748B;
      font-weight: 600;
    }

    .repurchase-badge {
      background: #EFF6FF;
      border: 1.5px solid #BFDBFE;
      padding: 14px 22px;
      border-radius: 20px;
      text-align: center;
    }

    .repurchase-rate {
      font-size: 34px;
      font-weight: 900;
      color: #0066FF;
    }

    .repurchase-label {
      font-size: 20px;
      font-weight: 700;
      color: #1E40AF;
      margin-top: 2px;
    }

    /* Metric Progress Bars */
    .metric-bars-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .metric-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .metric-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 22px;
      font-weight: 700;
      color: #334155;
    }

    .metric-track {
      width: 100%;
      height: 14px;
      background: #F1F5F9;
      border-radius: 9999px;
      overflow: hidden;
    }

    .metric-fill {
      height: 100%;
      background: linear-gradient(90deg, #3B82F6, #0066FF);
      border-radius: 9999px;
    }

    /* Real Reviews Feed */
    .review-feed-title {
      padding: 0 32px 14px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 30px;
      font-weight: 850;
      color: #0F172A;
    }

    .review-bubble {
      margin: 0 32px 18px 32px;
      background: #FFFFFF;
      border-radius: 28px;
      padding: 28px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
    }

    .reviewer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .reviewer-user {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .user-avatar-circle {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #EFF6FF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      border: 1.5px solid #BFDBFE;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
    }

    .user-name-txt {
      font-size: 24px;
      font-weight: 800;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-verified {
      background: #ECFDF5;
      color: #059669;
      font-size: 18px;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 6px;
    }

    .review-text-p {
      font-size: 25px;
      font-weight: 500;
      color: #334155;
      line-height: 1.55;
      margin-bottom: 14px;
    }

    .review-bottom-row {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      color: #94A3B8;
      font-weight: 600;
    }

    /* Floating Write Button */
    .floating-write-bar {
      margin: 10px 32px 20px 32px;
      background: #0066FF;
      border-radius: 22px;
      padding: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #FFFFFF;
      font-size: 26px;
      font-weight: 800;
      box-shadow: 0 12px 24px -4px rgba(0, 102, 255, 0.4);
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <!-- Top Banner -->
  <div class="header-banner">
    <div class="pill-badge">⭐ 100% REAL REVIEW · 솔직 별점 검증</div>
    <h1 class="main-title">
      실패 없는 내돈내산 소비<br>
      <span class="highlight">직접 먹어본 솔직 리뷰</span>
    </h1>
    <p class="sub-title">맛 · 가성비 · 양 · 재구매율까지 깐깐한 실시간 분석</p>
  </div>

  <!-- iPhone 16 Pro Frame -->
  <div class="device-mockup">
    <div class="screen-inner">
      <div class="dynamic-island">
        <div class="island-camera"></div>
      </div>

      <!-- iOS Status Bar -->
      <div class="status-bar">
        <span class="status-time">9:41</span>
        <div class="status-icons">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h3v4H2v-4zm6-5h3v9H8v-9zm6-5h3v14h-3V7zm6-5h3v19h-3V2z"/>
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
          </svg>
          <svg width="34" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <rect x="2" y="6" width="18" height="12" rx="3"/>
            <path d="M22 10v4"/>
            <rect x="4" y="8" width="12" height="8" rx="1.5" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <!-- In-App Content -->
      <div class="app-content">
        <!-- Header -->
        <div class="app-header">
          <div class="header-nav-btn">&lt;</div>
          <span class="header-detail-title">상세 정보 및 솔직 리뷰</span>
          <div class="header-nav-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
        </div>

        <!-- Product Profile Card -->
        <div class="prod-profile-card">
          <div class="prod-profile-img">
            <img src="https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801753108478_4.png" alt="연세우유">
          </div>
          <div class="prod-profile-info">
            <div class="prod-badge-row">
              <span class="badge-pill-sm">CU 단독</span>
              <span class="badge-pill-best">🏆 디저트 1위</span>
            </div>
            <div class="prod-profile-name">연세우유 우유생크림빵 (130g)</div>
            <div class="prod-profile-price">2,900원</div>
          </div>
        </div>

        <!-- Rating Summary Box -->
        <div class="rating-summary-card">
          <div class="score-top-flex">
            <div class="score-big-left">
              <span class="score-number">4.9</span>
              <div class="score-stars-col">
                <div class="stars-row">★★★★★</div>
                <span class="score-count-txt">520개 실구매자 평가</span>
              </div>
            </div>
            <div class="repurchase-badge">
              <div class="repurchase-rate">95%</div>
              <div class="repurchase-label">재구매 의사</div>
            </div>
          </div>

          <!-- 4-Dimension Metric Bars -->
          <div class="metric-bars-grid">
            <div class="metric-item">
              <div class="metric-label-row">
                <span>맛 & 풍미</span>
                <span style="color:#0066FF;">4.9</span>
              </div>
              <div class="metric-track">
                <div class="metric-fill" style="width: 98%;"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label-row">
                <span>크림 양</span>
                <span style="color:#0066FF;">4.9</span>
              </div>
              <div class="metric-track">
                <div class="metric-fill" style="width: 98%;"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label-row">
                <span>가성비</span>
                <span style="color:#0066FF;">4.8</span>
              </div>
              <div class="metric-track">
                <div class="metric-fill" style="width: 96%;"></div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label-row">
                <span>재구매율</span>
                <span style="color:#0066FF;">4.9</span>
              </div>
              <div class="metric-track">
                <div class="metric-fill" style="width: 98%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Review Feed Title -->
        <div class="review-feed-title">
          <span>구매자 솔직 포토리뷰 (520)</span>
          <span style="font-size:22px; color:#0066FF; font-weight:700;">최신순 ▾</span>
        </div>

        <!-- Review 1 -->
        <div class="review-bubble">
          <div class="reviewer-row">
            <div class="reviewer-user">
              <div class="user-avatar-circle">🍰</div>
              <div class="user-meta">
                <span class="user-name-txt">디저트덕후 <span class="badge-verified">내돈내산 인증</span></span>
                <span style="font-size:20px; color:#F59E0B; font-weight:700;">★★★★★ 5.0</span>
              </div>
            </div>
            <span style="font-size:20px; color:#94A3B8;">1일 전</span>
          </div>
          <p class="review-text-p">
            "크림이 빵 끝까지 빈틈없이 꽉 차 있어요! 식물성 특유의 미끌거림 없이 순우유 본연의 고소함이 제대로 살아있습니다. 살짝 얼려 먹으면 아이스크림 뺨치네요!"
          </p>
          <div class="review-bottom-row">
            <span>태그: #생크림폭탄 #재구매확정</span>
            <span style="color:#0066FF;">👍 42명에게 도움됨</span>
          </div>
        </div>

        <!-- Review 2 -->
        <div class="review-bubble">
          <div class="reviewer-row">
            <div class="reviewer-user">
              <div class="user-avatar-circle">🏃</div>
              <div class="user-meta">
                <span class="user-name-txt">신상얼리어답터 <span class="badge-verified">영수증 인증</span></span>
                <span style="font-size:20px; color:#F59E0B; font-weight:700;">★★★★★ 5.0</span>
              </div>
            </div>
            <span style="font-size:20px; color:#94A3B8;">3일 전</span>
          </div>
          <p class="review-text-p">
            "퇴근길 CU에서 마지막 남은 1개 겨우 구했습니다. 2,900원에 이 정도 퀄리티면 개인 베이커리 5천원짜리보다 훌륭하네요. 무조건 재구매합니다!"
          </p>
          <div class="review-bottom-row">
            <span>태그: #품절대란 #가성비최고</span>
            <span style="color:#0066FF;">👍 29명에게 도움됨</span>
          </div>
        </div>

        <!-- Floating Write Button -->
        <div class="floating-write-bar">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          <span>나도 솔직 리뷰 남기기 (+50P)</span>
        </div>
      </div>

      <!-- In-App Bottom Navigation -->
      <div class="app-bottom-nav">
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>홈</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="14" width="7" height="7" rx="2"/>
            <rect x="3" y="14" width="7" height="7" rx="2"/>
          </svg>
          <span>카테고리</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>행사소식</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
          <span>랭킹</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>MY</span>
        </div>
        <div class="home-indicator"></div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Screenshot 4 HTML: 실시간 랭킹 & 꿀조합 레시피
const screen4HTML = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>신상픽 - 실시간 랭킹 & 꿀조합 레시피</title>
  <style>
    ${commonStyles}

    .app-header {
      padding: 16px 32px 0 32px;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid #F1F5F9;
    }

    .ranking-tabs-top {
      display: flex;
      gap: 32px;
      border-bottom: 2px solid transparent;
    }

    .ranking-main-tab {
      font-size: 32px;
      font-weight: 850;
      color: #94A3B8;
      padding-bottom: 16px;
      position: relative;
    }

    .ranking-main-tab.active {
      color: #0F172A;
    }

    .ranking-main-tab.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 4px;
      background: #0066FF;
      border-radius: 9999px;
    }

    /* Sub Filters */
    .subfilter-row {
      display: flex;
      gap: 12px;
      padding: 16px 32px;
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
    }

    .subfilter-pill {
      padding: 8px 20px;
      border-radius: 9999px;
      font-size: 22px;
      font-weight: 700;
      background: #F1F5F9;
      color: #64748B;
    }

    .subfilter-pill.active {
      background: #EFF6FF;
      color: #0066FF;
      border: 1px solid #BFDBFE;
    }

    /* Podium List */
    .ranking-list {
      padding: 18px 32px 10px 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .rank-card {
      background: #FFFFFF;
      border-radius: 24px;
      padding: 20px 24px;
      border: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
    }

    .rank-number-box {
      width: 50px;
      font-size: 34px;
      font-weight: 900;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .rank-1 { color: #EAB308; }
    .rank-2 { color: #94A3B8; }
    .rank-3 { color: #D97706; }

    .rank-shift {
      font-size: 16px;
      font-weight: 800;
      margin-top: 2px;
    }
    .shift-up { color: #EF4444; }
    .shift-same { color: #94A3B8; }
    .shift-down { color: #3B82F6; }

    .rank-thumb {
      width: 100px;
      height: 100px;
      border-radius: 18px;
      background: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .rank-thumb img {
      width: 85%;
      height: 85%;
      object-fit: contain;
    }

    .rank-info {
      flex: 1;
    }

    .rank-brand-txt {
      font-size: 20px;
      font-weight: 700;
      color: #64748B;
    }

    .rank-name-txt {
      font-size: 26px;
      font-weight: 850;
      color: #0F172A;
      margin: 4px 0;
    }

    .rank-meta-row {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 20px;
      font-weight: 700;
    }

    /* Modisumer Recipes Section */
    .recipe-section-head {
      padding: 16px 32px 12px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .recipe-sec-title {
      font-size: 30px;
      font-weight: 850;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .recipe-cards-row {
      display: flex;
      gap: 18px;
      padding: 0 32px 20px 32px;
      overflow: hidden;
    }

    .recipe-card {
      flex: 1;
      background: #FFFFFF;
      border-radius: 24px;
      padding: 22px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
      display: flex;
      flex-direction: column;
    }

    .recipe-img-box {
      width: 100%;
      height: 170px;
      border-radius: 18px;
      background: #EFF6FF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60px;
      margin-bottom: 14px;
    }

    .recipe-tag-badge {
      display: inline-flex;
      background: #FEF3C7;
      color: #B45309;
      font-size: 18px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      width: fit-content;
      margin-bottom: 8px;
    }

    .recipe-title-txt {
      font-size: 24px;
      font-weight: 850;
      color: #0F172A;
      line-height: 1.3;
      margin-bottom: 10px;
    }

    .recipe-bottom-likes {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 700;
      color: #EF4444;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>

  <!-- Top Banner -->
  <div class="header-banner">
    <div class="pill-badge">🏆 RANKING & RECIPE · 신상 트렌드</div>
    <h1 class="main-title">
      요즘 가장 핫한 신상은?<br>
      <span class="highlight">실시간 랭킹 & 꿀조합</span>
    </h1>
    <p class="sub-title">주간 베스트 신상 차트와 모디슈머 인기 레시피 추천</p>
  </div>

  <!-- iPhone 16 Pro Frame -->
  <div class="device-mockup">
    <div class="screen-inner">
      <div class="dynamic-island">
        <div class="island-camera"></div>
      </div>

      <!-- iOS Status Bar -->
      <div class="status-bar">
        <span class="status-time">9:41</span>
        <div class="status-icons">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 17h3v4H2v-4zm6-5h3v9H8v-9zm6-5h3v14h-3V7zm6-5h3v19h-3V2z"/>
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
            <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
          </svg>
          <svg width="34" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <rect x="2" y="6" width="18" height="12" rx="3"/>
            <path d="M22 10v4"/>
            <rect x="4" y="8" width="12" height="8" rx="1.5" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <!-- In-App Content -->
      <div class="app-content">
        <!-- Header -->
        <div class="app-header">
          <div class="ranking-tabs-top">
            <div class="ranking-main-tab active">실시간 신상 랭킹</div>
            <div class="ranking-main-tab">꿀조합 레시피</div>
          </div>
        </div>

        <!-- Sub Filters -->
        <div class="subfilter-row">
          <div class="subfilter-pill active">주간 종합 TOP 🏆</div>
          <div class="subfilter-pill">편의점 신상 🏪</div>
          <div class="subfilter-pill">급상승 🔥</div>
          <div class="subfilter-pill">평점순 ⭐</div>
        </div>

        <!-- Ranking List -->
        <div class="ranking-list">
          <!-- Rank 1 -->
          <div class="rank-card">
            <div class="rank-number-box">
              <span class="rank-1">1</span>
              <span class="rank-shift shift-same">━</span>
            </div>
            <div class="rank-thumb">
              <img src="https://tqklhszfkvzk6518638.edge.naverncp.com/product/8801753108478_4.png" alt="연세우유">
            </div>
            <div class="rank-info">
              <div class="rank-brand-txt">CU 단독 · 베이커리</div>
              <div class="rank-name-txt">연세우유 우유생크림빵</div>
              <div class="rank-meta-row">
                <span style="color:#F59E0B;">★ 4.9</span>
                <span style="color:#64748B;">검색 4.5만회</span>
                <span style="color:#0066FF;">재구매 95%</span>
              </div>
            </div>
          </div>

          <!-- Rank 2 -->
          <div class="rank-card">
            <div class="rank-number-box">
              <span class="rank-2">2</span>
              <span class="rank-shift shift-up">▲ 2</span>
            </div>
            <div class="rank-thumb">
              <img src="https://shopping-phinf.pstatic.net/main_9118948/91189484597.1.jpg?type=f300" alt="복숭아">
            </div>
            <div class="rank-info">
              <div class="rank-brand-txt">산지직송 · 과일</div>
              <div class="rank-name-txt">햇사레 프리미엄 꿀복숭아</div>
              <div class="rank-meta-row">
                <span style="color:#F59E0B;">★ 4.9</span>
                <span style="color:#64748B;">검색 3.8만회</span>
                <span style="color:#0066FF;">당도선별</span>
              </div>
            </div>
          </div>

          <!-- Rank 3 -->
          <div class="rank-card">
            <div class="rank-number-box">
              <span class="rank-3">3</span>
              <span class="rank-shift shift-up">▲ 1</span>
            </div>
            <div class="rank-thumb">
              <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80" alt="코카콜라">
            </div>
            <div class="rank-info">
              <div class="rank-brand-txt">코카콜라 · 음료</div>
              <div class="rank-name-txt">코카콜라 제로 레몬 500ml</div>
              <div class="rank-meta-row">
                <span style="color:#F59E0B;">★ 4.8</span>
                <span style="color:#64748B;">검색 3.1만회</span>
                <span style="color:#EF4444;">1+1 행사</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modisumer Recipes -->
        <div class="recipe-section-head">
          <div class="recipe-sec-title">
            <span>💡 SNS 화제의 모디슈머 꿀조합</span>
          </div>
          <span style="font-size:22px; color:#0066FF; font-weight:700;">레시피 더보기 &gt;</span>
        </div>

        <div class="recipe-cards-row">
          <!-- Recipe 1 -->
          <div class="recipe-card">
            <div class="recipe-img-box">🍜🧀</div>
            <div class="recipe-tag-badge">⏱ 조리 5분 · 초간단</div>
            <div class="recipe-title-txt">불닭 까르보볶음밥 + 스트링치즈 녹여먹기</div>
            <div class="recipe-bottom-likes">
              <span>❤️ 1,480명 저장</span>
              <span style="color:#0F172A;">★ 4.9</span>
            </div>
          </div>

          <!-- Recipe 2 -->
          <div class="recipe-card">
            <div class="recipe-img-box">🍌☕</div>
            <div class="recipe-tag-badge">⏱ 조리 1분 · 홈카페</div>
            <div class="recipe-title-txt">바나나맛우유 + 에스프레소 샷 바나나라떼</div>
            <div class="recipe-bottom-likes">
              <span>❤️ 1,120명 저장</span>
              <span style="color:#0F172A;">★ 4.8</span>
            </div>
          </div>
        </div>
      </div>

      <!-- In-App Bottom Navigation -->
      <div class="app-bottom-nav">
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>홈</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="3" width="7" height="7" rx="2"/>
            <rect x="14" y="14" width="7" height="7" rx="2"/>
            <rect x="3" y="14" width="7" height="7" rx="2"/>
          </svg>
          <span>카테고리</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>행사소식</span>
        </div>
        <div class="nav-item active">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
            <path d="M4 22h16"/>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
          </svg>
          <span>랭킹</span>
        </div>
        <div class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>MY</span>
        </div>
        <div class="home-indicator"></div>
      </div>
    </div>
  </div>
</body>
</html>
`;

const screens = [
  {
    id: '1_실시간신상',
    engName: 'AppStore_01_Discover',
    html: screen1HTML,
    title: '신상 발견 & 실시간 피드'
  },
  {
    id: '2_행사캘린더',
    engName: 'AppStore_02_SaleEvents',
    html: screen2HTML,
    title: '편의점 1+1 / 2+1 행사 캘린더'
  },
  {
    id: '3_솔직리뷰',
    engName: 'AppStore_03_Reviews',
    html: screen3HTML,
    title: '100% 솔직 리뷰 & 별점 분석'
  },
  {
    id: '4_랭킹꿀조합',
    engName: 'AppStore_04_RankingRecipes',
    html: screen4HTML,
    title: '실시간 랭킹 & 꿀조합 레시피'
  }
];

async function generateAppStoreScreenshots() {
  console.log(`Using browser executable: ${executablePath}`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  console.log('Generating 4 Apple App Store screenshots (1290 x 2796 px)...');

  for (let i = 0; i < screens.length; i++) {
    const s = screens[i];
    console.log(`[${i + 1}/4] Rendering ${s.title}...`);

    const page = await browser.newPage();
    // Apple 6.7" Super Retina XDR standard size: 1290 x 2796 px
    await page.setViewport({
      width: 1290,
      height: 2796,
      deviceScaleFactor: 1
    });

    await page.setContent(s.html, { waitUntil: 'networkidle0' });

    // Output paths
    const desktopKorPath = path.join(desktopDir, `신상픽_앱스토어_${s.id}.png`);
    const desktopEngPath = path.join(desktopDir, `${s.engName}.png`);
    const repoPath = path.join(repoScreenshotsDir, `${s.engName}.png`);

    // Capture exact PNG screenshot
    await page.screenshot({
      path: desktopKorPath,
      type: 'png'
    });

    // Copy to English filename and repo public directory
    fs.copyFileSync(desktopKorPath, desktopEngPath);
    fs.copyFileSync(desktopKorPath, repoPath);

    console.log(` -> Saved to Desktop: ${desktopKorPath}`);
    console.log(` -> Saved to Desktop: ${desktopEngPath}`);
    console.log(` -> Saved to Project: ${repoPath}`);

    await page.close();
  }

  await browser.close();
  console.log('🎉 Successfully created all 4 App Store screenshots on the Desktop!');
}

generateAppStoreScreenshots().catch((err) => {
  console.error('Error generating screenshots:', err);
  process.exit(1);
});
