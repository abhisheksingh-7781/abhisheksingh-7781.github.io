'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * THEME
 * ---------------------------------------------------------------------------
 * Three states, not two. "system" is a real choice — it keeps following the OS
 * as it changes through the day — and it stays the default until the visitor
 * picks a side, at which point that choice is remembered.
 *
 * The class lands on <html> before first paint via THEME_SCRIPT below, so the
 * page never flashes the wrong theme. This provider only takes over afterwards.
 */

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'portfolio-theme';

/** Browser-chrome colour on mobile, kept in step with the resolved theme. */
const THEME_COLOR: Record<ResolvedTheme, string> = {
  light: '#F6F7F9',
  dark: '#08090B',
};

/**
 * Runs before React, before paint, from a blocking <script> in <head>.
 * Written as a string because it must not wait for the bundle to load.
 *
 * Kept deliberately tiny and wrapped in try/catch: localStorage throws in
 * private-mode Safari and behind some cookie policies, and a theme preference
 * is never worth breaking the page over.
 */
export const THEME_SCRIPT = `(function(){try{
var s=localStorage.getItem('${THEME_STORAGE_KEY}');
var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',d);
}catch(e){}})();`;

type ThemeContextValue = {
  /** What the visitor chose, which may be 'system'. */
  theme: Theme;
  /** What is actually on screen right now. */
  resolvedTheme: ResolvedTheme;
  setTheme: (next: Theme) => void;
  /** Flips to the opposite of what is currently showing. */
  toggle: () => void;
  /** False until after hydration, when the real preference is known. */
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // The server has no preference to render, so both values start neutral and
  // are corrected on mount. `ready` lets the UI avoid asserting a theme before
  // it knows one.
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [ready, setReady] = useState(false);

  /**
   * Applies a theme to the document. Transitions are suppressed for one frame
   * around the change: without that, every element carrying a colour
   * transition would cross-fade and the toggle would feel like a slow wipe
   * rather than a switch.
   */
  const apply = useCallback((resolved: ResolvedTheme) => {
    const root = document.documentElement;

    root.setAttribute('data-theme-switching', '');
    root.classList.toggle('dark', resolved === 'dark');

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[resolved]);

    // Two frames: one for the class to take effect, one to re-enable
    // transitions without them catching the change.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.removeAttribute('data-theme-switching'));
    });

    setResolvedTheme(resolved);
  }, []);

  // Adopt whatever the pre-paint script already decided.
  useEffect(() => {
    const stored = readStoredTheme();
    setThemeState(stored);
    setResolvedTheme(stored === 'system' ? systemTheme() : stored);
    setReady(true);
  }, []);

  // Only while on 'system' does the OS keep a say.
  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply(mql.matches ? 'dark' : 'light');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [theme, apply]);

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
        else localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // A blocked storage API costs persistence, not function.
      }
      apply(next === 'system' ? systemTheme() : next);
    },
    [apply],
  );

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggle, ready }),
    [theme, resolvedTheme, setTheme, toggle, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return context;
}
