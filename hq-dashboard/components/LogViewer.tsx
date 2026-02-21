"use client";

import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useLogsStore } from '../stores/logsStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function LogViewer() {
  const logs = useLogsStore((state) => state.logs);
  const errorLogs = useLogsStore((state) => state.errorLogs);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterText, setFilterText] = useState('');

  const [displayedLogs, setDisplayedLogs] = useState(logs);

  useEffect(() => {
    const sourceLogs = selectedIndex === 0 ? logs : errorLogs;
    const filtered = sourceLogs.filter((log) => log.message.toLowerCase().includes(filterText.toLowerCase()));
    // Use timeout to defer setState and avoid sync state update in effect
    const timeoutId = setTimeout(() => {
      setDisplayedLogs(filtered);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [logs, errorLogs, selectedIndex, filterText]);

  const clearLogs = () => {
    if (selectedIndex === 0) {
      useLogsStore.getState().clearLogs();
    } else {
      useLogsStore.getState().clearErrorLogs();
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white max-w-full max-h-[350px] overflow-y-auto font-mono text-sm">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded bg-gray-700 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded py-2.5 text-center text-sm font-medium',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                selected ? 'bg-blue-500 text-white' : 'text-blue-100 hover:bg-white/[0.12]'
              )
            }
          >
            All Logs
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded py-2.5 text-center text-sm font-medium',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                selected ? 'bg-blue-500 text-white' : 'text-blue-100 hover:bg-white/[0.12]'
              )
            }
          >
            Error Logs
          </Tab>
        </Tab.List>
        <div className="mt-2 mb-2 flex justify-between">
          <input
            type="text"
            className="p-1 rounded bg-gray-600 placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Filter logs..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button
            onClick={clearLogs}
            className="ml-2 px-2 py-1 rounded bg-red-600 hover:bg-red-700 transition-colors"
          >
            Clear
          </button>
        </div>
        <Tab.Panels>
          <Tab.Panel className="overflow-y-auto max-h-[270px] scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
            {displayedLogs.map((log) => (
              <div key={log.id} className="mb-1">
                [{log.timestamp}] - {log.message}
              </div>
            ))}
          </Tab.Panel>
          <Tab.Panel className="overflow-y-auto max-h-[270px] scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-700">
            {displayedLogs.map((log) => (
              <div key={log.id} className="mb-1 text-red-400">
                [{log.timestamp}] - {log.message}
              </div>
            ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
