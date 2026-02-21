"use client";

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem';

interface SortableTaskProps {
  id: string;
  text: string;
  done: boolean;
  onToggle: () => void;
}

function SortableTask({ id, text, done, onToggle }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem text={text} done={done} onToggle={onToggle} />
    </div>
  );
}

export default function TaskQueueSortable() {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Task 1: Complete login automation', done: false },
    { id: '2', text: 'Task 2: Deploy HQ Dashboard', done: false },
    { id: '3', text: 'Task 3: Integrate GitHub Skill', done: true },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = tasks.findIndex((task) => String(task.id) === String(active.id));
    const newIndex = tasks.findIndex((task) => String(task.id) === String(over.id));
    if (oldIndex !== -1 && newIndex !== -1) {
      setTasks((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map(({ id, text, done }) => (
          <SortableTask key={id} id={id} text={text} done={done} onToggle={() => {}} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
