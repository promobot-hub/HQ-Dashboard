require('dotenv').config();
const { exec } = require('child_process');
const { sendTelegramMessage } = require('./telegramNotify');

async function listRepos() {
  return new Promise((resolve, reject) => {
    exec('gh repo list --json name,visibility,description --limit 100', (error, stdout, stderr) => {
      if (error) {
        sendTelegramMessage('GitHub Skill exec error: ' + (stderr || error.message));
        reject(stderr || error.message);
        return;
      }
      sendTelegramMessage('GitHub Skill raw stdout length: ' + stdout.length);
      sendTelegramMessage('GitHub Skill raw stdout preview: ' + stdout.substring(0, 200));
      try {
        const repos = JSON.parse(stdout);
        resolve(repos);
      } catch (e) {
        sendTelegramMessage('GitHub Skill JSON parse error: ' + e.message);
        reject(e.message);
      }
    });
  });
}

async function githubAgent() {
  try {
    const repos = await listRepos();
    sendTelegramMessage(`GitHub: ${repos.length} Repositories gefunden.`);
    for (const repo of repos) {
      sendTelegramMessage(`- ${repo.name} (${repo.visibility}): ${repo.description || 'Keine Beschreibung'}`);
    }
  } catch (err) {
    sendTelegramMessage('GitHub Skill Fehler: ' + err);
  }
}

module.exports = { githubAgent };

(async () => {
  await githubAgent();
})();
