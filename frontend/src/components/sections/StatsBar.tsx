import { STATS } from '@/constants';

/**
 * Department stats bar — shown directly below the Hero Slider.
 * Desktop: horizontal 4-column strip
 * Mobile: 2×2 grid
 */
export default function StatsBar() {
  return (
    <section
      aria-label="Department statistics"
      style={{
        background: 'linear-gradient(135deg, #0b3d1f 0%, #0e4d2a 50%, #0b3d1f 100%)',
      }}
    >
      {/* Desktop (lg+) */}
      <div className="hidden lg:block">
        <div className="container-custom">
          <div className="grid grid-cols-4 divide-x divide-white/10">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center py-6 px-6 first:pl-0 last:pr-0
                           group hover:bg-white/5 transition-colors"
              >
                <span
                  className="text-3xl font-extrabold leading-none"
                  style={{ color: '#fbbf24' }}
                >
                  {s.value}
                </span>
                <span className="text-sm mt-1.5 font-medium" style={{ color: 'rgba(187,247,208,0.85)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / Tablet */}
      <div className="lg:hidden">
        <div className="container-custom py-4">
          <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-4 px-4">
                <span
                  className="text-2xl font-extrabold leading-none"
                  style={{ color: '#fbbf24' }}
                >
                  {s.value}
                </span>
                <span className="text-xs mt-1 font-medium" style={{ color: 'rgba(187,247,208,0.85)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
