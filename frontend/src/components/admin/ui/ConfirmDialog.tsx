'use client';
/**
 * ConfirmDialog — replaces `window.confirm()` with a polished modal.
 *
 * Usage:
 *   const { confirm, ConfirmDialog } = useConfirm();
 *   ...
 *   const ok = await confirm({ title: 'Delete item?', description: '...' });
 *   if (ok) { await adminDelete(...); }
 *   ...
 *   return <>{ConfirmDialog}</>;
 */
import { useState, useCallback, type ReactNode } from 'react';
import Button from './Button';

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

interface DialogState extends ConfirmOptions {
  open: boolean;
  resolve: ((v: boolean) => void) | null;
}

const ICON_PATH: Record<string, string> = {
  danger:  'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

const ICON_COLORS: Record<string, string> = {
  danger:  'text-red-500 bg-red-50',
  warning: 'text-amber-500 bg-amber-50',
  info:    'text-blue-500 bg-blue-50',
};

export function useConfirm(): {
  confirm: (opts?: ConfirmOptions) => Promise<boolean>;
  ConfirmDialog: ReactNode;
} {
  const [state, setState] = useState<DialogState>({
    open: false, resolve: null,
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Confirm', cancelLabel: 'Cancel',
    variant: 'danger',
  });

  const confirm = useCallback((opts?: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setState({
        open: true,
        resolve,
        title:        opts?.title        ?? 'Are you sure?',
        description:  opts?.description  ?? 'This action cannot be undone.',
        confirmLabel: opts?.confirmLabel ?? 'Confirm',
        cancelLabel:  opts?.cancelLabel  ?? 'Cancel',
        variant:      opts?.variant      ?? 'danger',
      });
    });
  }, []);

  function respond(value: boolean) {
    state.resolve?.(value);
    setState(p => ({ ...p, open: false, resolve: null }));
  }

  const variant = state.variant ?? 'danger';

  const dialog: ReactNode = state.open ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => respond(false)}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4 animate-[fadeIn_0.15s_ease]">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${ICON_COLORS[variant]}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATH[variant]} />
          </svg>
        </div>
        {/* Text */}
        <div className="text-center">
          <h3 id="confirm-title" className="text-base font-bold text-slate-900">{state.title}</h3>
          {state.description && (
            <p className="text-sm text-slate-500 mt-1.5">{state.description}</p>
          )}
        </div>
        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <Button variant="secondary" onClick={() => respond(false)} className="flex-1">
            {state.cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={() => respond(true)}
            className="flex-1"
          >
            {state.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmDialog: dialog };
}
