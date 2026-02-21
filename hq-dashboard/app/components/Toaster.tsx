"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Toast = {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  ttl?: number;
};

type Ctx = {
  push: (t: Omit<Toast, "id">) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToaster() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("Toaster missing");
  return ctx;
}

export default function ToasterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2, 8);
    const toast: Toast = { id, ttl: 3000, ...t };
    setItems((xs) => [...xs, toast]);
    const timeout = setTimeout(() => {
      setItems((xs) => xs.filter((x) => x.id !== id));
    }, toast.ttl);
    // if action happens, dismiss immediately after handler
    const onAction = toast.onAction;
    if (onAction) {
      // wrap to auto-dismiss
      toast.onAction = () => {
        try {
          onAction();
        } finally {
          clearTimeout(timeout);
          setItems((xs) => xs.filter((x) => x.id !== id));
        }
      };
    }
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] space-y-2 w-[92vw] max-w-sm">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-white/10 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.55)] p-3 text-sm text-white/90 flex items-center justify-between"
          >
            <div className="pr-3 truncate">{t.message}</div>
            {t.onAction && (
              <button
                onClick={t.onAction}
                className="rounded-md bg-accent-cyan text-black text-xs px-2 py-1 font-semibold hover:brightness-110"
              >
                {t.actionLabel ?? "Undo"}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
