'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

import { EASE, fadeUp, viewportOnce } from '@/animations/motion';
import { Value } from '@/components/ui/placeholder';
import { SectionHeading } from '@/components/ui/section-heading';
import { education } from '@/data/education';
import { profile } from '@/data/profile';

export function Education() {
  return (
    <section aria-labelledby="education-title" className="section-y relative border-t border-line">
      <div className="shell">
        <SectionHeading
          eyebrow="07 / Education"
          title={<span id="education-title">Education</span>}
          description="Only the graduation window is confirmed today. Degree and institution are editable placeholders."
        />

        <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          {/* Graduation marker */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="surface relative overflow-hidden p-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_0%,rgb(var(--accent)/0.08),transparent)]"
            />
            <p className="eyebrow">Graduation</p>
            <p className="mt-4 font-mono text-4xl tracking-tight text-chalk sm:text-5xl">
              {profile.graduation.replace('-', ' — ')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-chalk-muted">
              <GraduationCap className="h-4 w-4 text-accent" strokeWidth={1.6} />
              Confirmed graduation window
            </div>
          </motion.div>

          {/* Detail cards */}
          <div className="space-y-4">
            {education.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
                className="group surface surface-hover relative overflow-hidden p-7"
              >
                <span className="edge-light" aria-hidden />

                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-accent/80">
                  {item.period}
                </p>

                <h3 className="mt-4 text-xl font-medium tracking-tight text-chalk">
                  <Value value={item.degree} placeholderClassName="text-[0.75em]" />
                </h3>

                <p className="mt-2 text-sm text-chalk-muted">
                  <Value value={item.institution} />
                  <span className="mx-2 text-chalk-faint">&middot;</span>
                  <Value value={item.location} />
                </p>

                <p className="mt-4 text-sm leading-relaxed text-chalk-muted">
                  <Value value={item.detail} />
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.focus.map((focus, f) => (
                    <li
                      key={f}
                      className="rounded-lg border border-dashed border-line-strong/70 bg-ink-800/40
                                 px-2.5 py-1 font-mono text-[0.6875rem] text-chalk-faint"
                    >
                      {focus}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
