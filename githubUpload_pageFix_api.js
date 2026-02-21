const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

async function uploadPageFix() {
  if (!token) {
    throw new Error('GitHub Token nicht gefunden in ENV');
  }

  const filePath = './hq-dashboard/app/page.tsx';
  const content = fs.readFileSync(filePath);
  const contentBase64 = content.toString('base64');

  // Prüfe, ob Datei bereits existiert, hole SHA
  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/app/page.tsx?ref=${branch}`;
  const getResp = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  let sha = null;

  if (getResp.ok) {
    const fileData = await getResp.json();
    sha = fileData.sha;
  } else if (getResp.status !== 404) {
    throw new Error(`Fehler beim Abrufen der Datensatz-Metadaten: ${await getResp.text()}`);
  }

  // Upload der Datei
  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/app/page.tsx`;
  const putBody = {
    message: 'API Fix Commit für page.tsx',
    content: contentBase64,
    branch: branch,
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

  return await putResp.json();
}

(async () => {
  try {
    const result = await uploadPageFix();
    console.log('API Upload erfolgreich:', result.content.path);
  } catch (error) {
    console.error('API Upload Fehler:', error.message);
  }
})();
