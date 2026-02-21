"use client";

import React, { useEffect, useState, useRef } from 'react';

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
}

export default function LiveLogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('wss://your-bot-websocket-endpoint'); // Aktualisiere auf echten Endpunkt

    ws.current.onmessage = (event) => {
      const newLog: LogEntry = JSON.parse(event.data);
      setLogs((oldLogs) => [...oldLogs, newLog]);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white p-4 rounded h-96 overflow-y-scroll font-mono text-sm">
      {logs.length === 0 && <div>No logs yet...</div>}
      {logs.map((log) => (
        <div key={log.id}>{`${log.timestamp} - ${log.message}`}</div>
      ))}
    </div>
  );
}
