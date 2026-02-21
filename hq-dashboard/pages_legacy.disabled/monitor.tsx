import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import BabyStep from "../components/BabyStep";
import TaskTimeline from "../components/TaskTimeline";

export default function Monitor() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-6">Self-Improvement Monitor</h1>
      <p>
        Offene Tasks: {tasks.filter((task) => task.status !== "done").length}
      </p>
      <p>
        Erledigte Tasks: {tasks.filter((task) => task.status === "done").length}
      </p>
      <ul className="list-disc list-inside mt-4">
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - <em>{task.status}</em>
          </li>
        ))}
      </ul>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Aktueller Baby Step</h2>
        <BabyStep />
      </section>
      <section className="mt-6">
        <TaskTimeline tasks={tasks} />
      </section>
      <Footer />
    </main>
  );
}
