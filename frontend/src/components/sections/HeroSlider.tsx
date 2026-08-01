'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HERO_SLIDES, type Slide } from '@/config/slides';
import { STATS } from '@/constants';
import { cn } from '@/lib/utils/cn';

const AUTOPLAY_MS = 5500;

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
        <Image
          src={slide.imageUrl}
          alt=""
          fill
          className="object-cover object-center"
          priority={slide.id === HERO_SLIDES[0].id}
          sizes="100vw"
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
export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total    = HERO_SLIDES.length;

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
      className="relative overflow-hidden bg-[#0d1b2e]"
      style={{ height: 'calc(100vh - 56px)', minHeight: '560px', maxHeight: '900px' }}
      aria-label="Hero slider"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide backgrounds (all stacked, only active is visible) ────── */}
      {HERO_SLIDES.map((slide, i) => (
        <SlideBackground key={slide.id} slide={slide} active={i === current} />
      ))}

      {/* ── Grid pattern overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Slide content ─────────────────────────────────────────────────── */}
      <div className="relative z-[2] h-full container-custom flex flex-col justify-center">
        {/* Animated key forces re-mount → re-animation on slide change */}
        <div key={current} className="slide-enter">
          <SlideContent slide={HERO_SLIDES[current]} active />
        </div>
      </div>

      {/* ── Stats bar (bottom overlay) ────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 z-[3] hidden lg:block">
        <div className="bg-black/40 backdrop-blur-sm border-t border-white/10">
          <div className="container-custom py-4 grid grid-cols-4 divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col items-center px-6 first:pl-0 last:pr-0">
                <span className="text-2xl font-extrabold text-white leading-none">{s.value}</span>
                <span className="text-xs text-slate-400 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Left arrow ────────────────────────────────────────────────────── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[4]
                   w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 border border-white/20
                   hover:border-white/50 text-white flex items-center justify-center
                   transition-all backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* ── Right arrow ───────────────────────────────────────────────────── */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[4]
                   w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 border border-white/20
                   hover:border-white/50 text-white flex items-center justify-center
                   transition-all backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </button>

      {/* ── Dot indicators ───────────────────────────────────────────────── */}
      <div
        className="absolute bottom-20 lg:bottom-24 left-1/2 -translate-x-1/2 z-[4]
                   flex items-center gap-2"
        role="tablist"
        aria-label="Slide indicators"
      >
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              'transition-all duration-300 rounded-full focus-visible:ring-2 focus-visible:ring-white',
              i === current
                ? 'w-8 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70',
            )}
          />
        ))}
      </div>

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
