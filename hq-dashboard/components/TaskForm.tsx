"use client";

import React, { useState } from 'react';

interface TaskFormProps {
  onAdd: (text: string) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== '') {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Neue Aufgabe eingeben..."
        className="flex-1 p-2 border rounded"
      />
      <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
        Hinzufügen
      </button>
    </form>
  );
}
