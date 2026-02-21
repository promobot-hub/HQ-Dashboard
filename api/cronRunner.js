import { runCronCycle } from './cronManager';

let running = false;

export async function startCronRunner() {
  if (running) return;
  running = true;

  while (running) {
    console.log('Starting a new cron cycle...');
    try {
      const results = runCronCycle();
      console.log('Cron cycle completed', results);
    } catch (error) {
      console.error('Error in cron cycle:', error);
    }

    // Wait for 10 minutes before next cycle
    await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000));
  }
}

export function stopCronRunner() {
  running = false;
}
