'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

export const LOCALES = [
  { code: 'en' as const, label: 'English', dir: 'ltr' as const },
  { code: 'ar' as const, label: 'العربية', dir: 'rtl' as const },
  { code: 'id' as const, label: 'Indonesia', dir: 'ltr' as const },
];

export type LocaleCode = 'en' | 'ar' | 'id';
export type Direction = 'ltr' | 'rtl';

type Messages = Record<string, unknown>;

interface LocaleContextValue {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  t: (key: string) => string;
  dir: Direction;
  messages: Messages;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getNestedValue(obj: Messages, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

// Cache loaded locale data
const localeCache: Record<string, Messages> = {};

async function loadLocale(code: LocaleCode): Promise<Messages> {
  if (localeCache[code]) return localeCache[code];
  const mod = await import(`./locales/${code}.json`);
  const msgs = mod.default as Messages;
  localeCache[code] = msgs;
  return msgs;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>('en');
  const [messages, setMessages] = useState<Messages>({});

  // Load initial locale on mount
  useEffect(() => {
    let cancelled = false;
    loadLocale('en').then((msgs) => {
      if (!cancelled) setMessages(msgs);
    });
    return () => { cancelled = true; };
  }, []);

  const setLocale = useCallback(
    (l: LocaleCode) => {
      setLocaleState(l);
      loadLocale(l).then((msgs) => setMessages(msgs));
      // Set document dir for RTL support
      const loc = LOCALES.find((x) => x.code === l);
      if (loc) {
        document.documentElement.dir = loc.dir;
        document.documentElement.lang = l;
      }
    },
    []
  );

  const t = useCallback(
    (key: string): string => {
      const val = getNestedValue(messages, key);
      if (typeof val === 'string') return val;
      return key;
    },
    [messages]
  );

  const dir = (LOCALES.find((l) => l.code === locale)?.dir ?? 'ltr') as Direction;

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: 'en' as LocaleCode,
      setLocale: (_l: LocaleCode) => {},
      t: (key: string) => key,
      dir: 'ltr' as Direction,
      messages: {} as Messages,
    };
  }
  return ctx;
}

export function useTArray(key: string): unknown[] {
  const { messages, t } = useLocale();
  const val = getNestedValue(messages, key);
  if (Array.isArray(val)) return val;
  return [];
}