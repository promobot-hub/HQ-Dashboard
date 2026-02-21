import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const p = path.join(process.cwd(), 'data', 'heartbeat-ledger.json');
    const raw = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '{}';
    const json = JSON.parse(raw || '{}');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(json));
  } catch (e) {
    res.status(200).send('{}');
  }
}
