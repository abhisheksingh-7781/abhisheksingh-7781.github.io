'use client';

import { motion } from 'framer-motion';
import { Braces, LineChart } from 'lucide-react';

import { EASE, fadeUp, viewportOnce } from '@/animations/motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { profile } from '@/data/profile';
import { cn } from '@/lib/utils';

const build = profile.disciplines.build;
const analyze = profile.disciplines.analyze;

/** Vertical chain of steps with a connector that draws itself on scroll. */
function FlowColumn({
  side,
  title,
  label,
  steps,
  icon: Icon,
}: {
  side: 'build' | 'analyze';
  title: string;
  label: string;
  steps: readonly string[];
  icon: typeof Braces;
}) {
  const isBuild = side === 'build';

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
      className="relative"
    >
      <motion.header
        variants={fadeUp}
        className={cn(
          'flex items-center gap-3',
          isBuild ? 'md:flex-row-reverse md:text-right' : '',
        )}
      >
        <span
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-xl border',
            isBuild
              ? 'border-accent/25 bg-accent/[0.07] text-accent'
              : 'border-data/25 bg-data/[0.07] text-data',
          )}
        >
          <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} />
        </span>
        <div>
          <p
            className={cn(
              'font-mono text-eyebrow uppercase tracking-[0.22em]',
              isBuild ? 'text-accent/80' : 'text-data/80',
            )}
          >
            {label}
          </p>
          <h3 className="mt-1.5 text-base font-medium tracking-tight text-chalk">{title}</h3>
        </div>
      </motion.header>

      <ol className={cn('mt-7 space-y-0', isBuild ? 'md:items-end' : '')}>
        {steps.map((step, i) => (
          <li key={step} className={cn('flex flex-col', isBuild ? 'md:items-end' : '')}>
            <motion.div
              variants={{
                hidden: { opacity: 0, x: isBuild ? 18 : -18 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
              }}
              className={cn(
                'group relative flex w-full items-center gap-3 rounded-xl border border-line bg-ink-850/70 px-4 py-3',
                'transition-[border-color,background-color,transform] duration-400 ease-smooth',
                isBuild
                  ? 'hover:-translate-x-1 hover:border-accent/35 md:flex-row-reverse'
                  : 'hover:translate-x-1 hover:border-data/35',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'font-mono text-[0.625rem]',
                  isBuild ? 'text-accent/60' : 'text-data/60',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-sm text-chalk-muted transition-colors group-hover:text-chalk">
                {step}
              </span>
            </motion.div>

            {i < steps.length - 1 ? (
              <motion.span
                aria-hidden
                variants={{
                  hidden: { scaleY: 0 },
                  visible: { scaleY: 1, transition: { duration: 0.4, ease: EASE } }
                }}
                className={cn(
                  'my-1.5 h-5 w-px origin-top',
                  isBuild
                    ? 'ml-4 bg-gradient-to-b from-accent/45 to-accent/10 md:ml-0 md:mr-4'
                    : 'ml-4 bg-gradient-to-b from-data/45 to-data/10',
                )}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

/** Curved connectors from the central identity node down to each discipline. */
function Connectors() {
  return (
    <div aria-hidden className="pointer-events-none relative hidden h-24 w-full md:block">
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <motion.path
          d="M500 0 C500 55, 210 40, 210 100"
          fill="none"
          stroke="rgb(var(--accent)/0.45)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <motion.path
          d="M500 0 C500 55, 790 40, 790 100"
          fill="none"
          stroke="rgba(224,164,88,0.45)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
        />
      </svg>
    </div>
  );
}

export function Duality() {
  return (
    <section
      aria-labelledby="duality-title"
      className="section-y relative overflow-hidden border-t border-line"
    >
      <div
        aria-hidden
        className="absolute inset-0 dot-bg opacity-[0.35] [mask-image:radial-gradient(60%_50%_at_50%_40%,#000,transparent)]"
      />

      <div className="shell relative">
        <SectionHeading
          align="center"
          eyebrow="03 / Practice"
          title={
            <span id="duality-title">
              Two disciplines,{' '}
              <span className="serif-accent text-chalk-muted">one way of working.</span>
            </span>
          }
          description={profile.thesis}
        />

        {/* Central identity node */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-16 flex justify-center"
        >
          <div className="relative">
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(closest-side,rgb(var(--accent)/0.16),transparent)] blur-xl"
            />
            <div className="surface flex items-center gap-4 px-6 py-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <div>
                <p className="text-base font-medium tracking-tight text-chalk">{profile.name}</p>
                <p className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk-faint">
                  {profile.roles[0]} / {profile.roles[1]}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <Connectors />

        {/* Build / Analyze columns */}
        <div className="mt-10 grid gap-12 md:mt-0 md:grid-cols-2 md:gap-16 lg:gap-24">
          <FlowColumn
            side="build"
            label="Build"
            title={build.title}
            steps={build.flow}
            icon={Braces}
          />
          <FlowColumn
            side="analyze"
            label="Analyze"
            title={analyze.title}
            steps={analyze.flow}
            icon={LineChart}
          />
        </div>

        {/* Thesis */}
        <motion.blockquote
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mx-auto mt-16 max-w-2xl border-t border-line pt-10 text-center"
        >
          <p className="text-balance text-xl leading-snug text-chalk sm:text-2xl">
            <span className="serif-accent text-chalk-muted">&ldquo;</span>
            I don&apos;t just build systems &mdash; I understand the data flowing through them.
            <span className="serif-accent text-chalk-muted">&rdquo;</span>
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
