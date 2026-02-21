require('dotenv').config();
const { chromium } = require('playwright-core');
const { sendTelegramMessage } = require('./telegramNotify');

async function readSMS() {
  return null;
}

async function twitterAgentFinal() {
  const API_KEY = process.env.REMOTE_BROWSER_API_KEY;
  const USERNAME = process.env.TWITTER_USERNAME;
  const PASSWORD = process.env.TWITTER_PASSWORD;
  const PHONE = process.env.TWITTER_PHONE;

  const browser = await chromium.connectOverCDP(`wss://production-sfo.browserless.io?token=${API_KEY}`);

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US'
  });

  const page = await context.newPage();

  await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle', timeout: 60000 });

  await page.waitForSelector('input[name="text"]', { timeout: 45000 });
  await page.fill('input[name="text"]', USERNAME);
  await page.waitForTimeout(1500 + Math.random() * 1000);
  await page.keyboard.press('Enter');

  await page.waitForSelector('input[name="password"]', { timeout: 45000 });
  await page.fill('input[name="password"]', PASSWORD);
  await page.waitForTimeout(1000);
  await page.click('div[role="button"]:has-text("Log in")');

  try {
    await page.waitForSelector('input[data-testid="ocf_SettingsList_EnterPhoneNumber"]', { timeout: 10000 });
    if (PHONE) {
      await page.fill('input[data-testid="ocf_SettingsList_EnterPhoneNumber"]', PHONE);
      await page.click('div[role="button"]:has-text("Send code")');
      await sendTelegramMessage('🔐 2FA SMS Code anfordern');
      const code = await readSMS();
      await page.fill('input[placeholder*="code"]', code || '');
      await page.click('div[role="button"]:has-text("Verify")');
    }
  } catch {
    await sendTelegramMessage('✅ Kein 2FA erforderlich');
  }

  await page.waitForURL('**/home', { timeout: 60000 });

  const loggedIn = await page.locator('[data-testid="primaryColumn"]').count() > 0;
  await sendTelegramMessage(`✅ LOGIN ERFOLGREICH: ${loggedIn}`);
  
  if (!loggedIn) {
    await browser.close();
    return;
  }

  // Tweet posten
  await page.locator('[data-testid="tweetTextarea_0"]').fill('hello world');
  await page.locator('[data-testid="tweetButton"]').click();
  await page.waitForTimeout(3000);
  await sendTelegramMessage('Twitter: Tweet "hello world" wurde gepostet.');

  // Cookies speichern
  const cookies = await context.cookies();
  await sendTelegramMessage(`💾 Cookies gespeichert: ${cookies.length}`);

  await browser.close();
}

(async () => {
  try {
    await twitterAgentFinal();
  } catch (err) {
    await sendTelegramMessage('Twitter Agent Fehler: ' + err.message);
  }
})();
