'use client';

import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

import { fadeUp, stagger, viewportOnce } from '@/animations/motion';
import { DEMO_LABEL, donutSeries, kpis, tableRows } from '@/data/analytics';
import { alpha, solid, useThemeTokens } from '@/lib/theme-tokens';
import { cn } from '@/lib/utils';

/**
 * Recharts is code-split away from the initial bundle: it only loads when this
 * section mounts, and never during SSR (the charts measure their container).
 */
const chartFallback = (
  <div className="h-full w-full animate-pulse rounded-lg bg-ink-800/50" aria-hidden />
);

const TrendChart = dynamic(() => import('./charts').then((m) => m.TrendChart), {
  ssr: false,
  loading: () => chartFallback,
});
const EffortBarChart = dynamic(() => import('./charts').then((m) => m.EffortBarChart), {
  ssr: false,
  loading: () => chartFallback,
});
const ToolingDonut = dynamic(() => import('./charts').then((m) => m.ToolingDonut), {
  ssr: false,
  loading: () => chartFallback,
});
const Sparkline = dynamic(() => import('./charts').then((m) => m.Sparkline), {
  ssr: false,
  loading: () => chartFallback,
});

function Panel({
  title,
  subtitle,
  className,
  children,
  legend,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
  legend?: React.ReactNode;
}) {
  return (
    <motion.section
      variants={fadeUp}
      className={cn('surface relative overflow-hidden p-5 sm:p-6', className)}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium tracking-tight text-chalk">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-chalk-faint">{subtitle}</p> : null}
        </div>
        {legend}
      </header>
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-chalk-faint">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function Dashboard() {
  const tokens = useThemeTokens();
  // Mirrors the donut's own slice palette in charts.tsx, so the legend and the
  // chart cannot drift apart when the theme changes.
  const donutPalette = [
    solid(tokens.accent),
    solid(tokens.data),
    alpha(tokens.accent, 0.42),
    alpha(tokens.line, 0.22),
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={stagger(0.08)}
      className="relative"
    >
      {/* Demo-data disclosure: this dashboard demonstrates craft, not results. */}
      <motion.div variants={fadeUp} className="mb-5 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-data/30 bg-data/[0.07] px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-data-soft">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-data" />
          {DEMO_LABEL}
        </span>
        <p className="text-xs text-chalk-faint">
          Sample figures used to demonstrate dashboard and visualisation work. Not real results.
        </p>
      </motion.div>

      {/* KPI row */}
      <motion.div variants={stagger(0.06)} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => {
          const positive = kpi.delta >= 0;
          const Icon = positive ? TrendingUp : TrendingDown;
          return (
            <motion.article
              key={kpi.id}
              variants={fadeUp}
              className="group surface surface-hover relative overflow-hidden p-5"
            >
              <span className="edge-light" aria-hidden />
              <p className="eyebrow">{kpi.label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="font-mono text-2xl tracking-tight text-chalk">{kpi.value}</p>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.625rem]',
                    positive
                      ? 'border-accent/25 bg-accent/[0.07] text-accent-soft'
                      : 'border-data/25 bg-data/[0.07] text-data-soft',
                  )}
                >
                  <Icon className="h-3 w-3" strokeWidth={2} />
                  {positive ? '+' : ''}
                  {kpi.delta}%
                </span>
              </div>
              <div className="mt-4 h-9">
                <Sparkline data={kpi.series} tone={i === 2 ? 'data' : 'accent'} />
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Activity over time"
          subtitle="Queries written vs dashboard views"
          className="lg:col-span-2"
          legend={
            <div className="flex flex-col items-end gap-1.5">
              <LegendDot color={solid(tokens.accent)} label="Queries" />
              <LegendDot color={solid(tokens.data)} label="Dashboards" />
            </div>
          }
        >
          <div className="h-[260px] w-full">
            <TrendChart />
          </div>
        </Panel>

        <Panel title="Tooling split" subtitle="Where analysis time is spent">
          <div className="h-[180px] w-full">
            <ToolingDonut />
          </div>
          <ul className="mt-4 space-y-2">
            {donutSeries.map((slice, i) => (
              <li key={slice.name} className="flex items-center justify-between text-xs">
                <LegendDot
                  color={donutPalette[i % donutPalette.length]}
                  label={slice.name}
                />
                <span className="font-mono text-chalk-muted">{slice.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Effort by stage" subtitle="Hours per phase of a typical engagement">
          <div className="h-[220px] w-full">
            <EffortBarChart />
          </div>
        </Panel>

        {/* Data table */}
        <Panel title="Dataset register" subtitle="Sources, volume and quality checks">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[440px] border-collapse text-left">
              <caption className="sr-only">
                Demo dataset register showing source, row count, quality score and status
              </caption>
              <thead>
                <tr className="border-b border-line">
                  {['ID', 'Source', 'Rows', 'Quality', 'Status'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-2 pb-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-chalk-faint"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-line/60 transition-colors last:border-0 hover:bg-ink-800/40"
                  >
                    <td className="px-2 py-3 font-mono text-xs text-chalk-faint">{row.id}</td>
                    <td className="px-2 py-3 text-sm text-chalk">{row.source}</td>
                    <td className="px-2 py-3 font-mono text-xs text-chalk-muted">{row.rows}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-1 w-14 overflow-hidden rounded-full bg-ink-700">
                          <span
                            className="block h-full rounded-full bg-accent/80"
                            style={{ width: `${row.quality}%` }}
                          />
                        </span>
                        <span className="font-mono text-xs text-chalk-muted">{row.quality}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em]',
                          row.status === 'Clean'
                            ? 'border-accent/25 bg-accent/[0.07] text-accent-soft'
                            : 'border-data/25 bg-data/[0.07] text-data-soft',
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}
