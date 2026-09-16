import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve(__dirname, '..', 'public', 'screenshots');

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 3 });

  // 1. HOME SCREEN
  console.log('Capturing Screen 1: Home View...');
  await page.goto('http://localhost:4173');
  await page.evaluate(() => {
    localStorage.setItem('sinsangpick_guest_browse', 'true');
    localStorage.setItem('sinsangpick_permissions_reviewed', 'true');
    localStorage.setItem('sinsangpick_data_version', 'v23_20260916_restore_top_banner');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const banner = document.querySelector('.bg-indigo-600, [class*=\"PushBanner\"]');
    if (banner) banner.style.display = 'none';
    const appContainer = document.querySelector('body > div > div');
    if (appContainer) {
      appContainer.style.paddingTop = '54px';
      appContainer.style.paddingBottom = '24px';
      appContainer.style.boxSizing = 'border-box';
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, 'real_screen_safe_01.png') });
  console.log('Saved real_screen_safe_01.png');

  // 2. SALE NEWS SCREEN
  console.log('Capturing Screen 2: Sale News View...');
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, div, span'));
    const target = elements.find(el => el.textContent && el.textContent.trim() === '행사소식');
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    const banner = document.querySelector('.bg-indigo-600, [class*=\"PushBanner\"]');
    if (banner) banner.style.display = 'none';
    const appContainer = document.querySelector('body > div > div');
    if (appContainer) {
      appContainer.style.paddingTop = '54px';
      appContainer.style.paddingBottom = '24px';
      appContainer.style.boxSizing = 'border-box';
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, 'real_screen_safe_02.png') });
  console.log('Saved real_screen_safe_02.png');

  // 3. PRODUCT DETAIL SCREEN
  console.log('Capturing Screen 3: Product Detail View...');
  // Go to Home first
  await page.evaluate(() => {
    const navs = document.querySelectorAll('nav button');
    if (navs[0]) navs[0].click();
  });
  await new Promise(r => setTimeout(r, 800));
  // Click on Domino Pizza card or popular card
  await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div, button'));
    const card = allDivs.find(d => 
      d.textContent && (d.textContent.includes('치즈폴레') || d.textContent.includes('슈림프')) && d.clientHeight > 180
    );
    if (card) {
      card.click();
    } else {
      const fallback = document.querySelector('main div.cursor-pointer');
      if (fallback) fallback.click();
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    const banner = document.querySelector('.bg-indigo-600, [class*=\"PushBanner\"]');
    if (banner) banner.style.display = 'none';
    const appContainer = document.querySelector('body > div > div');
    if (appContainer) {
      appContainer.style.paddingTop = '54px';
      appContainer.style.paddingBottom = '24px';
      appContainer.style.boxSizing = 'border-box';
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, 'real_screen_safe_03.png') });
  console.log('Saved real_screen_safe_03.png');

  // 4. RANKING SCREEN
  console.log('Capturing Screen 4: Ranking View...');
  await page.evaluate(() => {
    // Close modal if open
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const closeBtn = closeBtns.find(b => b.getAttribute('aria-label') === 'Close' || b.innerHTML.includes('X') || b.querySelector('svg'));
    if (closeBtn) closeBtn.click();

    // Click 3rd nav item (Ranking)
    const navs = document.querySelectorAll('nav button');
    if (navs[2]) navs[2].click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.evaluate(() => {
    const banner = document.querySelector('.bg-indigo-600, [class*=\"PushBanner\"]');
    if (banner) banner.style.display = 'none';
    const appContainer = document.querySelector('body > div > div');
    if (appContainer) {
      appContainer.style.paddingTop = '54px';
      appContainer.style.paddingBottom = '24px';
      appContainer.style.boxSizing = 'border-box';
    }
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, 'real_screen_safe_04.png') });
  console.log('Saved real_screen_safe_04.png');

  await browser.close();
  console.log('All 4 screens safely captured!');
}

captureAll().catch(console.error);
