'use client';
/**
 * Reusable form field components for admin pages.
 * Consistent styling, accessible labels, error display.
 */
import { cn } from '@/lib/utils/cn';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

// ─── Base input class ─────────────────────────────────────────────────────────
const inputBase =
  'w-full border rounded-lg px-3 py-2.5 text-sm transition-all bg-white text-slate-900 placeholder-slate-400 ' +
  'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 ' +
  'disabled:bg-slate-50 disabled:cursor-not-allowed';

const errorBase = 'border-red-400 focus:ring-red-400 focus:border-red-400';
const normalBase = 'border-slate-300';

// ─── Label ────────────────────────────────────────────────────────────────────
export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-xs font-semibold text-slate-700 mb-1.5', className)}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// ─── FieldError ───────────────────────────────────────────────────────────────
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    {message}
  </p>;
}

// ─── FormField wrapper ────────────────────────────────────────────────────────
export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && <Label htmlFor={htmlFor} required={required}>{label}</Label>}
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
  wrapperClassName?: string;
}

export function Input({ error, label, hint, wrapperClassName, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <FormField label={label} htmlFor={inputId} required={props.required} error={error} hint={hint} className={wrapperClassName}>
      <input
        id={inputId}
        className={cn(inputBase, error ? errorBase : normalBase, className)}
        {...props}
      />
    </FormField>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  wrapperClassName?: string;
}

export function Textarea({ error, label, hint, wrapperClassName, className, id, rows = 4, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <FormField label={label} htmlFor={inputId} required={props.required} error={error} hint={hint} className={wrapperClassName}>
      <textarea
        id={inputId}
        rows={rows}
        className={cn(inputBase, 'resize-y', error ? errorBase : normalBase, className)}
        {...props}
      />
    </FormField>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  hint?: string;
  wrapperClassName?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export function Select({ error, label, hint, wrapperClassName, className, id, options, placeholder, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <FormField label={label} htmlFor={inputId} required={props.required} error={error} hint={hint} className={wrapperClassName}>
      <select
        id={inputId}
        className={cn(inputBase, 'cursor-pointer', error ? errorBase : normalBase, className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </FormField>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export function Checkbox({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className={cn('flex items-start gap-2.5 cursor-pointer group', className)}>
      <input
        type="checkbox"
        className="mt-0.5 w-4 h-4 accent-green-600 cursor-pointer"
        {...props}
      />
      <div>
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition">{label}</span>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
    </label>
  );
}
