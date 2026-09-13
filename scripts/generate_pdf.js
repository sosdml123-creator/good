import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
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
    throw new Error('No Chrome or Edge browser executable found.');
  }

  console.log(`Using browser: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // Set viewport to 16:9 1920x1080
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  const htmlPath = path.resolve(__dirname, 'presentation_print.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  
  console.log(`Loading HTML from: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Output paths
  const docsDir = path.resolve(__dirname, '..', 'docs');
  const publicDocsDir = path.resolve(__dirname, '..', 'public', 'docs');
  const desktopDir = 'C:\\Users\\did\\Desktop';

  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(publicDocsDir)) fs.mkdirSync(publicDocsDir, { recursive: true });

  const targetDocsPdf = path.join(docsDir, 'sinsangpick_presentation.pdf');
  const targetPublicPdf = path.join(publicDocsDir, 'sinsangpick_presentation.pdf');
  const targetDesktopKorPdf = path.join(desktopDir, '신상픽_앱소개서_기획서.pdf');
  const targetDesktopEngPdf = path.join(desktopDir, 'sinsangpick_presentation.pdf');

  console.log('Rendering PDF...');
  await page.pdf({
    path: targetDocsPdf,
    width: '297mm',
    height: '167mm',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  // Copy to public/docs and Desktop
  fs.copyFileSync(targetDocsPdf, targetPublicPdf);
  fs.copyFileSync(targetDocsPdf, targetDesktopKorPdf);
  fs.copyFileSync(targetDocsPdf, targetDesktopEngPdf);

  console.log('PDF generated successfully!');
  console.log(`- Project: ${targetDocsPdf}`);
  console.log(`- Public: ${targetPublicPdf}`);
  console.log(`- Desktop: ${targetDesktopKorPdf}`);
  console.log(`- Desktop: ${targetDesktopEngPdf}`);

  await browser.close();
}

generatePDF().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
