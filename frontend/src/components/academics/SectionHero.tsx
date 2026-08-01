import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface Breadcrumb { label: string; href?: string }

interface SectionHeroProps {
  tag?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  className?: string;
}

export default function SectionHero({ tag, title, description, breadcrumbs, className }: SectionHeroProps) {
  return (
    <section className={cn('bg-[#0d1b2e] text-white pt-28 pb-14', className)} aria-label={title}>
      <div className="container-custom">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true" className="text-slate-600">/</span>}
                  {crumb.href
                    ? <Link href={crumb.href} className="hover:text-white transition">{crumb.label}</Link>
                    : <span className="text-slate-300">{crumb.label}</span>
                  }
                </li>
              ))}
            </ol>
          </nav>
        )}
        {tag && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-3">
            {tag}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
        {description && <p className="mt-3 text-slate-400 text-base max-w-2xl leading-relaxed">{description}</p>}
      </div>
    </section>
  );
}
