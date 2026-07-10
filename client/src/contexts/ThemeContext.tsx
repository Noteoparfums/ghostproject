import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ThemePreference = 'system' | 'dark' | 'light';
export type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  reducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = 'ui_theme';
const LEGACY_THEME_KEY = 'briefloom_theme';

function getStoredTheme(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY);
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    root.dataset.theme = theme;
    root.dataset.resolvedTheme = resolvedTheme;
    try {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.removeItem(LEGACY_THEME_KEY);
    } catch {
      return;
    }
  }, [resolvedTheme, theme]);

  useEffect(() => {
    const colorQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleColor = (event: MediaQueryListEvent) => setSystemTheme(event.matches ? 'dark' : 'light');
    const handleMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    colorQuery.addEventListener('change', handleColor);
    motionQuery.addEventListener('change', handleMotion);
    return () => {
      colorQuery.removeEventListener('change', handleColor);
      motionQuery.removeEventListener('change', handleMotion);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeState, reducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
