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
    <section
      className={cn('text-white pt-28 pb-14', className)}
      style={{ background: 'linear-gradient(135deg, #0b3d1f 0%, #134e2a 50%, #0a2e1a 100%)' }}
      aria-label={title}
    >
      <div className="container-custom">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs" style={{ color: 'rgba(187,247,208,0.6)' }}>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span aria-hidden="true" style={{ color: 'rgba(187,247,208,0.3)' }}>/</span>}
                  {crumb.href
                    ? <Link href={crumb.href} className="hover:text-white transition">{crumb.label}</Link>
                    : <span style={{ color: 'rgba(187,247,208,0.9)' }}>{crumb.label}</span>
                  }
                </li>
              ))}
            </ol>
          </nav>
        )}
        {tag && (
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: '#86efac' }}
          >
            {tag}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-3 text-base max-w-2xl leading-relaxed" style={{ color: 'rgba(187,247,208,0.7)' }}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
