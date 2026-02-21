"use client";

import React from 'react';
import Card from './Card';
import Button from './Button';

interface SkillCardProps {
  name: string;
  active: boolean;
  progress?: number;
  details?: string;
}

export default function SkillCard({ name, active, progress, details }: SkillCardProps) {
  return (
    <Card title={name}>
      <p>Status: {active ? 'Active' : 'Inactive'}</p>
      {details && <p className="mt-1 text-sm text-gray-300">{details}</p>}
      <div className="mt-4">
        <div className="h-2 bg-gray-600 rounded">
          <div
            className={`h-2 rounded bg-blue-500 transition-all duration-500`}
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
        <Button variant={active ? 'secondary' : 'primary'} className="mt-2">
          {active ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </Card>
  );
}
