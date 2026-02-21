import React from "react";
import Hero from "../components/Hero";
import StatusTiles from "../components/StatusTiles";
import Features from "../components/Features";
import TaskList from "../components/TaskList";
import LogViewer from "../components/LogViewer";

export default function Home() {
  return (
    <main className="p-4 space-y-6">
      <Hero />
      <StatusTiles />
      <Features />
      <section>
        <h2 className="text-xl font-semibold mb-2">Aufgaben</h2>
        <TaskList />
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Logs</h2>
        <LogViewer />
      </section>
    </main>
  );
}
