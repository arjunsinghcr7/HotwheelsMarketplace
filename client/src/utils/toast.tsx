import React, { useEffect, useState } from 'react';

// Lightweight, dependency-free toast system. Call `toast(message, type)` from
// anywhere; render <Toaster /> once near the app root.

export type ToastType = 'success' | 'error' | 'info';
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let items: ToastItem[] = [];
const listeners = new Set<(items: ToastItem[]) => void>();
let nextId = 1;

function emit() {
  for (const l of listeners) l(items);
}

export function toast(message: string, type: ToastType = 'success', durationMs = 3200) {
  const id = nextId++;
  items = [...items, { id, message, type }];
  emit();
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, durationMs);
}

const ICON: Record<ToastType, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
};

const ACCENT: Record<ToastType, string> = {
  success: 'text-secondary',
  error: 'text-primary',
  info: 'text-tertiary',
};

export const Toaster: React.FC = () => {
  const [list, setList] = useState<ToastItem[]>(items);

  useEffect(() => {
    const l = (next: ToastItem[]) => setList([...next]);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none" aria-live="polite" aria-atomic="true">
      {list.map((t) => (
        <div
          key={t.id}
          role="status"
          className="animate-slide-up pointer-events-auto flex items-center gap-2 pl-3 pr-4 py-3 rounded-xl bg-surface-container-high/95 backdrop-blur border border-outline-variant shadow-2xl text-on-surface max-w-xs"
        >
          <span className={`material-symbols-outlined ${ACCENT[t.type]}`}>{ICON[t.type]}</span>
          <span className="text-label-md">{t.message}</span>
        </div>
      ))}
    </div>
  );
};
