"use client";

import React from 'react';

interface SkillDetailsProps {
  name: string;
  status: string;
  lastRun: string;
  errorCount: number;
}

export default function SkillDetails({ name, status, lastRun, errorCount }: SkillDetailsProps) {
  return (
    <div className="border rounded p-4 bg-gray-800">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p>Status: {status}</p>
      <p>Last Run: {lastRun}</p>
      <p>Error Count: {errorCount}</p>
    </div>
  );
}
