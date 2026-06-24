'use client';

import { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'crashlab:theme';

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggle: () => {},
  mounted: false,
});

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch { /* ignore */ }
  return 'light';
}

function subscribeToMount(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  // Trigger once on subscribe (post-hydration)
  const id = requestAnimationFrame(() => cb());
  return () => cancelAnimationFrame(id);
}

function getMountSnapshot(): boolean {
  return typeof document !== 'undefined';
}

function getMountServerSnapshot(): boolean {
  return false;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const mounted = useSyncExternalStore(subscribeToMount, getMountSnapshot, getMountServerSnapshot);

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.classList.toggle('dark', next === 'dark');
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
