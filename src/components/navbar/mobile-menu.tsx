'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { EASE, fadeUp, mobileMenu } from '@/animations/motion';
import { SmartLink } from '@/components/ui/smart-link';
import { navItems } from '@/data/navigation';
import { profile } from '@/data/profile';
import { socialLinks } from '@/data/links';
import { useEscapeKey, useScrollLock } from '@/lib/hooks';
import { cn, scrollToSection } from '@/lib/utils';

type MobileMenuProps = {
  open: boolean;
  activeId: string;
  onClose: () => void;
};

export function MobileMenu({ open, activeId, onClose }: MobileMenuProps) {
  useScrollLock(open);
  useEscapeKey(open, onClose);

  const go = (id: string) => {
    onClose();
    // Let the panel finish collapsing before the scroll starts.
    window.setTimeout(() => scrollToSection(id), 180);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-navigation"
          key="mobile-menu"
          className="fixed inset-0 z-[45] lg:hidden"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobileMenu}
        >
          <motion.button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-ink-950/70 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Scrollable so the panel still works on short viewports, and
              `data-lenis-prevent` keeps Lenis from hijacking that scroll. */}
          <motion.nav
            aria-label="Mobile"
            data-lenis-prevent
            className="relative flex h-full flex-col justify-between gap-8 overflow-y-auto
                       overscroll-contain px-6 pb-8 pt-24"
          >
            <ul className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: EASE, delay: 0.04 * i },
                    },
                    exit: { opacity: 0, y: 8 },
                  }}
                  className="border-b border-line/70"
                >
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    aria-current={activeId === item.id ? 'true' : undefined}
                    className={cn(
                      'flex w-full items-baseline justify-between py-3.5 text-left transition-colors',
                      activeId === item.id ? 'text-chalk' : 'text-chalk-muted',
                    )}
                  >
                    <span className="text-[1.375rem] font-medium tracking-tight">{item.label}</span>
                    <span className="font-mono text-[0.6875rem] text-chalk-faint">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.div variants={fadeUp} className="shrink-0 space-y-5 pb-2">
              <button
                type="button"
                onClick={() => go('contact')}
                className="flex w-full items-center justify-between rounded-full bg-accent px-6 py-4
                           text-sm font-medium text-ink-950"
              >
                Let&apos;s Talk
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </button>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {socialLinks.map((link) => (
                  <SmartLink
                    key={link.key}
                    href={link.href}
                    external={link.external}
                    className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk-faint
                               transition-colors hover:text-chalk"
                  >
                    {link.label}
                  </SmartLink>
                ))}
              </div>

              <p className="font-mono text-[0.6875rem] tracking-tight text-chalk-faint">
                {profile.email}
              </p>
            </motion.div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
