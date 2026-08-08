'use client';
import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 300px scroll
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check immediately
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      onClick={scrollUp}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-[99999] w-12 h-12 rounded-full flex items-center justify-center
                 text-white font-bold shadow-2xl border-2 border-white/30
                 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, #0b3d1f, #1a7a3c)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 8px 24px rgba(26,122,60,0.5)',
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
      </svg>
    </button>
  );
}
