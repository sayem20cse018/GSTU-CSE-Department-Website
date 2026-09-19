'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

const AUTOPLAY_MS = 5500;

export interface ApiSlide {
  id: string; title: string; subtitle: string; tag: string; imageUrl: string;
  overlayOpacity: number; primaryBtnLabel: string; primaryBtnHref: string;
  secondaryBtnLabel: string; secondaryBtnHref: string;
  align: 'left' | 'center'; isActive: boolean; sortOrder: number;
}

interface Slide {
  id: string; title: string; subtitle: string; tag?: string; imageUrl: string;
  overlayOpacity: number;
  primaryBtn?: { label: string; href: string };
  secondaryBtn?: { label: string; href: string };
  align: 'left' | 'center';
}

function apiToSlide(s: ApiSlide): Slide {
  return {
    id: s.id, title: s.title, subtitle: s.subtitle,
    tag: s.tag || undefined, imageUrl: s.imageUrl ?? '',
    overlayOpacity: s.overlayOpacity ?? 60,
    primaryBtn: s.primaryBtnLabel ? { label: s.primaryBtnLabel, href: s.primaryBtnHref } : undefined,
    secondaryBtn: s.secondaryBtnLabel ? { label: s.secondaryBtnLabel, href: s.secondaryBtnHref } : undefined,
    align: s.align ?? 'left',
  };
}

// ─── Single slide background ──────────────────────────────────────────────────
function SlideBackground({ slide, active }: { slide: Slide; active: boolean }) {
  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-1000',
        active ? 'opacity-100' : 'opacity-0',
      )}
      aria-hidden={!active}
    >
      {slide.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          aria-hidden="true"
          loading={active ? 'eager' : 'lazy'}
          // @ts-expect-error fetchpriority is valid HTML but not yet in React types
          fetchpriority={active ? 'high' : 'low'}
        />
      ) : (
        /* Gradient fallback */
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2e] via-[#1e3a5f] to-[#0d1b2e]" />
      )}
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: slide.overlayOpacity / 100 }}
      />
    </div>
  );
}

// ─── Slide text content ───────────────────────────────────────────────────────
function SlideContent({ slide, active }: { slide: Slide; active: boolean }) {
  return (
    <div
      className={cn(
        'relative z-10 flex flex-col',
        slide.align === 'center' ? 'items-center text-center' : 'items-start text-left',
        // only animate when active
        active ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      {/* Tag */}
      {slide.tag && (
        <div
          className={cn(
            'inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5',
            active ? 'slide-text-1' : 'opacity-0',
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true"/>
          <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest">{slide.tag}</span>
        </div>
      )}

      {/* Title */}
      <h1
        className={cn(
          'text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight max-w-3xl',
          active ? 'slide-text-2' : 'opacity-0',
        )}
      >
        {slide.title}
      </h1>

      {/* Subtitle */}
      <p
        className={cn(
          'mt-5 text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl',
          active ? 'slide-text-3' : 'opacity-0',
        )}
      >
        {slide.subtitle}
      </p>

      {/* Buttons */}
      {(slide.primaryBtn || slide.secondaryBtn) && (
        <div className={cn('mt-8 flex flex-wrap gap-3', active ? 'slide-text-3' : 'opacity-0')}>
          {slide.primaryBtn && (
            <Link
              href={slide.primaryBtn.href}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-600/30 text-sm"
            >
              {slide.primaryBtn.label}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          )}
          {slide.secondaryBtn && (
            <Link
              href={slide.secondaryBtn.href}
              className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 hover:bg-white/5 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
            >
              {slide.secondaryBtn.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main HeroSlider ──────────────────────────────────────────────────────────
export default function HeroSlider({ initialSlides = [] }: { initialSlides?: ApiSlide[] }) {
  // Hydrate from SSR-provided slides — no empty-state flash on first load
  const [slides,  setSlides]  = useState<Slide[]>(() => initialSlides.map(apiToSlide));
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Refresh slides from API (in case of updates since SSR)
    fetch('/api/public/hero-slides')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((d: { data?: ApiSlide[] }) => {
        const arr = d?.data;
        if (Array.isArray(arr) && arr.length) {
          setSlides(arr.map(apiToSlide));
          setCurrent(0);
        }
      })
      .catch(() => { /* keep SSR slides */ });
  }, []);

  const total = slides.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused]);

  // Keyboard navigation
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [next, prev]);

  return (
    <section
      className={cn('relative overflow-hidden z-0', slides.length === 0 ? 'bg-white' : 'bg-[#0d1b2e]')}
      style={{ height: '100vh', minHeight: '580px', maxHeight: '960px' }}
      aria-label="Hero slider"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide backgrounds ── */}
      {slides.map((slide, i) => (
        <SlideBackground key={slide.id} slide={slide} active={i === current} />
      ))}

      {/* ── Grid pattern overlay — only shown when slides have loaded ── */}
      {slides.length > 0 && (
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      )}

      {/* ── Slide content ── */}
      <div className="relative z-[2] h-full container-custom flex flex-col justify-center">
        {slides.length > 0 && slides[current] ? (
          <div key={current} className="slide-enter">
            <SlideContent slide={slides[current]} active />
          </div>
        ) : null}
      </div>

      {/* ── Left arrow ── */}
      {slides.length > 1 && (
      <button onClick={prev} aria-label="Previous slide"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[4]
                   w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 border border-white/20
                   hover:border-white/50 text-white flex items-center justify-center
                   transition-all backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      )}

      {/* ── Right arrow ── */}
      {slides.length > 1 && (
      <button onClick={next} aria-label="Next slide"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[4]
                   w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 border border-white/20
                   hover:border-white/50 text-white flex items-center justify-center
                   transition-all backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </button>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2"
        role="tablist" aria-label="Slide indicators">
        {slides.map((slide, i) => (
          <button key={slide.id} role="tab" aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`} onClick={() => goTo(i)}
            className={cn('transition-all duration-300 rounded-full focus-visible:ring-2 focus-visible:ring-white',
              i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70')}/>
        ))}
      </div>
      )}

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      {!paused && (
        <div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 z-[5] h-[3px] bg-blue-500 progress-bar"
          style={{ '--duration': `${AUTOPLAY_MS}ms` } as React.CSSProperties}
        />
      )}
    </section>
  );
}
