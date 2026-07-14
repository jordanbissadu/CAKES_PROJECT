"use client";

import { useEffect } from "react";

/** Centered bottom-anchored sheet (new order). Respects safe-area on mobile. */
export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-[rgba(58,20,32,0.4)]"
        style={{ animation: "idiFade .2s ease" }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed bottom-0 left-1/2 z-[61] max-h-[92vh] w-[min(520px,100%)] -translate-x-1/2 overflow-y-auto bg-blanc"
        style={{
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -18px 48px rgba(100,29,52,.22)",
          animation: "idiPop .26s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {children}
      </div>
    </>
  );
}
