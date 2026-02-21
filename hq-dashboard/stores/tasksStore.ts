import create from "zustand";

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

interface TasksState {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],

  addTask: (text) =>
    set((state) => ({
      tasks: [...state.tasks, { id: crypto.randomUUID(), text, done: false }],
    })),

  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
}));
