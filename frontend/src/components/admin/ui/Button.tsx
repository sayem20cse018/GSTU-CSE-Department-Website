import { cn } from '@/lib/utils/cn';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantMap: Record<ButtonVariant, string> = {
  primary:   'bg-blue-600 hover:bg-blue-500 text-white shadow-sm',
  secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
  danger:    'bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-600/20',
  ghost:     'hover:bg-white/5 text-slate-400 hover:text-white',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-sm rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantMap[variant],
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="w-4 h-4 shrink-0" aria-hidden="true">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
