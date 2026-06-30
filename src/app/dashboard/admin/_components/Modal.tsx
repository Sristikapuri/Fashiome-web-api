"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[1.75rem] border border-[#e7c7bc] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(255,249,245,0.98))] p-6 shadow-[0_24px_80px_rgba(36,22,18,0.2)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h3 className="mb-4 text-xl font-black text-[#311812]">{title}</h3>
        {children}
      </div>
    </div>
  );
}
