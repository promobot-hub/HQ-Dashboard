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

async function uploadFilesAfterReadme() {
  const files = await readFiles('./hq-dashboard');
  
  const respRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!respRef.ok) {
    const err = await respRef.text();
    throw new Error(`Fehler beim Abrufen des base_tree SHA: ${err}`);
  }

  const refData = await respRef.json();
  const baseTreeSha = refData.object.sha;

  const blobMap = {};

  for (const filePath of files) {
    if (filePath.includes('node_modules') || filePath.includes('.git')) continue;

    const relativePath = path.relative('./hq-dashboard', filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath);
    const contentBase64 = content.toString('base64');

    const respBlob = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: contentBase64, encoding: 'base64' })
    });

    if (!respBlob.ok) {
      const err = await respBlob.text();
      throw new Error(`Blob Erstellung fehlgeschlagen: ${err}`);
    }

    const blobData = await respBlob.json();
    blobMap[relativePath] = blobData.sha;
  }

  const treeItems = Object.entries(blobMap).map(([path, sha]) => ({ path, mode: '100644', type: 'blob', sha }));

  const respTree = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tree: treeItems, base_tree: baseTreeSha })
  });

  if (!respTree.ok) {
    const err = await respTree.text();
    throw new Error(`Baum-Erstellung fehlgeschlagen: ${err}`);
  }

  const treeData = await respTree.json();

  const commitMessage = "Add full HQ dashboard files after initial README";

  const respCommit = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: commitMessage, tree: treeData.sha, parents: [baseTreeSha] })
  });

  if (!respCommit.ok) {
    const err = await respCommit.text();
    throw new Error(`Commit-Erstellung fehlgeschlagen: ${err}`);
  }

  const commitData = await respCommit.json();

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
    const sha = await uploadFilesAfterReadme();
    console.log('Vollständiger Commit erfolgreich mit SHA:', sha);
  } catch (error) {
    console.error('Fehler beim vollständigen Upload:', error.message);
  }
})();
