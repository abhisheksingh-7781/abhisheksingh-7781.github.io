'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { EASE, fadeUp, viewportOnce } from '@/animations/motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { skillCategories, toolbelt, type SkillCategoryId } from '@/data/skills';
import { isPlaceholder } from '@/data/placeholders';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type Filter = 'all' | SkillCategoryId;

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  ...skillCategories.map((c) => ({ id: c.id as Filter, label: c.label })),
];

export function Skills() {
  const [filter, setFilter] = useState<Filter>('all');
  const reduced = usePrefersReducedMotion();

  const visible = useMemo(
    () => (filter === 'all' ? skillCategories : skillCategories.filter((c) => c.id === filter)),
    [filter],
  );

  const total = useMemo(() => skillCategories.reduce((sum, c) => sum + c.skills.length, 0), []);

  return (
    <section id="skills" aria-labelledby="skills-title" className="section-y relative">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />

      <div className="shell">
        <SectionHeading
          eyebrow="02 / Skills"
          title={
            <span id="skills-title">
              The toolkit behind{' '}
              <span className="serif-accent text-chalk-muted">both practices.</span>
            </span>
          }
          description="Grouped by where they are used rather than ranked by an invented score. Filter a category to focus on one side of the work."
          aside={
            <div
              role="tablist"
              aria-label="Filter skills by category"
              className="flex flex-wrap gap-1.5 rounded-full border border-line bg-ink-900/60 p-1 backdrop-blur-md"
            >
              {filters.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      'relative rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-300',
                      active ? 'text-chalk' : 'text-chalk-muted hover:text-chalk',
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="skills-filter"
                        className="absolute inset-0 rounded-full bg-ink-700/80"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          }
        />

        {/* Category clusters */}
        <motion.div layout className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((category) => (
              <motion.article
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
                className={cn(
                  'group surface surface-hover relative overflow-hidden p-6 sm:p-7',
                  filter !== 'all' && 'md:col-span-2',
                )}
              >
                <span className="edge-light" aria-hidden />

                <header className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-medium tracking-tight text-chalk">
                      {category.label}
                    </h3>
                    <p className="mt-2 max-w-measure-sm text-sm leading-relaxed text-chalk-muted">
                      {category.summary}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className={cn(
                      'mt-1 shrink-0 font-mono text-[0.6875rem]',
                      category.discipline === 'build' ? 'text-accent/70' : 'text-data/70',
                    )}
                  >
                    {String(category.skills.length).padStart(2, '0')}
                  </span>
                </header>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => {
                    const pending = isPlaceholder(skill);
                    return (
                      <motion.li
                        key={skill + i}
                        initial={reduced ? false : { opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.35, ease: EASE, delay: Math.min(i * 0.03, 0.3) }}
                      >
                        <span
                          className={cn(
                            'inline-flex cursor-default items-center rounded-lg border px-2.5 py-1.5 text-[0.8125rem]',
                            'transition-[transform,border-color,background-color,color] duration-300 ease-smooth',
                            'hover:-translate-y-0.5',
                            pending
                              ? 'border-dashed border-line-strong/70 bg-ink-800/40 font-mono text-[0.6875rem] text-chalk-faint'
                              : category.discipline === 'build'
                                ? 'border-line bg-ink-800/60 text-chalk-muted hover:border-accent/40 hover:bg-accent/[0.07] hover:text-accent-soft'
                                : 'border-line bg-ink-800/60 text-chalk-muted hover:border-data/40 hover:bg-data/[0.07] hover:text-data-soft',
                          )}
                        >
                          {skill}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Ambient toolbelt marquee */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mask-fade-x relative mt-12 overflow-hidden border-y border-line py-4"
          aria-label={`${total} technologies across all categories`}
        >
          <div
            className={cn(
              'flex w-max items-center gap-10',
              reduced ? '' : 'animate-marquee motion-reduce:animate-none',
            )}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
                {toolbelt.map((tool, i) => (
                  <span
                    key={`${copy}-${tool}-${i}`}
                    className={cn(
                      'whitespace-nowrap font-mono text-[0.8125rem] uppercase tracking-[0.16em]',
                      isPlaceholder(tool) ? 'text-chalk-faint/60' : 'text-chalk-faint',
                    )}
                  >
                    {tool}
                    <span aria-hidden className="ml-10 text-accent/40">
                      /
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
