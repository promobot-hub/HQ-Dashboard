const { exec } = require('child_process');
const { sendTelegramMessage } = require('./telegramNotify');

async function runSnScrape(query) {
  return new Promise((resolve, reject) => {
    const cmd = `snscrape --jsonltwitter-search "${query}" --max 5`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
        return;
      }
      const lines = stdout.trim().split('\n');
      const tweets = lines.map(line => JSON.parse(line));
      resolve(tweets);
    });
  });
}

async function start() {
  const query = 'from:Alex_pengu_1337';

  try {
    const tweets = await runSnScrape(query);
    await sendTelegramMessage(`SnScrape: ${tweets.length} Tweets gefunden.`);
  } catch (err) {
    await sendTelegramMessage(`SnScrape Fehler: ${err}`);
  }
}

module.exports = { start };
