const { TwitterApi } = require('twitter-api-v2');
const { sendTelegramMessage } = require('./telegramNotify');
const { startSimpleProgressMonitor, reportProgress } = require('./progressSimpleMonitor');

// TODO: Twitter API Keys hier ergänzen
const client = new TwitterApi({
  appKey: 'YOUR_APP_KEY',
  appSecret: 'YOUR_APP_SECRET',
  accessToken: 'USER_ACCESS_TOKEN',
  accessSecret: 'USER_ACCESS_SECRET',
});

async function login() {
  // Twitter API nutzt Token, daher direkter Login entf21t
  try {
    const user = await client.currentUser();
    await sendTelegramMessage(`TwitterAPI: Angemeldet als ${user.screen_name}`);
    return true;
  } catch (err) {
    await sendTelegramMessage(`TwitterAPI Loginfehler: ${err.message}`);
    return false;
  }
}

async function readTweets() {
  try {
    const timeline = await client.v2.homeTimeline();
    await sendTelegramMessage(`TwitterAPI: ${timeline.data.length} Tweets abgerufen.`);
    return timeline.data;
  } catch (err) {
    await sendTelegramMessage(`TwitterAPI Tweets lesen Fehler: ${err.message}`);
    return [];
  }
}

// Weitere Funktionen schreiben, liken, retweeten, bookmarken, folgen, entfolgen

async function start() {
  startSimpleProgressMonitor();

  const loggedIn = await login();
  if (!loggedIn) return;

  const tweets = await readTweets();
  reportProgress();
  // Simpler Loop für weitere Aktionen hier einbauen
}

module.exports = { start };
