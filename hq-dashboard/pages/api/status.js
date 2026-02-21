import fs from 'fs';

export default function handler(req, res) {
  try {
    const statePath = '/data/workspace/heartbeat-state.json';
    const statusPath = '/data/workspace/STATUS.md';

    let lastChecks = null;
    try {
      if (fs.existsSync(statePath)) {
        const raw = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        lastChecks = raw?.lastChecks || null;
      }
    } catch {}

    let lastRun = null;
    let kpis = null;
    try {
      if (fs.existsSync(statusPath)) {
        const text = fs.readFileSync(statusPath, 'utf8');
        const lrMatch = text.match(/Last Run:\s*(.*)/);
        if (lrMatch) lastRun = lrMatch[1].trim();
        const micro = text.match(/Micro-Commit:\s*(YES|NO)/i)?.[1]?.toUpperCase() || null;
        const skill = text.match(/Skill-Fortschritt:\s*(YES|NO)/i)?.[1]?.toUpperCase() || null;
        const state = text.match(/State aktualisiert:\s*(YES|NO)/i)?.[1]?.toUpperCase() || null;
        kpis = { microCommit: micro, skillProgress: skill, stateUpdated: state };
      }
    } catch {}

    res.status(200).json({ lastChecks, lastRun, kpis });
  } catch (e) {
    res.status(200).json({ error: e?.message || String(e) });
  }
}
