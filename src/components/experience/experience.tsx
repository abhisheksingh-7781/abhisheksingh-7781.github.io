'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Award, Building2, MapPin } from 'lucide-react';
import { useRef } from 'react';

import { EASE, fadeUp, viewportOnce } from '@/animations/motion';
import { Value } from '@/components/ui/placeholder';
import { SectionHeading } from '@/components/ui/section-heading';
import { SmartLink } from '@/components/ui/smart-link';
import { Tag } from '@/components/ui/tag';
import { certifications, experience } from '@/data/experience';

export function Experience() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 65%'],
  });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="section-y relative border-t border-line"
    >
      <div className="shell">
        <SectionHeading
          eyebrow="06 / Experience"
          title={<span id="experience-title">Where the work has happened</span>}
          description="Roles, teams and the shape of the work. Entries are placeholders until the real history is added."
        />

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          {/* Timeline */}
          <ol ref={timelineRef} className="relative">
            {/* Rail */}
            <div
              aria-hidden
              className="absolute left-[0.4375rem] top-2 h-[calc(100%-1rem)] w-px overflow-hidden bg-line"
            >
              <motion.span
                className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent/50 to-transparent"
                style={{ scaleY: fill }}
              />
            </div>

            {experience.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                className="relative pb-12 pl-10 last:pb-0"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 grid h-[0.9375rem] w-[0.9375rem] place-items-center rounded-full border border-line-strong bg-ink-950"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>

                <div className="group surface surface-hover relative overflow-hidden p-6">
                  <span className="edge-light" aria-hidden />

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-accent/80">
                      <Value value={item.start} /> &mdash; <Value value={item.end} />
                    </span>
                    <span aria-hidden className="h-3 w-px bg-line-strong" />
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk-faint">
                      <Value value={item.type} />
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-medium tracking-tight text-chalk">
                    <Value value={item.role} placeholderClassName="text-[0.8em]" />
                  </h3>

                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-chalk-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-chalk-faint" strokeWidth={1.6} />
                      <Value value={item.company} />
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-chalk-faint" strokeWidth={1.6} />
                      <Value value={item.location} />
                    </span>
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                    <Value value={item.description} />
                  </p>

                  <ul className="mt-4 space-y-2">
                    {item.highlights.map((highlight, h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-chalk-muted">
                        <span aria-hidden className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                        <span className="flex-1">
                          <Value value={highlight} />
                        </span>
                      </li>
                    ))}
                  </ul>

                  {item.stack.length ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.stack.map((tech, t) => (
                        <li key={t}>
                          <Tag>{tech}</Tag>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.li>
            ))}
          </ol>

          {/* Certifications */}
          <motion.aside
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="lg:sticky lg:top-28 lg:self-start"
            aria-labelledby="certifications-title"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-ink-850 text-chalk-muted">
                <Award className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <h3 id="certifications-title" className="text-base font-medium tracking-tight text-chalk">
                Certifications
              </h3>
            </div>

            <ul className="mt-6 space-y-3">
              {certifications.map((cert, i) => (
                <li key={i}>
                  <SmartLink
                    href={cert.url}
                    className="group block rounded-xl border border-line bg-ink-850/60 p-5
                               transition-[border-color,background-color,transform] duration-500 ease-smooth
                               hover:-translate-y-0.5 hover:border-accent/35 hover:bg-ink-800/60"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-snug text-chalk">
                          <Value value={cert.name} />
                        </span>
                        <span className="mt-2 block text-xs text-chalk-faint">
                          <Value value={cert.issuer} /> &middot; <Value value={cert.date} />
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden
                        className="mt-0.5 h-4 w-4 shrink-0 text-chalk-faint transition-transform
                                   duration-500 ease-smooth group-hover:-translate-y-0.5
                                   group-hover:translate-x-0.5 group-hover:text-accent"
                        strokeWidth={1.75}
                      />
                    </span>
                    {cert.note ? (
                      <span className="mt-3 block border-t border-line pt-3 text-xs leading-relaxed text-chalk-muted">
                        {cert.note}
                      </span>
                    ) : null}
                  </SmartLink>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs leading-relaxed text-chalk-faint">
              Certificates open as a PDF. Add more in{' '}
              <code className="rounded border border-line bg-ink-850 px-1.5 py-0.5 font-mono text-[0.6875rem] text-chalk-muted">
                src/data/experience.ts
              </code>
              .
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
