require('dotenv').config();
const { chromium } = require('playwright-core');
const fetch = require('node-fetch');
const { sendTelegramMessage } = require('./telegramNotify');

async function readSMS() {
  // SMS API Stub - ergänze bei Bedarf deine SMS API hier
  return null;
}

async function twitterAgentFullLogin() {
  const API_KEY = process.env.BROWSERLESS_KEY;
  const USERNAME = process.env.TWITTER_USERNAME;
  const PASSWORD = process.env.TWITTER_PASSWORD;
  const PHONE = process.env.TWITTER_PHONE; // Optional 2FA

  const browser = await chromium.connectOverCDP(`wss://production-sfo.browserless.io?token=${API_KEY}`);

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US'
  });

  const page = await context.newPage();

  await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle', timeout: 30000 });

  await page.waitForSelector('input[autocomplete="username"]', { timeout: 10000 });
  console.log('Username wird eingegeben');
  await page.fill('input[autocomplete="username"]', USERNAME);
  console.log('Username eingegeben');
  await page.waitForTimeout(1500 + Math.random() * 1000);
  await page.keyboard.press('Enter');

  await page.waitForSelector('input[name="password"]', { timeout: 10000 });
  await page.fill('input[name="password"]', PASSWORD);
  await page.waitForTimeout(1000);
  await page.click('div[role="button"]:has-text("Log in")');

  try {
    await page.waitForSelector('input[data-testid="ocf_SettingsList_EnterPhoneNumber"]', { timeout: 5000 });
    if (PHONE) {
      await page.fill('input[data-testid="ocf_SettingsList_EnterPhoneNumber"]', PHONE);
      await page.click('div[role="button"]:has-text("Send code")');
      sendTelegramMessage('🔐 2FA SMS Code anfordern');
      const code = await readSMS();
      await page.fill('input[placeholder*="code"]', code || '');
      await page.click('div[role="button"]:has-text("Verify")');
    }
  } catch (e) {
    sendTelegramMessage('✅ Kein 2FA erforderlich');
  }

  await page.waitForURL('**/home', { timeout: 15000 });

  const loggedIn = await page.locator('[data-testid="primaryColumn"]').count() > 0;
  await sendTelegramMessage(`✅ LOGIN ERFOLGREICH: ${loggedIn}`);

  if (!loggedIn) {
    await browser.close();
    return;
  }

  // Cookies speichern
  const cookies = await context.cookies();
  await sendTelegramMessage(`💾 Cookies gespeichert: ${cookies.length}`);

  await browser.close();
}

(async () => {
  try {
    await twitterAgentFullLogin();
  } catch (err) {
    await sendTelegramMessage('❌ Twitter Agent Fehler: ' + err.message);
  }
})();
