"use client";

import React from 'react';
import Link from 'next/link';
import { useDarkMode } from '../context/DarkModeContext';

export default function Navbar() {
  const { darkMode } = useDarkMode();

  return (
    <nav className={`w-full py-4 px-6 flex justify-between items-center shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="text-xl font-bold">HQ Dashboard</div>
      <ul className="flex space-x-6">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/skills">Skills</Link></li>
        <li><Link href="/tasks">Tasks</Link></li>
        <li><Link href="/analytics">Analytics</Link></li>
      </ul>
    </nav>
  );
}
