import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const logPath = "/data/workspace/logs/HEARTBEAT-LOG.md";
    if (!fs.existsSync(logPath)) {
      return res.status(200).json([]);
    }
    const raw = fs.readFileSync(logPath, "utf8");
    const lines = raw.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
    const last = lines.slice(-12); // up to last ~10 entries (allowing header lines filtered)
    res.status(200).json(last);
  } catch (e) {
    res.status(200).json([`log-read-error: ${e?.message || e}`]);
  }
}
