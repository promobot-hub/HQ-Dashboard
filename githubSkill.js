require('dotenv').config();
const { exec } = require('child_process');
const { sendTelegramMessage } = require('./telegramNotify');

async function listRepos() {
  return new Promise((resolve, reject) => {
    exec('gh repo list --json name,visibility,description --limit 100', (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
        return;
      }
      try {
        const repos = JSON.parse(stdout);
        resolve(repos);
      } catch (e) {
        reject(e.message);
      }
    });
  });
}

async function githubAgent() {
  try {
    const repos = await listRepos();
    await sendTelegramMessage(`GitHub: ${repos.length} Repositories gefunden.`);
    for (const repo of repos) {
      await sendTelegramMessage(`- ${repo.name} (${repo.visibility}): ${repo.description || 'Keine Beschreibung'}`);
    }
  } catch (err) {
    await sendTelegramMessage('GitHub Skill Fehler: ' + err.message);
  }
}

module.exports = { githubAgent };

(async () => {
  await githubAgent();
})();
