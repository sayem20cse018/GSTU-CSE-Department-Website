import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        <div className="flex items-center gap-2.5">
          <div
            className="w-1 h-6 rounded-full shrink-0"
            style={{ background: 'linear-gradient(180deg,#16a34a,#166534)' }}
            aria-hidden="true"
          />
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
        {description && (
          <p className="text-sm text-slate-500 mt-1 ml-3.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
