'use client';

import { useEffect, useState } from 'react';

import { useTheme } from '@/components/providers/theme-provider';

/**
 * THEME TOKENS AT RUNTIME
 * ---------------------------------------------------------------------------
 * Most of the site colours itself with Tailwind classes, which follow the
 * theme automatically. Canvas and Recharts cannot: they need concrete colour
 * strings passed as values. This reads the same CSS variables the classes use,
 * so there is still exactly one definition of the palette.
 */

const TOKENS = [
  'ink-950',
  'ink-850',
  'ink-800',
  'ink-600',
  'chalk',
  'chalk-muted',
  'chalk-faint',
  'accent',
  'data',
  'line',
] as const;

type TokenName = (typeof TOKENS)[number];

/** Each value is an "R G B" triplet, ready for `rgb()`. */
export type ThemeTokens = Record<TokenName, string>;

/**
 * Used for the server render and the first client frame, before computed
 * styles can be read. Matches the dark palette in globals.css.
 */
const FALLBACK: ThemeTokens = {
  'ink-950': '8 9 11',
  'ink-850': '15 17 22',
  'ink-800': '20 23 29',
  'ink-600': '39 44 53',
  chalk: '244 245 247',
  'chalk-muted': '154 161 172',
  'chalk-faint': '102 109 120',
  accent: '53 199 154',
  data: '224 164 88',
  line: '255 255 255',
};

function readTokens(): ThemeTokens {
  const styles = getComputedStyle(document.documentElement);
  const result = {} as ThemeTokens;

  for (const token of TOKENS) {
    const value = styles.getPropertyValue(`--${token}`).trim();
    result[token] = value || FALLBACK[token];
  }

  return result;
}

/** `rgb(var(--x))` equivalent for values that must be strings. */
export const solid = (triplet: string) => `rgb(${triplet})`;

/** `rgb(var(--x) / a)` equivalent. */
export const alpha = (triplet: string, a: number) => `rgb(${triplet} / ${a})`;

/**
 * Re-reads the palette whenever the theme changes. The dependency is the
 * resolved theme rather than the class, because the provider only updates it
 * after the class is already on the element — so the computed values are the
 * new ones by the time this runs.
 */
export function useThemeTokens(): ThemeTokens {
  const { resolvedTheme } = useTheme();
  const [tokens, setTokens] = useState<ThemeTokens>(FALLBACK);

  useEffect(() => {
    setTokens(readTokens());
  }, [resolvedTheme]);

  return tokens;
}
