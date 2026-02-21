"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Twitter', value: 75 },
  { name: 'GitHub', value: 50 },
  { name: 'Email', value: 20 },
  { name: 'Tasks', value: 30 },
  { name: 'Logs', value: 100 },
];

export default function AnalyticsCharts() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 15, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="name" stroke="#eee" />
        <YAxis stroke="#eee" />
        <Tooltip contentStyle={{ backgroundColor: '#222', borderRadius: 5, borderColor: '#555' }} />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
