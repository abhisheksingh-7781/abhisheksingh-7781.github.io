import type { ReactNode } from 'react';

import { isPlaceholder } from '@/data/placeholders';
import { cn } from '@/lib/utils';

/**
 * Placeholder primitives
 * ---------------------------------------------------------------------------
 * Anything Abhishek has not supplied yet renders through these, so an unfinished
 * value always *looks* unfinished instead of reading as a real claim.
 */

/** Inline bracketed value, e.g. [COMPANY NAME]. */
export function PlaceholderText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        // A dashed underline rather than a filled box: dense sections such as
        // the experience timeline are almost entirely placeholders today, and
        // stacked boxes turn into visual noise.
        'border-b border-dashed border-line-strong/80 pb-[0.1em]',
        'font-mono text-[0.85em] tracking-tight text-chalk-faint',
        className,
      )}
      data-placeholder="true"
    >
      {children}
    </span>
  );
}

/** Renders `value` as normal text, or as a placeholder chip when unset. */
export function Value({
  value,
  className,
  placeholderClassName,
}: {
  value?: string;
  className?: string;
  placeholderClassName?: string;
}) {
  if (isPlaceholder(value)) {
    return <PlaceholderText className={placeholderClassName}>{value || '[TBD]'}</PlaceholderText>;
  }
  return <span className={className}>{value}</span>;
}

/** Dashed media frame used wherever a real image has not been provided. */
export function PlaceholderMedia({
  label,
  className,
  hint,
  tone = 'build',
}: {
  label: string;
  className?: string;
  hint?: string;
  tone?: 'build' | 'analyze';
}) {
  return (
    <div
      className={cn('placeholder-frame grid-bg flex items-center justify-center', className)}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 opacity-[0.5]',
          tone === 'build'
            ? 'bg-[radial-gradient(60%_60%_at_50%_40%,rgb(var(--accent)/0.09),transparent_70%)]'
            : 'bg-[radial-gradient(60%_60%_at_50%_40%,rgba(224,164,88,0.09),transparent_70%)]',
        )}
      />
      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
        <span className="placeholder-label">{label}</span>
        {hint ? <span className="text-xs text-chalk-faint/70">{hint}</span> : null}
      </div>
    </div>
  );
}
