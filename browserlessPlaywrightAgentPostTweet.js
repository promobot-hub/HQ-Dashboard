require('dotenv').config();
const { chromium } = require('playwright-core');
const { sendTelegramMessage } = require('./telegramNotify');

const twitterCookies = [
  { name: 'auth_token', value: '37f701180b39f81f27dc9fe509a6ee597e2d138e', domain: '.x.com', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' },
  { name: 'ct0', value: 'eceaca7264a49ddf593abd9224ae8f8f4ebe19616d97b24e02db0b371659e2487b1c8772bbd62ef7fe2ca2b8601711f68304c2c45e0ff5aa6206d71d21275f916f51456db0f40ab6c6aacee857dad1e8', domain: '.x.com', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' },
  { name: '_twitter_sess', value: 'BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCBzCVnicAToMY3NyZl9p%250AZCIlZTYzZGU2OTgxMDc5NTBlZTQyMTU4ZmZmYjgyOWY0NWE6B2lkIiUxYTBl%250AMDJmZWNjNWFhYmExNTAyZWM2NDlmNmVkZmJjZQ%253D%253D--094bdbf7ce32a1afe6a00e3bc1464f7ff332c096', domain: '.x.com', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' },
  { name: 'kdt', value: '6nXKeef88iAPaMqQxpNYh5EPIUTpdPCxROFWbpdy', domain: '.x.com', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' },
  { name: 'twid', value: 'u%3D2024635217802113024', domain: '.x.com', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' },
  { name: 'guest_id', value: 'v1%3A177154547059709449', domain: '.x.com', path: '/', secure: true, httpOnly: false, sameSite: 'Lax' },
  { name: '_cuid', value: '6062a7ccea634551be6b140c189351da', domain: '.x.com', path: '/', secure: true, httpOnly: false, sameSite: 'Lax' },
  { name: 'd_prefs', value: 'MToxLGNvbnNlbnRfdmVyc2lvbjoyLHRleHRfdmVyc2lvbjoxMDAw', domain: '.x.com', path: '/', secure: true, httpOnly: false, sameSite: 'Lax' },
  { name: 'lang', value: 'en', domain: '.x.com', path: '/', secure: true, httpOnly: false, sameSite: 'Lax' }
];

async function twitterAgentPostTweet() {
  const browser = await chromium.connectOverCDP(`wss://production-sfo.browserless.io?token=${process.env.REMOTE_BROWSER_API_KEY}`);
  const context = await browser.newContext();
  await context.addCookies(twitterCookies);

  const page = await context.newPage();
  await page.goto('https://x.com/home', { waitUntil: 'networkidle' });

  const loggedIn = await page.locator("[data-testid='primaryColumn']").count();
  console.log('✅ Eingeloggt:', loggedIn > 0);

  await sendTelegramMessage(`Playwright Twitter Agent: Eingeloggt: ${loggedIn > 0}`);

  if (!loggedIn) {
    await browser.close();
    return;
  }

  await page.locator('[data-testid="tweetTextarea_0"]').fill('hello world');
  await page.locator('[data-testid="tweetButton"]').click();

  await page.waitForTimeout(3000); // Kurze Pause zum Abschluss

  await sendTelegramMessage('Twitter Agent: Tweet "hello world" wurde gepostet.');

  await browser.close();
}

(async () => {
  try {
    await twitterAgentPostTweet();
  } catch (err) {
    await sendTelegramMessage('Twitter Agent Fehler: ' + err.message);
  }
})();
