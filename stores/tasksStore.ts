import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

interface TasksStore {
  tasks: Task[];
  currentTaskId: number | null;
  addTask: (text: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  setCurrentTask: (id: number) => void;
  markTaskDone: (id: number) => void;
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: [
        { id: 1, text: 'Completing Twitter login automation', done: false },
        { id: 2, text: 'Deploy HQ-Dashboard on Vercel', done: false },
        { id: 3, text: 'Integrate GitHub Skill with token auth', done: true },
      ],
      currentTaskId: null,
      addTask: (text) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: Date.now(), text, done: false },
          ],
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
      setCurrentTask: (id) =>
        set({ currentTaskId: id }),
      markTaskDone: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, done: true } : task
          ),
        })),
    }),
    { name: 'tasks-storage' }
  )
);
