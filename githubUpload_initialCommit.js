const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

async function createInitialCommit() {
  const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tree: [{ path: 'README.md', mode: '100644', type: 'blob', content: 'Initial README' }] })
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Tree erstellen fehlgeschlagen: ${err}`);
  }
  const treeData = await resp.json();

  const commitResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: 'Initial commit with README', tree: treeData.sha, parents: [] })
  });
  if (!commitResp.ok) {
    const err = await commitResp.text();
    throw new Error(`Commit erstellen fehlgeschlagen: ${err}`);
  }
  const commitData = await commitResp.json();

  const refResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commitData.sha })
  });

  if (!refResp.ok) {
    const err = await refResp.text();
    throw new Error(`Ref erstellen fehlgeschlagen: ${err}`);
  }

  const refData = await refResp.json();
  return refData;
}

(async () => {
  try {
    const result = await createInitialCommit();
    console.log('Initial Commit erfolgreich:', result);
  } catch (error) {
    console.error('Fehler beim Initial Commit:', error.message);
  }
})();
