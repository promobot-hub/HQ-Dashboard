"use client";

import React from 'react';

interface SkillCardProps {
  name: string;
  active: boolean;
  progress: number;
  onToggle?: () => void;
}

export default function SkillCard({ name, active, progress, onToggle }: SkillCardProps) {
  return (
    <div
      className={`cursor-pointer p-4 rounded shadow-md transition-colors duration-200 ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
      }`}
      onClick={onToggle}
      title={`${name} - ${active ? `Active, ${progress}%` : 'Inactive'}`}
    >
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      {active && <p>Progress: {progress}%</p>}
    </div>
  );
}
