'use client';

import { motion } from 'framer-motion';
import { Braces, LineChart } from 'lucide-react';
import Image from 'next/image';

import { fadeUp, slideInLeft, viewportOnce } from '@/animations/motion';
import { PlaceholderMedia, Value } from '@/components/ui/placeholder';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { isPlaceholder } from '@/data/placeholders';
import { profile } from '@/data/profile';
import { cn } from '@/lib/utils';

const disciplines = [
  { ...profile.disciplines.build, icon: Braces, tone: 'build' as const },
  { ...profile.disciplines.analyze, icon: LineChart, tone: 'analyze' as const },
];

export function About() {
  const [headingA, headingB] = profile.about.heading;

  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="shell">
        <SectionHeading
          eyebrow="01 / About"
          title={
            <span id="about-title">
              {headingA}{' '}
              <span className="serif-accent text-chalk-muted">{headingB}</span>
            </span>
          }
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Portrait */}
          <Reveal variants={slideInLeft} className="lg:sticky lg:top-28 lg:self-start">
            <figure className="relative">
              <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-ink-900">
                {isPlaceholder(profile.profileImage) ? (
                  <PlaceholderMedia
                    label="[PROFILE PHOTO]"
                    hint="Add an image to /public and set profileImage in src/data/profile.ts"
                    className="h-full w-full rounded-none border-0"
                  />
                ) : (
                  <Image
                    src={profile.profileImage}
                    alt={profile.profileImageAlt}
                    fill
                    sizes="(max-width: 1024px) 80vw, 340px"
                    className="object-cover"
                    priority={false}
                  />
                )}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5"
                />
              </div>

              <figcaption className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk-faint">
                  {profile.availability}
                </span>
                <span aria-hidden className="h-3 w-px bg-line-strong" />
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk-faint">
                  <Value value={profile.location} />
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Narrative */}
          <div>
            <RevealGroup className="space-y-6" step={0.09}>
              {profile.about.paragraphs.map((paragraph, i) => (
                <RevealItem key={i} variants={fadeUp}>
                  <p
                    className={cn(
                      'text-pretty leading-relaxed',
                      i === 0 ? 'text-lg text-chalk sm:text-xl' : 'text-base text-chalk-muted sm:text-lg',
                    )}
                  >
                    {paragraph}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Two practices */}
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {disciplines.map((discipline, index) => {
                const Icon = discipline.icon;
                return (
                  <motion.article
                    key={discipline.key}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    variants={fadeUp}
                    transition={{ delay: index * 0.1 }}
                    className="group surface surface-hover relative overflow-hidden p-6"
                  >
                    <span className="edge-light" aria-hidden />

                    <span
                      className={cn(
                        'grid h-10 w-10 place-items-center rounded-xl border',
                        discipline.tone === 'build'
                          ? 'border-accent/25 bg-accent/[0.07] text-accent'
                          : 'border-data/25 bg-data/[0.07] text-data',
                      )}
                    >
                      <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} />
                    </span>

                    <h3 className="mt-5 text-lg font-medium tracking-tight text-chalk">
                      {discipline.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-chalk-muted">
                      {discipline.lead}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {discipline.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm text-chalk-muted">
                          <span
                            aria-hidden
                            className={cn(
                              'mt-[0.45rem] h-1 w-1 shrink-0 rounded-full',
                              discipline.tone === 'build' ? 'bg-accent/70' : 'bg-data/70',
                            )}
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
