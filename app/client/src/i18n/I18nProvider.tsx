import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { en, type TranslationKey } from './en';
import { pt } from './pt';

export type Lang = 'en' | 'pt';
type Params = Record<string, string | number>;

const LANG_KEY = 'lang';
const dictionaries: Record<Lang, Record<TranslationKey, string>> = { en, pt };
const locales: Record<Lang, string> = { en: 'en-US', pt: 'pt-BR' };

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, params?: Params) => string;
  /** Translates an API error by its code, falling back to the server message. */
  translateError: (err: unknown, fallback: TranslationKey) => string;
  /** Translates a value coming from the server (area, slot...) by id, falling back to the given text. */
  translateData: (prefix: 'area' | 'slot' | 'status', id: string, fallback: string) => string;
  formatDateTime: (value: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function initialLang(): Lang {
  return localStorage.getItem(LANG_KEY) === 'pt' ? 'pt' : 'en';
}

function interpolate(text: string, params?: Params) {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = dictionaries[lang]['app.name'];
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    localStorage.setItem(LANG_KEY, next);
    setLangState(next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = dictionaries[lang];
    const t = (key: TranslationKey, params?: Params) => interpolate(dictionary[key], params);

    return {
      lang,
      setLang,
      t,
      translateError(err, fallback) {
        const code = (err as { code?: string } | null)?.code;
        const key = `error.${code}` as TranslationKey;
        if (code && key in dictionary) return t(key, (err as { params?: Params }).params);
        // Unmapped codes: prefer the server text, otherwise the generic fallback.
        return err instanceof Error && code && code !== 'UNKNOWN' ? err.message : t(fallback);
      },
      translateData(prefix, id, fallback) {
        const key = `${prefix}.${id}` as TranslationKey;
        return key in dictionary ? dictionary[key] : fallback;
      },
      formatDateTime: (value) => new Date(value).toLocaleString(locales[lang]),
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
