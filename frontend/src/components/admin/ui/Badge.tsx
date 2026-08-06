import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

// White-bg friendly colors — solid text, light tinted background
const variantMap: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100  text-amber-700  border-amber-200',
  danger:  'bg-red-100    text-red-700    border-red-200',
  info:    'bg-blue-100   text-blue-700   border-blue-200',
  neutral: 'bg-slate-100  text-slate-600  border-slate-200',
};

export default function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border',
      variantMap[variant],
      className,
    )}>
      {children}
    </span>
  );
}
