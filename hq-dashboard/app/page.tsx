import React from 'react';
import TaskList from '../components/TaskList';
import LogViewer from '../components/LogViewer';

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-4xl font-bold mb-4">HQ-Dashboard</h1>
      <section>
        <TaskList />
      </section>
      <section className="mt-8">
        <LogViewer />
      </section>
    </main>
  );
}
