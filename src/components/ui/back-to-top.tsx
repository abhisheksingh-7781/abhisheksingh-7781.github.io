'use client';

import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Floating back-to-top control. The ring around it doubles as a page scroll
 * progress indicator, which keeps a second progress bar off the layout.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.3 });
    else
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-6 right-5 z-40 grid h-12 w-12 place-items-center rounded-full
                     border border-line-strong bg-ink-900/80 text-chalk-muted backdrop-blur-md
                     transition-colors hover:border-accent/50 hover:text-chalk sm:bottom-8 sm:right-8"
        >
          <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-accent/70"
              pathLength={1}
              style={{ pathLength: progress }}
            />
          </svg>
          <ArrowUp
            className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:-translate-y-0.5"
            strokeWidth={1.75}
          />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
