import { logCronEvent } from './cronjobDebugLogger';
import { selfImprovementLoop } from '../selfImprovementLoop';

export async function runCronJobWithDebug() {
  logCronEvent('Cron job started');
  const result = selfImprovementLoop();
  logCronEvent(`Self improvement result: ${result}`);
  return result;
}
