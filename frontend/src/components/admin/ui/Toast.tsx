'use client';
/**
 * Toast notification system.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success('Saved!');
 *   toast.error('Something went wrong');
 *   toast.info('Loading…');
 *
 * Wrap your admin shell with <ToastProvider> once — it's already added to AdminShell.
 */
import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from 'react';
import { cn } from '@/lib/utils/cn';

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  success: (msg: string, duration?: number) => void;
  error:   (msg: string, duration?: number) => void;
  warning: (msg: string, duration?: number) => void;
  info:    (msg: string, duration?: number) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Config ───────────────────────────────────────────────────────────────────
const ICONS: Record<ToastVariant, string> = {
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error:   'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

const STYLES: Record<ToastVariant, { bg: string; border: string; icon: string; text: string }> = {
  success: { bg: 'bg-white', border: 'border-l-4 border-l-emerald-500 border border-emerald-100', icon: 'text-emerald-500', text: 'text-slate-800' },
  error:   { bg: 'bg-white', border: 'border-l-4 border-l-red-500    border border-red-100',     icon: 'text-red-500',     text: 'text-slate-800' },
  warning: { bg: 'bg-white', border: 'border-l-4 border-l-amber-500  border border-amber-100',   icon: 'text-amber-500',   text: 'text-slate-800' },
  info:    { bg: 'bg-white', border: 'border-l-4 border-l-blue-500   border border-blue-100',    icon: 'text-blue-500',    text: 'text-slate-800' },
};

// ─── Single toast item ─────────────────────────────────────────────────────────
function ToastItem({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const s = STYLES[item.variant];

  useEffect(() => {
    // Mount → fade in
    const show = requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss
    const hide = setTimeout(() => { setVisible(false); setTimeout(() => onRemove(item.id), 300); }, item.duration);
    return () => { cancelAnimationFrame(show); clearTimeout(hide); };
  }, [item.id, item.duration, onRemove]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      onClick={() => { setVisible(false); setTimeout(() => onRemove(item.id), 300); }}
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg cursor-pointer max-w-sm w-full',
        'transition-all duration-300',
        s.bg, s.border,
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
    >
      <svg className={cn('w-5 h-5 shrink-0 mt-0.5', s.icon)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS[item.variant]} />
      </svg>
      <p className={cn('text-sm font-medium flex-1', s.text)}>{item.message}</p>
      <button className="text-slate-400 hover:text-slate-600 transition shrink-0" aria-label="Dismiss">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  const add = useCallback((message: string, variant: ToastVariant, duration = 3500) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(p => [...p.slice(-4), { id, message, variant, duration }]);
  }, []);

  const ctx: ToastContextValue = {
    success: (msg, dur) => add(msg, 'success', dur),
    error:   (msg, dur) => add(msg, 'error',   dur ?? 5000),
    warning: (msg, dur) => add(msg, 'warning', dur),
    info:    (msg, dur) => add(msg, 'info',    dur),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Portal-like fixed stack */}
      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem item={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
