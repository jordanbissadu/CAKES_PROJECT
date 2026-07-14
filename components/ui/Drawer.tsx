"use client";

import { useEffect } from "react";

/** Right-side slide-in panel (order detail). Full-width on mobile. */
export function Drawer({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
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
        className="fixed inset-0 z-50 bg-[rgba(58,20,32,0.38)]"
        style={{ animation: "idiFade .2s ease" }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="fixed top-0 right-0 bottom-0 z-[51] flex w-full flex-col bg-blanc nav:w-[min(460px,100%)]"
        style={{
          boxShadow: "-18px 0 48px rgba(100,29,52,.18)",
          animation: "idiSlideIn .28s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {children}
      </div>
    </>
  );
}
