const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

async function createInitialREADME() {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/README.md`;
  const body = {
    message: 'Initial commit: add README',
    content: Buffer.from('HQ Dashboard initial README').toString('base64'),
    branch: branch
  };

  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const error = await resp.text();
    throw new Error(`README Erstellung fehlgeschlagen: ${error}`);
  }

  const data = await resp.json();
  return data;
}

(async () => {
  try {
    const result = await createInitialREADME();
    console.log('Initial README erstellt:', result.content.path);
  } catch (error) {
    console.error('Fehler bei Initial README:', error.message);
  }
})();
