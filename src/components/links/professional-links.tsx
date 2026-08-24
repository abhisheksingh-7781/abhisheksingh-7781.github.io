'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Lock } from 'lucide-react';

import { EASE, viewportOnce } from '@/animations/motion';
import { PlaceholderText } from '@/components/ui/placeholder';
import { SectionHeading } from '@/components/ui/section-heading';
import { SmartLink } from '@/components/ui/smart-link';
import { isPlaceholder } from '@/data/placeholders';
import { socialLinks } from '@/data/links';
import { cn } from '@/lib/utils';

/**
 * GitHub / LinkedIn / Résumé / Email. Every href comes from src/data/links.ts,
 * so the whole block is updated from one file.
 */
export function ProfessionalLinks() {
  return (
    <section aria-labelledby="links-title" className="section-y relative border-t border-line">
      <div className="shell">
        <SectionHeading
          eyebrow="08 / Elsewhere"
          title={<span id="links-title">Profiles &amp; documents</span>}
          description="Everything else worth looking at. Links are configured in one place and update across the whole site."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {socialLinks.map((link, i) => {
            const Icon = link.icon;
            const pending = isPlaceholder(link.href);

            return (
              <motion.li
                key={link.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
              >
                <SmartLink
                  href={link.href}
                  external={link.external}
                  className={cn(
                    'group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border',
                    'border-line bg-ink-850/60 p-6 transition-[border-color,transform,background-color]',
                    'duration-500 ease-smooth',
                    !pending && 'hover:-translate-y-1 hover:border-accent/35 hover:bg-ink-800/70',
                  )}
                >
                  <span className="edge-light" aria-hidden />

                  <span className="flex items-start justify-between">
                    <span
                      className={cn(
                        'grid h-10 w-10 place-items-center rounded-xl border transition-colors duration-500',
                        pending
                          ? 'border-line bg-ink-800/60 text-chalk-faint'
                          : 'border-line bg-ink-800/60 text-chalk-muted group-hover:border-accent/30 group-hover:text-accent',
                      )}
                    >
                      <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} />
                    </span>

                    {pending ? (
                      <Lock className="h-3.5 w-3.5 text-chalk-faint" strokeWidth={1.6} />
                    ) : (
                      <ArrowUpRight
                        className="h-4 w-4 text-chalk-faint transition-transform duration-500 ease-smooth
                                   group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-chalk"
                        strokeWidth={1.75}
                      />
                    )}
                  </span>

                  <span className="mt-8 block">
                    <span className="block text-base font-medium tracking-tight text-chalk">
                      {link.label}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-chalk-muted">
                      {link.description}
                    </span>
                    <span className="mt-4 block truncate font-mono text-[0.6875rem] text-chalk-faint">
                      {pending ? <PlaceholderText>{link.handle}</PlaceholderText> : link.handle}
                    </span>
                  </span>
                </SmartLink>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
