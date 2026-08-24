'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { isPlaceholder } from '@/data/placeholders';
import { cn } from '@/lib/utils';

type SmartLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Class applied only when the href is still a placeholder. */
  placeholderClassName?: string;
  external?: boolean;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children' | 'className'>;

/**
 * Renders a real anchor when a URL exists, and an inert, clearly-marked element
 * when it is still a placeholder. This is how the site avoids shipping dead or
 * invented links.
 */
export function SmartLink({
  href,
  children,
  className,
  placeholderClassName,
  external = true,
  ...props
}: SmartLinkProps) {
  if (isPlaceholder(href)) {
    return (
      <span
        aria-disabled="true"
        title="Add this URL in src/data/links.ts"
        data-placeholder="true"
        className={cn('cursor-not-allowed opacity-60', className, placeholderClassName)}
        {...(props as ComponentPropsWithoutRef<'span'>)}
      >
        {children}
      </span>
    );
  }

  const isMail = href.startsWith('mailto:');

  return (
    <a
      href={href}
      className={className}
      {...(external && !isMail ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
