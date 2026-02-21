import React, { useEffect, useState } from 'react';

export default function LiveLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('wss://example.com/live-logs');
    ws.onmessage = (event) => {
      setLogs(prevLogs => [...prevLogs, event.data]);
    };
    ws.onerror = () => {
      console.error('WebSocket error');
      ws.close();
    };
    return () => ws.close();
  }, []);

  return (
    <div className="live-logs-container">
      <h2>Live Logs</h2>
      <div className="logs">
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
}
