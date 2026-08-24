import type Lenis from 'lenis';

declare global {
  interface Window {
    /** Set by <SmoothScroll> so utilities can drive the same instance. */
    __lenis?: Lenis;
  }
}

export {};
