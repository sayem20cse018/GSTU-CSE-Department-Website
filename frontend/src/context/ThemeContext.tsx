'use client';
/**
 * ThemeContext — Light / Dark mode
 * Persists to localStorage. Applies 'dark' class to <html>.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeCtx { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void }
const Ctx = createContext<ThemeCtx>({ theme: 'light', toggleTheme: () => {}, setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  // Hydrate from localStorage + respect system preference
  useEffect(() => {
    const saved = localStorage.getItem('cse-theme') as Theme | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = saved ?? preferred;
    setThemeState(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem('cse-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  }

  return (
    <Ctx.Provider value={{ theme, toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light'), setTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
