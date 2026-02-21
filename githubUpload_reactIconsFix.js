const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

async function uploadReactIconsFix() {
  if (!token) {
    throw new Error('GitHub Token nicht gefunden in ENV');
  }

  const filePath = './hq-dashboard/package-lock.json';
  const content = fs.readFileSync(filePath);
  const contentStr = content.toString('base64');

  // Prüfe Datei SHA
  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/package-lock.json?ref=${branch}`;
  const getResp = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });

  let sha = null;
  if (getResp.ok) {
    const fileData = await getResp.json();
    sha = fileData.sha;
  } else if (getResp.status !== 404) {
    throw new Error(`Fehler beim Lesen der Dateien Metadaten: ${await getResp.text()}`);
  }

  // Upload
  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/package-lock.json`;
  const putBody = {
    message: 'Fix: Install react-icons and update package-lock.json',
    content: contentStr,
    branch: branch
  };

  if (sha) {
    putBody.sha = sha;
  }

  const putResp = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(putBody)
  });

  if (!putResp.ok) {
    const err = await putResp.text();
    throw new Error(`Upload Fehler: ${err}`);
  }

  return putResp.json();
}

(async () => {
  try {
    const result = await uploadReactIconsFix();
    console.log('Aktualisierung erfolgreich:', result.content.path);
  } catch (error) {
    console.error('Fehler beim Upload:', error.message);
  }
})();
