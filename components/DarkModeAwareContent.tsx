"use client";

import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskQueue from './TaskQueue';
import FunnelDemo from './FunnelDemo';
import MultiPlatformPostDemo from './MultiPlatformPostDemo';
import AnalyticsCharts from './AnalyticsCharts';
import AnalyticsDashboard from './AnalyticsDashboard';
import LiveLogViewer from './LiveLogViewer';

export default function DarkModeAwareContent() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-8 font-sans max-w-7xl mx-auto`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-extrabold">HQ Dashboard</h1>
        <button
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition active:scale-95"
          onClick={toggleDarkMode}
        >
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </header>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Skills Status</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* TODO: Dynamische Skill Cards hier einbauen */}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Goals & Tasks</h2>
        <TaskForm onAdd={(text) => { /* TODO */ }} />
        <TaskList tasks={[]} />
      </section>

      <section className="mb-12">
        <TaskQueue />
      </section>

      <section className="mb-12">
        <FunnelDemo />
      </section>

      <section className="mb-12">
        <MultiPlatformPostDemo />
      </section>

      <section className="mb-12">
        <AnalyticsCharts />
      </section>

      <section className="mb-12">
        <AnalyticsDashboard />
      </section>

      <section className="grid grid-cols-2 gap-8">
        <div className="bg-red-800 p-6 rounded overflow-y-auto max-h-96">
          <h3 className="text-2xl font-semibold mb-4">Error Log</h3>
          <LiveLogViewer />
        </div>

        <div className="bg-gray-800 p-6 rounded overflow-y-auto max-h-96">
          <h3 className="text-2xl font-semibold mb-4">Full Log</h3>
          <LiveLogViewer />
        </div>
      </section>
    </div>
  );
}
