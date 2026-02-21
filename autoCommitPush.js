import { execSync } from 'child_process';
import { scrubSecrets } from './secretScrubber.js';
import fs from 'fs';

export function autoCommitPush() {
  const changedFiles = execSync('git diff --name-only').toString().trim().split('\n');
  for (const file of changedFiles) {
    if (fs.existsSync(file)) {
      scrubSecrets(file);
      execSync(`git add ${file}`);
      try {
        execSync(`git commit -m \"Auto-commit ${file}\"`);
        execSync('git push');
        console.log(`Committed and pushed ${file}`);
      } catch (e) {
        console.error(`Fehler beim Commit/Push von ${file}:`, e.message);
      }
    }
  }
}
