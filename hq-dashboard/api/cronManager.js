import { logEvent } from "./logManager";

let taskQueue = [
  {
    id: 1,
    text: "Complete Twitter login automation",
    done: false,
    errorCount: 0,
    retry: 0,
  },
  {
    id: 2,
    text: "Deploy HQ Dashboard on Vercel",
    done: false,
    errorCount: 0,
    retry: 0,
  },
  {
    id: 3,
    text: "Integrate GitHub Skill with token auth",
    done: true,
    errorCount: 0,
    retry: 0,
  },
];

function executeTask(task) {
  console.log(`Executing task #${task.id}: ${task.text}`);

  // Simulate a random failure for demonstration
  const fail = Math.random() < 0.2 && task.retry < 3;

  let status = fail ? "error" : "done";
  let message = fail
    ? `Failed task: ${task.text}`
    : `Executed task: ${task.text}`;

  if (fail) {
    task.errorCount += 1;
    task.retry += 1;
    task.done = false;
  } else {
    task.done = true;
    task.retry = 0;
  }

  logEvent({ type: "task", message, taskId: task.id, status });

  return { taskId: task.id, status, timestamp: new Date().toISOString() };
}

export function runCronCycle() {
  // Sort tasks by error count (descending) then by retry count (ascending)
  taskQueue.sort((a, b) => {
    if (b.errorCount !== a.errorCount) return b.errorCount - a.errorCount;
    return a.retry - b.retry;
  });

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
  if (req.method === "POST") {
    const results = runCronCycle();
    res.status(200).json({ message: "Cron cycle executed", results });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
