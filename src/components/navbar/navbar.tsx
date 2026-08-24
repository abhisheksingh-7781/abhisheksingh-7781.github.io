'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { EASE } from '@/animations/motion';
import { Button } from '@/components/ui/button';
import { navItems } from '@/data/navigation';
import { profile } from '@/data/profile';
import { useActiveSection, useScrolled } from '@/lib/hooks';
import { cn, scrollToSection } from '@/lib/utils';

import { MobileMenu } from './mobile-menu';

export function Navbar() {
  const scrolled = useScrolled(32);
  const [menuOpen, setMenuOpen] = useState(false);
  const ids = useMemo(() => navItems.map((item) => item.id), []);
  const active = useActiveSection(ids);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            'transition-[background-color,border-color,backdrop-filter] duration-500 ease-smooth',
            scrolled || menuOpen
              ? 'border-b border-line bg-ink-950/72 backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent',
          )}
        >
          <div className="shell">
            <div
              className={cn(
                'flex items-center justify-between transition-[height] duration-500 ease-smooth',
                scrolled ? 'h-14' : 'h-[4.5rem] md:h-20',
              )}
            >
              {/* Wordmark */}
              <button
                type="button"
                onClick={() => scrollToSection('home')}
                className="group flex items-center gap-2.5 rounded-full py-1 pr-2 text-left"
                aria-label={`${profile.name} — back to top`}
              >
                <span className="relative grid h-7 w-7 shrink-0 place-items-center">
                  <span className="absolute inset-0 rounded-full border border-accent/35" />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 ease-smooth group-hover:scale-150" />
                </span>
                <span
                  className={cn(
                    'font-medium tracking-tight text-chalk transition-all duration-500 ease-smooth',
                    scrolled ? 'text-[0.9375rem]' : 'text-base',
                  )}
                >
                  {profile.name}
                </span>
              </button>

              {/* Desktop navigation */}
              <nav aria-label="Primary" className="hidden lg:block">
                <ul className="flex items-center gap-1 rounded-full border border-line bg-ink-900/50 p-1 backdrop-blur-md">
                  {navItems.map((item) => {
                    const isActive = active === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(item.id)}
                          aria-current={isActive ? 'true' : undefined}
                          className={cn(
                            'relative rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-300',
                            isActive ? 'text-chalk' : 'text-chalk-muted hover:text-chalk',
                          )}
                        >
                          {isActive ? (
                            <motion.span
                              layoutId="nav-active"
                              className="absolute inset-0 rounded-full bg-ink-700/70"
                              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                            />
                          ) : null}
                          <span className="relative">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  magnetic
                  onClick={() => scrollToSection('contact')}
                  className="hidden sm:inline-flex"
                >
                  Let&apos;s Talk
                </Button>

                {/* Hamburger */}
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-navigation"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  className="relative z-50 grid h-10 w-10 place-items-center rounded-full border border-line
                             bg-ink-900/60 backdrop-blur-md transition-colors hover:border-line-strong lg:hidden"
                >
                  <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
                  <span aria-hidden className="relative block h-3 w-4">
                    <motion.span
                      className="absolute left-0 block h-px w-full bg-chalk"
                      animate={menuOpen ? { top: 6, rotate: 45 } : { top: 1, rotate: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                    <motion.span
                      className="absolute left-0 block h-px w-full bg-chalk"
                      animate={
                        menuOpen ? { top: 6, rotate: -45, width: '100%' } : { top: 11, rotate: 0, width: '70%' }
                      }
                      transition={{ duration: 0.35, ease: EASE }}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} activeId={active} onClose={() => setMenuOpen(false)} />
    </>
  );
}
