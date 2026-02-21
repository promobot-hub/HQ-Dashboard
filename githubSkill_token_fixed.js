require('dotenv').config();
const { exec } = require('child_process');
const { sendTelegramMessage } = require('./telegramNotify');

async function listRepos() {
  return new Promise((resolve, reject) => {
    const cmd = 'gh repo list --json name,visibility,description --limit 100';
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        sendTelegramMessage('GitHub Token Skill exec error: ' + (stderr || error.message));
        reject(stderr || error.message);
        return;
      }
      sendTelegramMessage('GitHub Token Skill raw stdout length: ' + stdout.length);
      sendTelegramMessage('GitHub Token Skill raw stdout preview: ' + stdout.substring(0, 200));
      try {
        const repos = JSON.parse(stdout);
        resolve(repos);
      } catch (e) {
        sendTelegramMessage('GitHub Token Skill JSON parse error: ' + e.message);
        reject(e.message);
      }
    });
  });
}

async function githubAgent() {
  try {
    const repos = await listRepos();
    sendTelegramMessage(`GitHub Token: ${repos.length} Repositories gefunden.`);
    for (const repo of repos) {
      sendTelegramMessage(`- ${repo.name} (${repo.visibility}): ${repo.description || 'Keine Beschreibung'}`);
    }
  } catch (err) {
    sendTelegramMessage('GitHub Token Skill Fehler: ' + err);
  }
}

module.exports = { githubAgent };

(async () => {
  await githubAgent();
})();
