import React, { useEffect, useState } from 'react';

export default function LogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logManager');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load logs', err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#222', color: '#eee', padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h3>System Logs</h3>
      {logs.length === 0 ? <p>No log entries</p> : (
        logs.map((log, index) => (
          <div key={index}>{`[${new Date(log.timestamp).toLocaleTimeString()}] ${log.type}: ${log.message}`}</div>
        ))
      )}
    </div>
  );
}
