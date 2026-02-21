"use client";

import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskQueueSortable from './TaskQueueSortable';
import SkillCard from './SkillCard';
import FunnelDemo from './FunnelDemo';
import MultiPlatformPostDemo from './MultiPlatformPostDemo';
import AnalyticsCharts from './AnalyticsCharts';
import AnalyticsDashboard from './AnalyticsDashboard';
import LiveLogViewer from './LiveLogViewer';

export default function DarkModeAwareContent() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Hier Zustände über Stores holen und verwalten

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen p-6 font-sans`}>      
      <button
        className="fixed top-4 right-4 p-2 rounded bg-gray-700 bg-opacity-70 hover:bg-opacity-100"
        onClick={toggleDarkMode}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <h1 className="text-4xl font-bold mb-6">HQ Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Skills Status</h2>
        <ul className="grid grid-cols-2 gap-4">
          {/* Skills Map hier */}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Goals & Tasks</h2>
        <TaskForm onAdd={(text) => { /* Handle Add */ }} />
        <TaskList tasks={[]} />
      </section>

      <section className="mb-8">
        <TaskQueueSortable />
      </section>

      <section className="mb-8">
        <FunnelDemo />
      </section>

      <section className="mb-8">
        <MultiPlatformPostDemo />
      </section>

      <section className="mb-8">
        <AnalyticsCharts />
      </section>

      <section className="mb-8">
        <AnalyticsDashboard />
      </section>

      <section className="mb-8 grid grid-cols-2 gap-6">
        <div className="bg-red-800 p-4 rounded h-96 overflow-y-scroll">
          <h3 className="text-xl font-semibold mb-2">Error Log</h3>
          <LiveLogViewer />
        </div>

        <div className="bg-gray-800 p-4 rounded h-96 overflow-y-scroll">
          <h3 className="text-xl font-semibold mb-2">Full Log</h3>
          <LiveLogViewer />
        </div>
      </section>
    </div>
  );
}
