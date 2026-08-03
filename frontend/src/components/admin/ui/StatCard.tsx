import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  color?: 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';
}

const colorMap = {
  blue:    { bg: 'bg-blue-600/10',    icon: 'text-blue-400',    border: 'border-blue-600/20' },
  emerald: { bg: 'bg-emerald-600/10', icon: 'text-emerald-400', border: 'border-emerald-600/20' },
  violet:  { bg: 'bg-violet-600/10',  icon: 'text-violet-400',  border: 'border-violet-600/20' },
  amber:   { bg: 'bg-amber-600/10',   icon: 'text-amber-400',   border: 'border-amber-600/20' },
  rose:    { bg: 'bg-rose-600/10',    icon: 'text-rose-400',    border: 'border-rose-600/20' },
};

export default function StatCard({
  label,
  value,
  icon,
  trend,
  color = 'blue',
}: StatCardProps) {
  const c = colorMap[color];

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-5 flex items-start gap-4">
      {/* Icon */}
      <div className={cn('p-2.5 rounded-lg border', c.bg, c.border)}>
        <span className={cn('block w-5 h-5', c.icon)}>{icon}</span>
      </div>

      {/* Data */}
      <div className="flex-1 min-w-0">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-1 font-medium', trend.positive ? 'text-emerald-400' : 'text-rose-400')}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
