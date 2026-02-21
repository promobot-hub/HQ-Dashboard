import React, { useEffect, useState } from "react";

export default function LiveLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let ws;
    const connectWebSocket = () => {
      setError("");
      ws = new WebSocket("wss://example.com/live-logs");
      ws.onmessage = (event) => {
        setLogs((prevLogs) => [...prevLogs, event.data]);
      };
      ws.onerror = () => {
        console.error("WebSocket error");
        ws.close();
        setError("Verbindung zum Live-Log-Server verloren. Versuche neu zu verbinden...");
        setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
    };
    connectWebSocket();
    return () => ws.close();
  }, []);

  return (
    <div className="live-logs-container">
      <h2>Live Logs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="logs">
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
}
