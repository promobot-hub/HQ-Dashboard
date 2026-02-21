import React, { useEffect, useState } from 'react';

export default function LogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Logs</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}
