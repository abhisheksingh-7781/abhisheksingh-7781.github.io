'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { fadeUp, stagger, viewportOnce } from '@/animations/motion';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  /** Monospaced kicker, e.g. "02 / Skills". */
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Right-hand slot for filters, counters or a link. */
  aside?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  /** Tints the eyebrow marker with the data accent instead of the primary one. */
  tone?: 'build' | 'analyze';
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  aside,
  align = 'left',
  className,
  tone = 'build',
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn(
        'flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className,
      )}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger(0.08)}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        <motion.div
          variants={fadeUp}
          className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}
        >
          <span
            aria-hidden
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              tone === 'build' ? 'bg-accent' : 'bg-data',
            )}
          />
          <span className="eyebrow">{eyebrow}</span>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          className="mt-5 text-display-md font-semibold tracking-tight text-chalk"
        >
          {title}
        </motion.h2>

        {description ? (
          <motion.p variants={fadeUp} className="lead mt-5 max-w-measure">
            {description}
          </motion.p>
        ) : null}
      </div>

      {aside ? (
        <motion.div variants={fadeUp} className="shrink-0">
          {aside}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
