const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
  console.error('GitHub Token nicht gefunden in ENV');
  process.exit(1);
}

async function readFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...(await readFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function uploadFilesToGitHub() {
  const files = await readFiles('./hq-dashboard');
  
  const blobMap = {};

  for (const filePath of files) {
    if (filePath.includes('node_modules')) continue; // skip node_modules
    const relativePath = path.relative('./hq-dashboard', filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath);
    const contentBase64 = content.toString('base64');

    // Create blob for each file
    const respBlob = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: contentBase64, encoding: 'base64' })
    });

    if (!respBlob.ok) {
      const errorMsg = await respBlob.text();
      throw new Error(`Blob Erstellung fehlgeschlagen: ${errorMsg}`);
    }

    const blobData = await respBlob.json();
    blobMap[relativePath] = blobData.sha;
  }

  // Erzeuge einen Tree mit allen Blobs
  const treeItems = Object.entries(blobMap).map(([path, sha]) => ({ path, mode: '100644', type: 'blob', sha }));

  const respBaseTree = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tree: treeItems, base_tree: '' })
  });

  if (!respBaseTree.ok) {
    const err = await respBaseTree.text();
    throw new Error(`Base Tree Erstellung fehlgeschlagen: ${err}`);
  }

  const baseTree = await respBaseTree.json();

  // Erstelle Commit mit dem Tree
  // Hole den aktuellen Branch commit SHA
  const respRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  let parentSha = null;
  if (respRef.ok) {
    const refData = await respRef.json();
    parentSha = refData.object.sha;
  }

  const commitMessage = "Initial commit HQ dashboard with full files";

  const respCommit = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: commitMessage, tree: baseTree.sha, parents: parentSha ? [parentSha] : [] })
  });

  if (!respCommit.ok) {
    const err = await respCommit.text();
    throw new Error(`Commit Erstellung fehlgeschlagen: ${err}`);
  }

  const commitData = await respCommit.json();

  // Aktualisiere den ref auf den neuen Commit
  const respUpdateRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sha: commitData.sha })
  });

  if (!respUpdateRef.ok) {
    const err = await respUpdateRef.text();
    throw new Error(`Aktualisierung des Refs fehlgeschlagen: ${err}`);
  }

  return commitData.sha;
}

(async () => {
  try {
    const sha = await uploadFilesToGitHub();
    console.log('Initial Commit erfolgreich mit SHA:', sha);
  } catch (error) {
    console.error('Fehler beim Upload:', error.message);
  }
})();
