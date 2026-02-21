"use client";
import React, { useEffect, useState } from "react";

export default function Footer() {
  const [lastRun, setLastRun] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => setLastRun(data?.lastRun || null))
      .catch(() => setLastRun(null));
  }, []);

  return (
    <footer className="mt-10 pt-4 border-t text-sm text-gray-500">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span>PromoteBot HQ-Dashboard</span>
        <span>Last updated: {lastRun ? lastRun : "—"}</span>
      </div>
    </footer>
  );
}
