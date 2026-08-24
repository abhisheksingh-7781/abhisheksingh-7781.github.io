import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type TagProps = {
  children: ReactNode;
  tone?: 'neutral' | 'build' | 'analyze';
  size?: 'sm' | 'md';
  className?: string;
  interactive?: boolean;
};

/** Technology / skill chip. Used for tech tags, filters and metadata. */
export function Tag({
  children,
  tone = 'neutral',
  size = 'sm',
  className,
  interactive = false,
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-mono uppercase tracking-[0.08em] transition-colors duration-300',
        size === 'sm' ? 'px-2.5 py-1 text-[0.6875rem]' : 'px-3 py-1.5 text-xs',
        tone === 'neutral' && 'border-line bg-ink-800/60 text-chalk-muted',
        tone === 'build' && 'border-accent/25 bg-accent/[0.07] text-accent-soft',
        tone === 'analyze' && 'border-data/25 bg-data/[0.07] text-data-soft',
        interactive && 'hover:border-line-strong hover:text-chalk',
        className,
      )}
    >
      {children}
    </span>
  );
}
