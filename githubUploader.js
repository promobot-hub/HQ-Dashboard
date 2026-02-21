const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const owner = 'promobot-hub';
const repo = 'HQ-Dashboard';
const branch = 'main';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error('GitHub Token not found in environment variables');
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

async function uploadFile(filePath, basePath) {
  const relativePath = path.relative(basePath, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath);
  const contentBase64 = content.toString('base64');

  // Check if file exists to get SHA
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`;

  let sha = null;
  const getResp = await fetch(`${url}?ref=${branch}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    },
  });

  if (getResp.ok) {
    const data = await getResp.json();
    sha = data.sha;
  }

  const body = {
    message: `Add or update ${relativePath}`,
    content: contentBase64,
    branch: branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const putResp = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(body),
  });

  if (!putResp.ok) {
    const err = await putResp.text();
    throw new Error(`Failed to upload ${relativePath}: ${err}`);
  }

  const putData = await putResp.json();
  return putData.content.path;
}

async function uploadAll() {
  const basePath = './hq-dashboard';
  const files = await readFiles(basePath);

  for (const file of files) {
    if (file.includes('node_modules') || file.includes('.git')) continue;
    try {
      const pathUploaded = await uploadFile(file, basePath);
      console.log(`Uploaded ${pathUploaded}`);
    } catch (error) {
      console.error(error.message);
    }
  }
}

uploadAll().then(() => console.log('All files uploaded.')).catch(console.error);
