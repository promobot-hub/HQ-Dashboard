import React from "react";
import Hero from "../components/Hero";
import StatusTiles from "../components/StatusTiles";
import TaskList from "../components/TaskList";
import LogViewer from "../components/LogViewer";

export default function Home() {
  return (
    <main className="p-4">
      <Hero />
      <StatusTiles />
      <section className="mt-6">
        <TaskList />
      </section>
      <section className="mt-8">
        <LogViewer />
      </section>
    </main>
  );
}
