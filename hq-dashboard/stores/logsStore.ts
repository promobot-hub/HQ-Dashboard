import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EventEmitter } from "events";

interface Log {
  id: number;
  timestamp: string;
  message: string;
  error?: boolean;
}

interface LogsStore {
  logs: Log[];
  errorLogs: Log[];
  addLog: (log: Log) => void;
  addErrorLog: (log: Log) => void;
  clearLogs: () => void;
  clearErrorLogs: () => void;
  emitter: EventEmitter;
}

export const useLogsStore = create<LogsStore>()(
  persist(
    (set, get) => {
      const emitter = new EventEmitter();
      return {
        logs: [],
        errorLogs: [],
        emitter,
        addLog: (log) => {
          set((state) => {
            const updatedLogs = [...state.logs, log];
            emitter.emit("log", log);
            return { logs: updatedLogs };
          });
        },
        addErrorLog: (log) => {
          set((state) => {
            const updatedErrors = [...state.errorLogs, log];
            emitter.emit("errorLog", log);
            return { errorLogs: updatedErrors };
          });
        },
        clearLogs: () => set({ logs: [] }),
        clearErrorLogs: () => set({ errorLogs: [] }),
      };
    },
    { name: "logs-storage" }
  )
);

// Simulate dynamic logs for demo
setInterval(() => {
  const id = Date.now();
  const log = {
    id,
    timestamp: new Date().toISOString(),
    message: `Demo log entry ${id}`,
  };
  const errorLog = {
    id,
    timestamp: new Date().toISOString(),
    message: `Demo error entry ${id}`,
    error: true,
  };
  useLogsStore.getState().addLog(log);
  if (id % 5 === 0) {
    useLogsStore.getState().addErrorLog(errorLog);
  }
}, 10000);
