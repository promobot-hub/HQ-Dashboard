"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaHome, FaTasks, FaTools, FaCog, FaBars } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);

  const isActive = (path: string) => path === pathname;

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="text-xl font-bold text-white flex items-center gap-2">
        <FaBars />
        Promobot HQ Dashboard
      </div>
      <ul className="flex gap-4">
        <li className={`hover:text-white cursor-pointer flex items-center gap-1 ${isActive('/') ? 'text-blue-400' : ''}`}>
          <FaHome />
          Home
        </li>
        <li className={`hover:text-white cursor-pointer flex items-center gap-1 ${isActive('/skills') ? 'text-blue-400' : ''}`}>
          <FaTools />
          Skills
        </li>
        <li className={`hover:text-white cursor-pointer flex items-center gap-1 ${isActive('/tasks') ? 'text-blue-400' : ''}`}>
          <FaTasks />
          Tasks
        </li>
        <li className={`hover:text-white cursor-pointer flex items-center gap-1 ${isActive('/logs') ? 'text-blue-400' : ''}`}>
          <FaTools />
          Logs
        </li>
        <li className={`hover:text-white cursor-pointer flex items-center gap-1 ${isActive('/settings') ? 'text-blue-400' : ''}`}>
          <FaCog />
          Settings
        </li>
      </ul>

      <button
        aria-label="Toggle Dark Mode"
        className="ml-4 p-2 bg-gray-900 rounded-full text-white"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}
