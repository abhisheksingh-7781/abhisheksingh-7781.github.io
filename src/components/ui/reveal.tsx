'use client';

import { motion, type Target, type Transition, type Variants } from 'framer-motion';
import { useMemo, type ElementType, type ReactNode } from 'react';

import { fadeUp, stagger, viewportOnce } from '@/animations/motion';
import { cn } from '@/lib/utils';

/**
 * Motion components must be created once, never during render: a fresh
 * component identity on every render remounts the whole subtree, which throws
 * away animation state and can collapse document height mid-scroll.
 */
const motionTagCache = new Map<ElementType, ElementType>();

function motionTag(as: ElementType): ElementType {
  const cached = motionTagCache.get(as);
  if (cached) return cached;
  const created = motion.create(as as never) as ElementType;
  motionTagCache.set(as, created);
  return created;
}

/**
 * Applies `delay` by rewriting the variant rather than passing a `transition`
 * prop. A variant that defines its own transition — as every variant in
 * animations/motion.ts does — takes precedence over the component's, so the
 * prop form was silently doing nothing.
 */
function useDelayedVariants(variants: Variants, delay: number): Variants {
  return useMemo(() => {
    const visible = variants.visible;
    // A variant can be a function of `custom`; leave those to their author.
    if (!delay || !visible || typeof visible === 'function') return variants;

    const { transition, ...target } = visible as Target & { transition?: Transition };
    return { ...variants, visible: { ...target, transition: { ...transition, delay } } };
  }, [variants, delay]);
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Override the default fade-up variant. */
  variants?: Variants;
  delay?: number;
  as?: ElementType;
  /** Re-run the animation every time the element enters the viewport. */
  repeat?: boolean;
};

/**
 * Section-level scroll reveal. Prefer wrapping a group of elements in one
 * <Reveal> (or a <RevealGroup>) over animating every node independently.
 */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = 'div',
  repeat = false,
}: RevealProps) {
  const MotionTag = motionTag(as) as typeof motion.div;
  const delayed = useDelayedVariants(variants, delay);

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={repeat ? { margin: '0px 0px -12% 0px' } : viewportOnce}
      variants={delayed}
    >
      {children}
    </MotionTag>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  step?: number;
  delay?: number;
  as?: ElementType;
};

/** Staggering parent. Children should be <RevealItem> (or use `fadeUp`). */
export function RevealGroup({
  children,
  className,
  step = 0.07,
  delay = 0,
  as = 'div',
}: RevealGroupProps) {
  const MotionTag = motionTag(as) as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger(step, delay)}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: ElementType;
}) {
  const MotionTag = motionTag(as) as typeof motion.div;
  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}

/** Hairline rule that draws itself in from the left. */
export function RevealRule({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('h-px w-full origin-left bg-line', className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
