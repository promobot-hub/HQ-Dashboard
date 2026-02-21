import fetch from 'node-fetch';

async function pollDebugCron() {
  try {
    const response = await fetch('http://localhost/api/triggerDebugRun', { method: 'POST' });
    const data = await response.json();
    console.log('Debug cron triggered:', data.message);
  } catch (error) {
    console.error('Failed to trigger debug cron:', error);
  }
}

setInterval(pollDebugCron, 60000); // jede Minute

console.log('Debug cron poller gestartet.');
