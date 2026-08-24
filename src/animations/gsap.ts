'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP is used only where Framer Motion would be awkward: scrubbed,
 * scroll-linked timelines. Everything else stays in Framer Motion.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === 'undefined') return { gsap, ScrollTrigger };
  gsap.registerPlugin(ScrollTrigger);
  // Transforms are the only thing we animate on scroll, so let GSAP use the
  // GPU-friendly path and avoid layout thrash.
  gsap.defaults({ ease: 'power2.out', overwrite: 'auto' });
  registered = true;
  return { gsap, ScrollTrigger };
}

/**
 * Runs `build` inside a gsap.context scoped to `scope`, and reverts everything
 * (tweens + ScrollTriggers) on cleanup. Always use this from an effect so no
 * trigger survives a route change or fast-refresh.
 */
export function createScrollScene(
  scope: Element | null,
  build: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void,
): () => void {
  if (!scope || typeof window === 'undefined') return () => {};
  const api = registerGsap();
  const ctx = gsap.context(() => build(api), scope);
  return () => ctx.revert();
}

export { gsap, ScrollTrigger };
