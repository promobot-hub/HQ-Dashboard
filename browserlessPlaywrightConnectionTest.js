require('dotenv').config();
const { chromium } = require('playwright-core');

(async () => {
  console.log('Starte Browserless Connection Test mit API Key');
  console.log('API Key:', process.env.REMOTE_BROWSER_API_KEY?.slice(0, 10) + '...');
  
  const browser = await chromium.connectOverCDP(`wss://production-sfo.browserless.io?token=${process.env.REMOTE_BROWSER_API_KEY}`);
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://example.com');

  console.log('Seite geladen, Title:', await page.title());
  
  await browser.close();
})();
