"use client";

import React from "react";
import Card from "./Card";
import Button from "./Button";

interface TaskItemProps {
  text: string;
  done: boolean;
  onToggle: () => void;
}

export default function TaskItem({ text, done, onToggle }: TaskItemProps) {
  return (
    <Card title="Task">
      <div
        className={`cursor-pointer select-none transition duration-200 ease-in-out ${
          done ? "bg-green-600 line-through" : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <p>{text}</p>
        <Button
          variant={done ? "secondary" : "primary"}
          className="mt-4"
          onClick={onToggle}
        >
          {done ? "Undone" : "Done"}
        </Button>
      </div>
    </Card>
  );
}
