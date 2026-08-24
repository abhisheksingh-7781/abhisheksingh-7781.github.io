'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

import { SmoothScroll } from './smooth-scroll';

/**
 * `reducedMotion="user"` makes every Framer Motion animation on the site
 * respect the OS setting without each component having to check for it.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>{children}</SmoothScroll>
    </MotionConfig>
  );
}
