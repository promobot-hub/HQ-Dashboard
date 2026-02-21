const fetch = require('node-fetch');
const { sendTelegramMessage } = require('./telegramNotify');

const API_KEY = process.env.REMOTE_BROWSER_API_KEY;
const SESSION_ID = 'twitter-fixed-' + Date.now();

// Komplettes Cookiearray wie zuvor erwartet vom User an konstanter Stelle
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

async function twitterAgentFixed() {
  // Session erstellen
  await fetch(`https://production-sfo.browserless.io/session?token=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: SESSION_ID, persistSession: true })
  });

  // Neue Query
  const bqlQuery = ` {
    goto(url: "https://x.com/home", waitUntil: "networkidle", timeout: 30000) { status }
    title: title { text }
    mainContent: queryOne(selector: "div[role='main']") { exists innerText }
    tweetTest: queryAll(selector: "[data-testid='tweet']") { count }
    loggedIn: queryOne(selector: "div[role='main']") { exists }
  }`;

  try {
    const response = await fetch(
      `https://production-sfo.browserless.io/chromium?token=${API_KEY}&session=${SESSION_ID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ html: 1, gotoOptions: { waitUntil: 'networkidle', timeout: 30000 }, args: [
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        ], bql: bqlQuery })
      }
    );

    const result = await response.json();
    const data = result.data || {};

    await sendTelegramMessage(`✅ Title: ${data.title?.text || 'N/A'}`);
    await sendTelegramMessage(`✅ Main Content Exists: ${data.mainContent?.exists || false}`);
    await sendTelegramMessage(`✅ Tweets Found: ${data.tweetTest?.count || 0}`);
    await sendTelegramMessage(`✅ Logged In: ${data.loggedIn?.exists || false}`);

    return { sessionId: SESSION_ID, status: data };
  } catch (error) {
    await sendTelegramMessage('❌ Browserless Error: ' + error.message);
  }
}

// Testaufruf

twitterAgentFixed().catch(async e => {
  await sendTelegramMessage('❌ Browserless Twitter Agent Fehler: ' + e.message);
});
