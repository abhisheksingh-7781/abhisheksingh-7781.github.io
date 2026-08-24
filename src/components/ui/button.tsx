'use client';

import { motion, useSpring } from 'framer-motion';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { forwardRef, useEffect } from 'react';

import { useMagnetic } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-[background-color,border-color,color,box-shadow] duration-300 ease-smooth ' +
  'disabled:pointer-events-none disabled:opacity-45';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-ink-950 hover:bg-accent-soft shadow-[0_10px_40px_-18px_rgba(53,199,154,0.9)]',
  secondary:
    'border border-line-strong bg-ink-850/60 text-chalk backdrop-blur-sm hover:border-accent/45 hover:bg-ink-800/70',
  ghost: 'text-chalk-muted hover:text-chalk',
  quiet:
    'border border-line bg-transparent text-chalk-muted hover:border-line-strong hover:text-chalk',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[3.25rem] px-7 text-[0.9375rem]',
};

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  /** Adds pointer-follow attraction on fine-pointer devices. */
  magnetic?: boolean;
  children: ReactNode;
} & ComponentPropsWithoutRef<'button'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', magnetic = false, className, children, ...props },
  forwardedRef,
) {
  const { ref, offset, reset } = useMagnetic(magnetic ? 0.25 : 0);
  const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.5 });

  useEffect(() => {
    x.set(offset.x);
    y.set(offset.y);
  }, [offset.x, offset.y, x, y]);

  return (
    <motion.button
      ref={(node) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      style={magnetic ? { x, y } : undefined}
      whileTap={{ scale: 0.97 }}
      onPointerLeave={reset}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(props as ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
});

export type ButtonLinkProps = {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  children: ReactNode;
} & ComponentPropsWithoutRef<'a'>;

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  { variant = 'primary', size = 'md', magnetic = false, className, children, ...props },
  forwardedRef,
) {
  const { ref, offset, reset } = useMagnetic(magnetic ? 0.25 : 0);
  const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.5 });

  useEffect(() => {
    x.set(offset.x);
    y.set(offset.y);
  }, [offset.x, offset.y, x, y]);

  return (
    <motion.a
      ref={(node) => {
        ref.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      style={magnetic ? { x, y } : undefined}
      whileTap={{ scale: 0.97 }}
      onPointerLeave={reset}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(props as ComponentPropsWithoutRef<typeof motion.a>)}
    >
      {children}
    </motion.a>
  );
});
