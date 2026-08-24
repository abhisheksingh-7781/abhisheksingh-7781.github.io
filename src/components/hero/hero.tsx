'use client';

import { ArrowDown, ArrowUpRight, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { createScrollScene, registerGsap } from '@/animations/gsap';
import { HeroBackground } from '@/components/hero/hero-background';
import { Button } from '@/components/ui/button';
import { profile } from '@/data/profile';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { scrollToSection } from '@/lib/utils';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  /* Entrance timeline: status line, heading lines, description, CTAs, meta. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      root.querySelectorAll<HTMLElement>('[data-hero]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.2 });

      tl.fromTo('[data-hero="status"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(
          '[data-hero="line"]',
          { yPercent: 108 },
          { yPercent: 0, duration: 1.25, stagger: 0.09 },
          '-=0.55',
        )
        .fromTo(
          '[data-hero="description"]',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.85',
        )
        .fromTo(
          '[data-hero="cta"] > *',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          '-=0.7',
        )
        .fromTo(
          '[data-hero="meta"] > *',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 },
          '-=0.6',
        )
        .fromTo('[data-hero="cue"]', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.4');
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  /* Scroll-linked drift: content lifts and fades as the next section arrives. */
  useEffect(() => {
    if (reduced) return;
    return createScrollScene(rootRef.current, ({ gsap }) => {
      gsap.to('[data-hero="content"]', {
        yPercent: -12,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    });
  }, [reduced]);

  const [lineOne, lineTwo] = profile.hero.headingLines;

  return (
    <section
      id="home"
      ref={rootRef}
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 md:pb-28 md:pt-36"
    >
      <HeroBackground />

      <div className="shell relative z-10">
        <div data-hero="content" className="max-w-4xl">
          {/* Status line */}
          <div data-hero="status" className="flex items-center gap-3 opacity-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <p className="eyebrow text-chalk-muted">{profile.hero.eyebrow}</p>
          </div>

          {/* Heading */}
          <h1 className="mt-7 text-display-xl font-semibold text-chalk">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero="line" className="block will-change-transform">
                {lineOne}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero="line" className="block will-change-transform">
                <span className="serif-accent text-chalk-muted">&amp;&nbsp;</span>
                {lineTwo.replace(/^&\s*/, '')}
              </span>
            </span>
          </h1>

          {/* Description */}
          <p
            data-hero="description"
            className="lead mt-8 max-w-measure text-pretty opacity-0 md:mt-10"
          >
            {profile.hero.description}
          </p>

          {/* Calls to action */}
          <div data-hero="cta" className="mt-10 flex flex-wrap items-center gap-3 md:mt-12">
            <Button
              size="lg"
              magnetic
              onClick={() => scrollToSection(profile.hero.primaryCta.target)}
              className="opacity-0"
            >
              {profile.hero.primaryCta.label}
              <ArrowDown
                className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover/btn:translate-y-0.5"
                strokeWidth={2}
              />
            </Button>

            <Button
              size="lg"
              variant="secondary"
              magnetic
              onClick={() => scrollToSection(profile.hero.secondaryCta.target)}
              className="opacity-0"
            >
              Let&apos;s Connect
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                strokeWidth={2}
              />
            </Button>
          </div>

          {/* Identity strip */}
          <dl
            data-hero="meta"
            className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4 md:mt-20"
          >
            <div className="opacity-0">
              <dt className="eyebrow">Name</dt>
              <dd className="mt-2 text-sm text-chalk">{profile.name}</dd>
            </div>
            <div className="opacity-0">
              <dt className="eyebrow">Focus</dt>
              <dd className="mt-2 text-sm text-chalk">
                {profile.roles[0]}
                <span className="mx-1.5 text-chalk-faint">&bull;</span>
                {profile.roles[1]}
              </dd>
            </div>
            <div className="opacity-0">
              <dt className="eyebrow">Graduated</dt>
              <dd className="mt-2 font-mono text-sm text-chalk">{profile.graduation}</dd>
            </div>
            <div className="opacity-0">
              <dt className="eyebrow">Email</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="link-underline inline-flex items-center gap-1.5 text-sm text-chalk transition-colors hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-chalk-faint" strokeWidth={1.75} />
                  <span className="break-all">{profile.email}</span>
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-hero="cue"
        aria-hidden
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-0 md:flex"
      >
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.28em] text-chalk-faint">
          Scroll
        </span>
        <span className="mask-fade-y h-10 w-px bg-gradient-to-b from-accent/70 to-transparent" />
      </div>
    </section>
  );
}
