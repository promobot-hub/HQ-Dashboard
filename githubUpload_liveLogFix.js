const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

async function uploadLiveLogFix() {
  if (!token) {
    throw new Error('GitHub Token nicht gefunden in ENV');
  }

  const filePath = './hq-dashboard/components/LiveLogViewer.tsx';
  const content = fs.readFileSync(filePath);
  const contentStr = content.toString('base64');

  // Aktuelles File holen, um SHA zu bekommen
  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/components/LiveLogViewer.tsx?ref=${branch}`;
  const getResp = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!getResp.ok) {
    const err = await getResp.text();
    throw new Error(`Datei-Abfrage fehlgeschlagen: ${err}`);
  }
  const fileData = await getResp.json();
  const sha = fileData.sha;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/components/LiveLogViewer.tsx`;

  const body = {
    message: 'Fix: Typisierung und State-Update im LiveLogViewer',
    content: contentStr,
    sha: sha,
    branch: branch
  };

  const resp = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Fehler beim Upload: ${err}`);
  }

  const data = await resp.json();
  return data;
}

(async () => {
  try {
    const result = await uploadLiveLogFix();
    console.log('Fix Commit erfolgreich:', result.content.path);
  } catch (error) {
    console.error('Fehler beim Fix Upload:', error.message);
  }
})();
