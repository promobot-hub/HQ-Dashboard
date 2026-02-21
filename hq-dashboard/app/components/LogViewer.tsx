"use client";
import React, { useEffect, useState } from "react";

export default function LogViewer() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setLogs([JSON.stringify(data)]);
      } catch (err) {
        console.error("Failed to load logs", err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        backgroundColor: "#222",
        color: "#eee",
        padding: "10px",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <h3>System Logs</h3>
      {logs.length === 0 ? (
        <p>No log entries</p>
      ) : (
        logs.map((log, index) => <div key={index}>{String(log)}</div>)
      )}
    </div>
  );
}
