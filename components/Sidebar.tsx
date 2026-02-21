"use client";

import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Open sidebar"
        className="p-2 rounded bg-gray-800 text-white"
        onClick={() => setOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex">
          <div className="bg-gray-900 text-white p-4 w-64 max-w-xs h-full">
            <button
              aria-label="Close sidebar"
              className="mb-4 text-white"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <nav>
              <ul>
                <li className="mb-2">Home</li>
                <li className="mb-2">Skills</li>
                <li className="mb-2">Tasks</li>
                <li className="mb-2">Logs</li>
                <li className="mb-2">Settings</li>
              </ul>
            </nav>
          </div>
          <div className="flex-grow" onClick={() => setOpen(false)}></div>
        </div>
      )}
    </>
  );
}
