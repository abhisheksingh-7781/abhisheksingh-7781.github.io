'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

import { fadeUp, viewportOnce } from '@/animations/motion';
import { SmartLink } from '@/components/ui/smart-link';
import { navItems } from '@/data/navigation';
import { socialLinks } from '@/data/links';
import { profile } from '@/data/profile';
import { scrollToSection } from '@/lib/utils';

const YEAR = 2026;

export function Footer() {
  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.3 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-line" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>

      <div className="shell">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="grid gap-10 py-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto] md:gap-12 md:py-16"
        >
          {/* Identity */}
          <div>
            <button
              type="button"
              onClick={toTop}
              className="group flex items-center gap-2.5 text-left"
              aria-label={`${profile.name} — back to top`}
            >
              <span className="relative grid h-7 w-7 place-items-center">
                <span className="absolute inset-0 rounded-full border border-accent/35" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 ease-smooth group-hover:scale-150" />
              </span>
              <span className="text-base font-medium tracking-tight text-chalk">
                {profile.name}
              </span>
            </button>

            <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk-faint">
              {profile.roles[0]} &bull; {profile.roles[1]}
            </p>

            <div className="mt-5 flex flex-col gap-1.5">
              <a
                href={`mailto:${profile.email}`}
                className="link-underline self-start break-all text-sm text-chalk-muted transition-colors hover:text-chalk"
              >
                {profile.email}
              </a>
              <a
                href={profile.phoneHref}
                className="link-underline self-start font-mono text-sm text-chalk-muted transition-colors hover:text-chalk"
              >
                {profile.phone}
              </a>
              <p className="mt-1 text-xs text-chalk-faint">{profile.location}</p>
            </div>
          </div>

          {/* Navigation + links */}
          <div className="grid grid-cols-2 gap-8">
            <nav aria-label="Footer">
              <p className="eyebrow">Sections</p>
              <ul className="mt-4 space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="link-underline text-sm text-chalk-muted transition-colors hover:text-chalk"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-4 space-y-2.5">
                {socialLinks.map((link) => (
                  <li key={link.key}>
                    <SmartLink
                      href={link.href}
                      external={link.external}
                      className="link-underline text-sm text-chalk-muted transition-colors hover:text-chalk"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Back to top */}
          <div className="md:justify-self-end">
            <button
              type="button"
              onClick={toTop}
              className="group inline-flex items-center gap-3 rounded-full border border-line
                         bg-ink-900/60 px-5 py-3 text-sm text-chalk-muted
                         transition-[border-color,color,transform] duration-500 ease-smooth
                         hover:-translate-y-0.5 hover:border-accent/40 hover:text-chalk"
            >
              Back to top
              <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full border border-line">
                <ArrowUp
                  className="h-3.5 w-3.5 transition-transform duration-500 ease-smooth group-hover:-translate-y-5"
                  strokeWidth={1.75}
                />
                <ArrowUp
                  aria-hidden
                  className="absolute h-3.5 w-3.5 translate-y-5 transition-transform duration-500 ease-smooth group-hover:translate-y-0"
                  strokeWidth={1.75}
                />
              </span>
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-chalk-faint">
            &copy; {YEAR} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-chalk-faint">
            Built with Next.js, TypeScript &amp; Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
