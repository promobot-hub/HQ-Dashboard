require('dotenv').config();
const { chromium } = require('playwright');
const { sendTelegramMessage } = require('./telegramNotify');

async function twitterAgent() {
  // Remote Browser verbinden
  const browser = await chromium.connectOverCDP(process.env.REMOTE_BROWSER_WS_ENDPOINT);
  const context = await browser.newContext();

  const cookies = process.env.TWITTER_COOKIES.split('; ').map(c => {
    const [name, ...rest] = c.split('=');
    const value = rest.join('=');
    return { name, value, domain: '.x.com', path: '/' };
  });
  await context.addCookies(cookies);

  const page = await context.newPage();
  await page.goto('https://x.com/home');

  const isLoggedIn = await page.locator('[data-testid="primaryColumn"]').count() > 0;
  await sendTelegramMessage(`Remote Playwright Twitter Agent: Eingeloggt: ${isLoggedIn}`);
  if (!isLoggedIn) {
    await sendTelegramMessage('❌ Cookies abgelaufen - bitte neu extrahieren!');
    await browser.close();
    return;
  }

  // Tweet posten
  await page.locator('[data-testid="tweetTextarea_0"]').fill('Test via Remote Agent 🚀');
  await page.locator('[data-testid="tweetButton"]').click();
  await page.waitForTimeout(2000);

  const tweets = await page.locator('[data-testid="tweet"]').all();
  await sendTelegramMessage(`Remote Playwright Twitter Agent: ${tweets.length} Tweets gefunden.`);

  await browser.close();
}

(async () => {
  try {
    await twitterAgent();
  } catch (err) {
    await sendTelegramMessage('Remote Playwright Twitter Agent Fehler: ' + err.message);
  }
})();
