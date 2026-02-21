"use client";
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const taskData = [
  { name: 'Task 1', progress: 80 },
  { name: 'Task 2', progress: 45 },
  { name: 'Task 3', progress: 60 },
];

const skillUsageData = [
  { name: 'Twitter Agent', usage: 75 },
  { name: 'GitHub Skill', usage: 86 },
  { name: 'Email Handler', usage: 30 },
];

const botActivityData = [
  { time: '10AM', activity: 20 },
  { time: '11AM', activity: 45 },
  { time: '12PM', activity: 30 },
  { time: '1PM', activity: 60 },
  { time: '2PM', activity: 50 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8 p-4 rounded bg-gray-800 text-white max-w-full">
      <h2 className="text-xl font-bold">Analytics Dashboard</h2>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={taskData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="progress" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={skillUsageData}
            dataKey="usage"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            fill="#82ca9d"
            label
          >
            {skillUsageData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={botActivityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="activity"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
