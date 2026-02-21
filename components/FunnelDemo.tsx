"use client";

import React from 'react';

export default function FunnelDemo() {
  const funnelStages = [
    { label: 'Visitors', value: 1000 },
    { label: 'Signups', value: 750 },
    { label: 'Leads', value: 300 },
    { label: 'Customers', value: 120 },
  ];

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Conversion Funnel Demo</h2>
      <ol className="list-decimal list-inside space-y-2">
        {funnelStages.map((stage, index) => (
          <li key={index}>
            {stage.label}: {stage.value}
            {index > 0 && (
              <span className="ml-2 text-green-400 font-semibold">
                ({(((stage.value / funnelStages[index - 1].value) * 100) || 0).toFixed(1)}%)
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
