const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const pathFile = 'package.json';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

const updatedContent = JSON.stringify({
  "name": "hq-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.3.6",
    "next-themes": "^0.2.1",
    "@headlessui/react": "^1.7.15",
    "react-icons": "^4.10.0",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}, null, 2);

async function updatePackageJson() {
  if (!token) {
    throw new Error("GitHub Token nicht gefunden in ENV");
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${pathFile}`;

  // Holen Sie das SHA für Datei-Update
  const respGet = await fetch(`${url}?ref=${branch}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!respGet.ok) {
    const err = await respGet.text();
    throw new Error("Error beim Lesen der package.json Metadata: " + err);
  }

  const jsonData = await respGet.json();

  // Updating the package.json content
  const body = {
    message: 'FIX: Add stable chart.js and react-chartjs-2 dependencies',
    content: Buffer.from(updatedContent).toString('base64'),
    sha: jsonData.sha,
    branch: branch
  };

  const respPut = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!respPut.ok) {
    const errorText = await respPut.text();
    throw new Error("Fehler beim Commit der package.json: " + errorText);
  }

  const result = await respPut.json();
  return result.content.path;
}

(async () => {
  try {
    const res = await updatePackageJson();
    console.log('Commit der aktualisierten package.json erfolgreich:', res);
  } catch (error) {
    console.error(error.message);
  }
})();
