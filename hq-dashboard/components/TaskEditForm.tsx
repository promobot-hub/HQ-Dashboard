"use client";

import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import Button from './Button';

interface TaskEditFormProps {
  taskText?: string;
  onSave: (text: string) => void;
  children: React.ReactNode;
}

export default function TaskEditForm({ taskText = '', onSave, children }: TaskEditFormProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(taskText);

  useEffect(() => {
    setText(taskText);
  }, [taskText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSave(text.trim());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="sm:max-w-[425px]">
        <h3 className="text-lg font-bold mb-2">Aufgabe bearbeiten</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Aufgabentext"
            required
            autoFocus
          />
          <div className="mt-4 flex justify-end">
            <Button type="submit" variant="primary">
              Speichern
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
