import React from 'react';
import TaskList from '../components/TaskList';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-4xl font-bold mb-4">HQ-Dashboard</h1>
      <p>Welcome to PromoteBot's HQ-Dashboard. This is the starting point for growth and automation.</p>
      <section>
        <TaskList />
      </section>
      <Footer />
    </main>
  );
}
