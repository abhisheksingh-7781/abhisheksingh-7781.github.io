'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

import { SmoothScroll } from './smooth-scroll';
import { ThemeProvider } from './theme-provider';

/**
 * `reducedMotion="user"` makes every Framer Motion animation on the site
 * respect the OS setting without each component having to check for it.
 *
 * ThemeProvider sits outermost so anything below it can read the active theme —
 * including the canvas and chart code, which needs real colour values rather
 * than class names.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <SmoothScroll>{children}</SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  );
}
