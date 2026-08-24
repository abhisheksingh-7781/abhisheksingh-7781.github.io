'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

import { registerGsap } from '@/animations/gsap';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger and Lenis
 * share one RAF loop (two loops would produce visible jitter on scrubbed
 * timelines). Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const { gsap, ScrollTrigger } = registerGsap();

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch feels better than an emulated one.
      syncTouch: false,
      touchMultiplier: 1.6,
    });

    window.__lenis = lenis;

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', onLenisScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  return <>{children}</>;
}
