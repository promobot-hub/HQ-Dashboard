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
  logBgDark: "#334155",
  logBgLight: "#E2E8F0",
  logTextDark: "#F1F5F9",
  logTextLight: "#0F172A"
};

const FONT_SIZES = {
  title: '3rem',
  subtitle: '1.875rem',
  sectionTitle: '1.5rem',
  normal: '1rem',
  small: '0.875rem',
};

const FONT_FAMILY = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

export default function DarkModeAwareContent() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const bgColor = darkMode ? COLORS.darkBackground : COLORS.lightBackground;
  const textColor = darkMode ? COLORS.darkText : COLORS.lightText;
  const primaryColor = COLORS.primary;
  const primaryHoverColor = COLORS.primaryHover;
  const errorBgColor = COLORS.errorBg;
  const errorTextColor = COLORS.errorText;
  const logBgColor = darkMode ? COLORS.logBgDark : COLORS.logBgLight;
  const logTextColor = darkMode ? COLORS.logTextDark : COLORS.logTextLight;

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto"
      style={{ backgroundColor: bgColor, color: textColor, fontFamily: FONT_FAMILY }}
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
        <h1 style={{ fontSize: FONT_SIZES.title, fontWeight: 800, letterSpacing: '-0.05em' }}>
          HQ Dashboard
        </h1>
        <button
          className="px-6 py-3 rounded shadow-lg transition-transform duration-300 ease-in-out active:scale-95 hover:shadow-xl"
          style={{ backgroundColor: primaryColor, color: textColor, fontFamily: FONT_FAMILY }}
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
        <h2 style={{ fontSize: FONT_SIZES.subtitle, fontWeight: 600, marginBottom: '1.5rem' }}>
          Skills Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* TODO: Dynamische Skill Cards hier einbauen */}
        </div>
      </section>

      <section className="mb-12">
        <h2 style={{ fontSize: FONT_SIZES.subtitle, fontWeight: 600, marginBottom: '1.5rem' }}>
          Goals & Tasks
        </h2>
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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          style={{ backgroundColor: errorBgColor, color: errorTextColor }}
          className="p-6 rounded overflow-y-auto max-h-96"
        >
          <h3 style={{ fontSize: FONT_SIZES.sectionTitle, fontWeight: 600, marginBottom: '1rem' }}>
            Error Log
          </h3>
          <LiveLogViewer />
        </div>

        <div
          style={{ backgroundColor: logBgColor, color: logTextColor }}
          className="p-6 rounded overflow-y-auto max-h-96"
        >
          <h3 style={{ fontSize: FONT_SIZES.sectionTitle, fontWeight: 600, marginBottom: '1rem' }}>
            Full Log
          </h3>
          <LiveLogViewer />
        </div>
      </section>
    </div>
  );
}
