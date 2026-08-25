'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

/**
 * Light/dark switch.
 *
 * The icon crossfade is driven by the `dark:` variant rather than React state,
 * on purpose: the class is already on <html> before first paint, so the right
 * icon is correct in the very first frame. Reading it from state instead would
 * show the server's guess until hydration caught up.
 *
 * State is still used for the label, where being briefly generic costs nothing
 * but being briefly wrong would mislead a screen reader.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggle, ready } = useTheme();

  const label = ready
    ? `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`
    : 'Toggle theme';

  const iconBase =
    'absolute inset-0 h-[1.05rem] w-[1.05rem] transition-[opacity,transform] duration-500 ease-smooth';

  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      className={cn(
        'group relative grid h-10 w-10 place-items-center rounded-full border border-line',
        'bg-ink-900/60 text-chalk-muted backdrop-blur-md',
        'transition-colors duration-300 hover:border-line-strong hover:text-chalk',
        className,
      )}
    >
      <span aria-hidden className="relative block h-[1.05rem] w-[1.05rem]">
        <Sun
          strokeWidth={1.75}
          className={cn(iconBase, 'rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0')}
        />
        <Moon
          strokeWidth={1.75}
          className={cn(iconBase, 'rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100')}
        />
      </span>
    </button>
  );
}
