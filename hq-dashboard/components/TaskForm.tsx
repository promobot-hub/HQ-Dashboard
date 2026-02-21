"use client";
import React, { useState } from "react";

interface TaskFormProps {
  onAdd: (text: string) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (text) {
      onAdd(text);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-1"
        placeholder="New task"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Add
      </button>
    </form>
  );
}
