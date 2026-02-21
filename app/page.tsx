"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HeartbeatLedger = dynamic(() => import('../components/HeartbeatLedger'));

export default function HomePage() {
  const [cronResults, setCronResults] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (running) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch('/api/cronManager', { method: 'POST' });
          const data = await res.json();
          setCronResults((prev) => [...prev, ...data.results]);
        } catch (e) {
          console.error('Error running cron:', e);
        }
      }, 10 * 60 * 1000); // 10 min
      return () => clearInterval(interval);
    }
  }, [running]);

  const startCron = async () => {
    await fetch('/api/start-cron');
    setRunning(true);
  };

  const stopCron = async () => {
    await fetch('/api/stop-cron');
    setRunning(false);
  };

  return (
    <div className="p-5 space-y-6">
      <h1>HQ Dashboard</h1>
      <div>
        <button onClick={startCron} className="bg-green-500 p-2 m-2 rounded text-white">Start Cron</button>
        <button onClick={stopCron} className="bg-red-500 p-2 m-2 rounded text-white">Stop Cron</button>
      </div>
      <div>
        <h2>Cron task results</h2>
        <ul>
          {cronResults.map((result, idx) => (
            <li key={idx}>{`Task #${result.taskId} completed at ${result.timestamp}`}</li>
          ))}
        </ul>
      </div>
      <HeartbeatLedger />
    </div>
  );
}
