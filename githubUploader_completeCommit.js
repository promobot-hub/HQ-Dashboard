const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error('GitHub Token nicht gefunden in ENV');
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

async function uploadFilesCommit() {
  const files = await readFiles('./hq-dashboard');
  const blobMap = {};
  for (const filePath of files) {
    if (filePath.includes('node_modules') || filePath.includes('.git')) continue;

    const relativePath = path.relative('./hq-dashboard', filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath).toString('base64');

    // Blob erstellen
    const respBlob = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content, encoding: 'base64' })
    });

    if (!respBlob.ok) {
      const err = await respBlob.text();
      throw new Error(`Blob-Fehler: ${err}`);
    }

    const blobData = await respBlob.json();
    blobMap[relativePath] = blobData.sha;
  }

  // Ref für main branch holen
  const respRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!respRef.ok) {
    const err = await respRef.text();
    throw new Error(`Ref-Fehler: ${err}`);
  }

  const refData = await respRef.json();
  const parentSha = refData.object.sha;

  // Tree mit Blobs bauen
  const treeItems = Object.entries(blobMap).map(([path, sha]) => ({
    path,
    mode: '100644',
    type: 'blob',
    sha,
  }));

  const respTree = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tree: treeItems, base_tree: parentSha })
  });

  if (!respTree.ok) {
    const err = await respTree.text();
    throw new Error(`Tree-Fehler: ${err}`);
  }

  const treeData = await respTree.json();

  // Commit erstellen
  const commitMessage = "Consolidated commit: Update HQ Dashboard with all files";
  const respCommit = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: commitMessage, tree: treeData.sha, parents: [parentSha] })
  });

  if (!respCommit.ok) {
    const err = await respCommit.text();
    throw new Error(`Commit-Fehler: ${err}`);
  }

  const commitData = await respCommit.json();

  // Update des Refs
  const respUpdate = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sha: commitData.sha })
  });

  if (!respUpdate.ok) {
    const err = await respUpdate.text();
    throw new Error(`Ref-Update-Fehler: ${err}`);
  }

  return commitData.sha;
}

(async () => {
  try {
    const sha = await uploadFilesCommit();
    console.log('Konsolidierter Commit erfolgreich, SHA:', sha);
  } catch (error) {
    console.error('Fehler beim Commit:', error.message);
  }
})();
