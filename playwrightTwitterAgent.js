require('dotenv').config();
const { chromium } = require('playwright');
const { sendTelegramMessage } = require('./telegramNotify');

const getCookiesFromEnv = () => {
  return process.env.TWITTER_COOKIES.split('; ').map(c => {
    const [name, ...rest] = c.split('=');
    const value = rest.join('=');
    return { name, value, domain: '.x.com', path: '/' };
  });
};

async function simulateHumanBehavior(page) {
  await page.waitForTimeout(Math.random() * 2000 + 1000); // 1-3 Sekunden warten
  await page.mouse.move(Math.random() * 800, Math.random() * 600);
  await page.evaluate(() => window.scrollBy(0, 300));
}

async function twitterAgent() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const cookies = getCookiesFromEnv();
  await context.addCookies(cookies);

  const page = await context.newPage();
  await page.goto('https://x.com/home');

  const isLoggedIn = await page.locator('[data-testid="primaryColumn"]').count() > 0;
  await sendTelegramMessage(`Playwright Twitter Agent: Eingeloggt: ${isLoggedIn}`);

  if (!isLoggedIn) {
    await sendTelegramMessage('❌ Cookies abgelaufen - bitte neu extrahieren!');
    await browser.close();
    return;
  }

  // Tweet posten
  await page.locator('[data-testid="tweetTextarea_0"]').fill('Test via Playwright Agent 🚀');
  await simulateHumanBehavior(page);
  await page.locator('[data-testid="tweetButton"]').click();

  // Warte und lese Tweets
  await page.waitForTimeout(2000);
  const tweets = await page.locator('[data-testid="tweet"]').all();
  await sendTelegramMessage(`Playwright Twitter Agent: ${tweets.length} Tweets gefunden.`);

  await browser.close();
}

(async () => {
  try {
    await twitterAgent();
  } catch (err) {
    await sendTelegramMessage('Playwright Twitter Agent Fehler: ' + err.message);
  }
})();
