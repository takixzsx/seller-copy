import { chromium } from 'playwright-core';

const EXEC = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:8531/%EC%85%80%EB%9F%AC%EC%B9%B4%ED%94%BC%20%EC%B9%B4%EB%93%9C%EB%89%B4%EC%8A%A4.dc.html';

const browser = await chromium.launch({ executablePath: EXEC, headless: true });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'networkidle' });

const slides = await page.$$('x-dc > div > div');
console.log('slides found:', slides.length);
for (let i = 0; i < slides.length; i++) {
  await slides[i].screenshot({ path: `dc_slide_${i + 1}.png` });
  console.log('saved slide', i + 1);
}
await browser.close();
