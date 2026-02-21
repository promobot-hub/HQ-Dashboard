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

const COLORS = {
  darkBackground: "#1E293B",
  lightBackground: "#F1F5F9",
  darkText: "#F8FAFC",
  lightText: "#0F172A",
  primary: "#3B82F6",
  primaryHover: "#2563EB",
  errorBg: "#B91C1C",
  errorText: "#FEE2E2",
  logBg: "#334155",
  logText: "#F1F5F9"
};

export default function DarkModeAwareContent() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const bgColor = darkMode ? COLORS.darkBackground : COLORS.lightBackground;
  const textColor = darkMode ? COLORS.darkText : COLORS.lightText;
  const primaryColor = COLORS.primary;
  const primaryHoverColor = COLORS.primaryHover;
  const errorBgColor = COLORS.errorBg;
  const errorTextColor = COLORS.errorText;
  const logBgColor = darkMode ? COLORS.logBg : COLORS.lightBackground;
  const logTextColor = darkMode ? COLORS.logText : COLORS.lightText;

  return (
    <div
      className="min-h-screen p-8 font-sans max-w-7xl mx-auto"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-extrabold">HQ Dashboard</h1>
        <button
          className="px-4 py-2 rounded transition active:scale-95"
          style={{ backgroundColor: primaryColor, color: textColor }}
          onClick={toggleDarkMode}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primaryHoverColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = primaryColor;
          }}
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
        <div
          style={{ backgroundColor: errorBgColor, color: errorTextColor }}
          className="p-6 rounded overflow-y-auto max-h-96"
        >
          <h3 className="text-2xl font-semibold mb-4">Error Log</h3>
          <LiveLogViewer />
        </div>

        <div
          style={{ backgroundColor: logBgColor, color: logTextColor }}
          className="p-6 rounded overflow-y-auto max-h-96"
        >
          <h3 className="text-2xl font-semibold mb-4">Full Log</h3>
          <LiveLogViewer />
        </div>
      </section>
    </div>
  );
}
