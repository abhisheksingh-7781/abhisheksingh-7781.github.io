'use client';

import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { BarChart3, Brush, Database, Lightbulb, Sigma, Target } from 'lucide-react';
import { useRef, useState } from 'react';

import { EASE, fadeUp, viewportOnce } from '@/animations/motion';
import { workflowSteps, type WorkflowStep } from '@/data/analytics';
import { cn } from '@/lib/utils';

const icons: Record<WorkflowStep['icon'], typeof Database> = {
  database: Database,
  brush: Brush,
  sigma: Sigma,
  chart: BarChart3,
  lightbulb: Lightbulb,
  target: Target,
};

/**
 * Raw Data through to Decision. The connecting rail fills with scroll progress
 * and each step activates as the rail reaches it, so the animation reads as one
 * continuous movement rather than six independent reveals.
 */
export function Workflow() {
  const railRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 78%', 'end 55%'],
  });

  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.round(value * workflowSteps.length);
    setReached((current) => (next > current ? next : current));
  });

  return (
    <div ref={railRef} className="relative">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="flex items-baseline justify-between gap-4"
      >
        <h3 className="text-lg font-medium tracking-tight text-chalk">
          How an analysis actually runs
        </h3>
        <span className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk-faint sm:block">
          {workflowSteps.length} steps
        </span>
      </motion.div>

      <div className="relative mt-10">
        {/* Rail: vertical on small screens, horizontal from lg up. Two
            elements rather than one, so each can scale on its own axis. */}
        <div
          aria-hidden
          className="absolute left-[1.4375rem] top-3 h-[calc(100%-1.5rem)] w-px overflow-hidden bg-line lg:hidden"
        >
          <motion.span
            className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent/70 to-data"
            style={{ scaleY: fill }}
          />
        </div>
        <div
          aria-hidden
          className="absolute left-0 top-[1.4375rem] hidden h-px w-full overflow-hidden bg-line lg:block"
        >
          <motion.span
            className="absolute inset-0 origin-left bg-gradient-to-r from-accent via-accent/70 to-data"
            style={{ scaleX: fill }}
          />
        </div>

        <ol className="relative grid gap-7 lg:grid-cols-6 lg:gap-4">
          {workflowSteps.map((step, i) => {
            const Icon = icons[step.icon];
            const active = reached > i;
            const isLast = i === workflowSteps.length - 1;

            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.06, 0.4) }}
                className="relative flex items-start gap-4 lg:block"
              >
                <span
                  className={cn(
                    'relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-xl border',
                    'transition-[background-color,border-color,color,box-shadow] duration-500 ease-smooth',
                    active
                      ? isLast
                        ? 'border-data/40 bg-data/[0.1] text-data shadow-[0_0_0_4px_rgba(224,164,88,0.06)]'
                        : 'border-accent/40 bg-accent/[0.1] text-accent shadow-[0_0_0_4px_rgb(var(--accent)/0.06)]'
                      : 'border-line bg-ink-900 text-chalk-faint',
                  )}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.6} />
                </span>

                <div className="lg:mt-5 lg:pr-4">
                  <p
                    className={cn(
                      'font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors duration-500',
                      active ? 'text-chalk-muted' : 'text-chalk-faint/70',
                    )}
                  >
                    Step {String(i + 1).padStart(2, '0')}
                  </p>
                  <p
                    className={cn(
                      'mt-1.5 text-sm font-medium tracking-tight transition-colors duration-500',
                      active ? 'text-chalk' : 'text-chalk-muted',
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-1.5 max-w-[24ch] text-xs leading-relaxed text-chalk-faint">
                    {step.caption}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
