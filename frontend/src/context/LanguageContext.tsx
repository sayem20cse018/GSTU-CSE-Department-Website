'use client';
/**
 * LanguageContext — Bengali / English
 * Persists to localStorage. Updates <html lang>.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Lang = 'en' | 'bn';
interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: (en: string, bn: string) => string }
const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: (en) => en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('cse-lang') as Lang | null;
    const initial = saved ?? 'en';
    setLangState(initial);
    document.documentElement.setAttribute('lang', initial === 'bn' ? 'bn' : 'en');
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('cse-lang', l);
    document.documentElement.setAttribute('lang', l === 'bn' ? 'bn' : 'en');
  }

  const t = (en: string, bn: string) => lang === 'bn' ? bn : en;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
