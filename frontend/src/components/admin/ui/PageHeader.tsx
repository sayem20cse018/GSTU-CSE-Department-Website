import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6 pb-5 border-b-2', className)}
      style={{ borderColor: '#bbf7d0' }}>
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-1 h-6 rounded-full inline-block" style={{ background: 'linear-gradient(180deg,#16a34a,#0b3d1f)' }} aria-hidden="true"/>
          {title}
        </h2>
        {description && <p className="text-slate-500 text-sm mt-1 ml-3">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
