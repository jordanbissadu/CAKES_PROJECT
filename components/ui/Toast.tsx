"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastContextValue = (message: string) => void;

const ToastContext = createContext<ToastContextValue | null>(null);

/** Wrap a subtree to enable `useToast()`. Renders a single centered pill. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((message: string) => {
    setText(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setText(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {text ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-[90px] left-1/2 z-[70] max-w-[90vw] -translate-x-1/2 rounded-pill bg-vin px-5 py-3 text-sm font-bold text-blush"
          style={{
            boxShadow: "0 12px 30px rgba(100,29,52,.3)",
            animation: "idiToast .3s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {text}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
