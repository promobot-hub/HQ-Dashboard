"use client";
import React, { useState } from 'react';

export default function TaskForm() {
  const [input, setInput] = useState('');
  return (
    <form onSubmit={(e)=>{e.preventDefault();}} className="space-x-2">
      <input value={input} onChange={e=>setInput(e.target.value)} className="border p-1" placeholder="New task" />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
    </form>
  );
}
