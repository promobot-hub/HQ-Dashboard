"use client";

import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

export default function Sidebar() {
  const { darkMode } = useDarkMode();

  return (
    <aside className={`w-64 min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h2 className="text-2xl font-semibold mb-6">Navigation</h2>
      <ul className="space-y-4">
        <li className="cursor-pointer hover:underline">Dashboard</li>
        <li className="cursor-pointer hover:underline">Skills</li>
        <li className="cursor-pointer hover:underline">Tasks</li>
        <li className="cursor-pointer hover:underline">Analytics</li>
      </ul>
    </aside>
  );
}
