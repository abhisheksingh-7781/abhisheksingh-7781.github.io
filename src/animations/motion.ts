import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion language
 * ---------------------------------------------------------------------------
 * One easing curve, three durations, a handful of reusable variants. Sections
 * compose these rather than inventing per-component animation, which keeps the
 * whole site feeling like it moves according to a single set of rules.
 *
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user">
 * in the root layout, so these variants stay declarative.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.28,
  base: 0.55,
  slow: 0.85,
  cinematic: 1.15,
} as const;

export const transition = (
  duration: number = DURATION.base,
  delay = 0,
): Transition => ({ duration, delay, ease: EASE });

export const spring: Transition = { type: 'spring', stiffness: 240, damping: 26, mass: 0.7 };

/**
 * Default viewport config: fire once, just after the element crosses into the
 * lower part of the viewport.
 *
 * Deliberately no `amount` threshold. A fractional threshold can never be met
 * by a container taller than the viewport (25% of a 2500px dashboard is more
 * than a phone screen), which would leave whole sections stuck at opacity 0.
 * The negative bottom margin gives the same "reveal slightly late" feel while
 * staying correct at every element size.
 */
export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: transition(DURATION.base) },
};

export const fadeUpLarge: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: transition(DURATION.slow) },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition(DURATION.base) },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: transition(DURATION.slow) },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: transition(DURATION.slow) },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: transition(DURATION.slow) },
};

/** Parent that staggers its children. Children should use `fadeUp` or similar. */
export const stagger = (staggerChildren = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const staggerContainer: Variants = stagger();

/** Word-by-word heading reveal. Wrap each word in a <span> using this variant. */
export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: DURATION.cinematic, ease: EASE } },
};

/** Line-by-line clip reveal for large display type. */
export const lineReveal: Variants = {
  hidden: { y: '105%', opacity: 0 },
  visible: (i = 0) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: DURATION.cinematic, ease: EASE, delay: 0.08 * (i as number) },
  }),
};

/** Left-to-right rule that draws itself into view. */
export const drawX: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: transition(DURATION.slow) },
};

/** Top-to-bottom connector line, used by the timeline and workflow rails. */
export const drawY: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 1.1, ease: EASE_IN_OUT } },
};

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition(DURATION.fast) },
  exit: { opacity: 0, transition: transition(DURATION.fast) },
};

export const modalPanel: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: transition(DURATION.base) },
  exit: { opacity: 0, y: 16, scale: 0.99, transition: transition(DURATION.fast) },
};

export const mobileMenu: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE, staggerChildren: 0.05, delayChildren: 0.08 } },
  exit: { opacity: 0, y: -8, transition: transition(DURATION.fast) },
};

/** Standard press feedback for buttons and cards. */
export const press = { scale: 0.97 };
