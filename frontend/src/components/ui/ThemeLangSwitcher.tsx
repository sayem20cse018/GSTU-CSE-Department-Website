'use client';
import { useTheme }  from '@/context/ThemeContext';
import { useLang }   from '@/context/LanguageContext';

export default function ThemeLangSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang }      = useLang();
  const isDark = theme === 'dark';
  const isBn   = lang === 'bn';

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {/* Language toggle */}
      <button
        onClick={() => setLang(isBn ? 'en' : 'bn')}
        title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
        className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all select-none"
        style={{
          borderColor: 'rgba(26,122,60,0.35)',
          color: '#1a7a3c',
          background: isBn ? 'rgba(26,122,60,0.08)' : 'transparent',
        }}
        aria-pressed={isBn}
      >
        <span>{isBn ? 'EN' : 'বাং'}</span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all"
        style={{
          borderColor: 'rgba(26,122,60,0.35)',
          color: '#1a7a3c',
          background: isDark ? 'rgba(26,122,60,0.08)' : 'transparent',
        }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          /* Sun icon */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
          </svg>
        ) : (
          /* Moon icon */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
