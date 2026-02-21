let taskQueue = [
  { id: 1, text: 'Complete Twitter login automation', done: false },
  { id: 2, text: 'Deploy HQ Dashboard on Vercel', done: false },
  { id: 3, text: 'Integrate GitHub Skill with token auth', done: true },
];

function executeTask(task) {
  // Simulate task execution with logs (replace with real logic later)
  console.log(`Executing task #${task.id}: ${task.text}`);
  task.done = true;
  // Log action
  return { taskId: task.id, status: 'done', timestamp: new Date().toISOString() };
}

export function runCronCycle() {
  let results = [];
  for (let task of taskQueue) {
    if (!task.done) {
      let result = executeTask(task);
      results.push(result);
    }
  }
  return results;
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const results = runCronCycle();
    res.status(200).json({ message: 'Cron cycle executed', results });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
