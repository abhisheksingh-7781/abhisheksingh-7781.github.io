'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { barSeries, donutSeries, trendSeries } from '@/data/analytics';
import { alpha, solid, useThemeTokens } from '@/lib/theme-tokens';

/**
 * Chart primitives for the analytics showcase.
 *
 * Loaded through next/dynamic (ssr: false) from <Dashboard>, so Recharts stays
 * out of the initial bundle and only downloads when this section is reached.
 */

/**
 * Recharts takes colours as values, not classes, so it cannot follow the theme
 * on its own. This resolves the same CSS variables the rest of the site uses
 * and rebuilds the chart styling whenever the theme changes.
 */
function useChartTheme() {
  const t = useThemeTokens();

  return useMemo(() => {
    const grid = alpha(t.line, 0.09);

    const axisProps = {
      stroke: grid,
      tick: { fill: solid(t['chalk-faint']), fontSize: 11, fontFamily: 'var(--font-mono)' },
      tickLine: false,
      axisLine: { stroke: grid },
    } as const;

    const tooltipStyle = {
      contentStyle: {
        background: solid(t['ink-850']),
        border: `1px solid ${alpha(t.line, 0.16)}`,
        borderRadius: 12,
        fontSize: 12,
        color: solid(t.chalk),
        // Shadows have to be heavier on a light ground to read as depth at all.
        boxShadow: `0 20px 50px -24px rgb(0 0 0 / var(--shadow-strength))`,
      },
      labelStyle: { color: solid(t['chalk-muted']), fontSize: 11, marginBottom: 4 },
      cursor: { stroke: alpha(t.line, 0.16), strokeWidth: 1 },
    } as const;

    return {
      accent: solid(t.accent),
      data: solid(t.data),
      accentMuted: alpha(t.accent, 0.34),
      cursorFill: alpha(t.line, 0.05),
      palette: [solid(t.accent), solid(t.data), alpha(t.accent, 0.42), alpha(t.line, 0.22)],
      axisProps,
      tooltipStyle,
    };
  }, [t]);
}

/** Multi-series trend, the dashboard hero chart. */
export function TrendChart() {
  const c = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={trendSeries} margin={{ top: 8, right: 14, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id="fillQueries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.accent} stopOpacity={0.32} />
            <stop offset="100%" stopColor={c.accent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillDashboards" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.data} stopOpacity={0.22} />
            <stop offset="100%" stopColor={c.data} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" {...c.axisProps} />
        <YAxis {...c.axisProps} width={44} />
        <Tooltip {...c.tooltipStyle} />
        <Area
          type="monotone"
          dataKey="queries"
          name="Queries written"
          stroke={c.accent}
          strokeWidth={1.75}
          fill="url(#fillQueries)"
          dot={false}
          activeDot={{ r: 3.5, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="dashboards"
          name="Dashboard views"
          stroke={c.data}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          fill="url(#fillDashboards)"
          dot={false}
          activeDot={{ r: 3.5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Effort distribution across the analytics workflow. */
export function EffortBarChart() {
  const c = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barSeries} margin={{ top: 8, right: 6, bottom: 0, left: -14 }}>
        <XAxis dataKey="stage" {...c.axisProps} />
        <YAxis {...c.axisProps} width={40} />
        <Tooltip {...c.tooltipStyle} cursor={{ fill: c.cursorFill }} />
        <Bar dataKey="hours" name="Hours" radius={[5, 5, 0, 0]} maxBarSize={34}>
          {barSeries.map((entry, i) => (
            <Cell key={entry.stage} fill={i === 1 ? c.accent : c.accentMuted} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Tooling split donut. */
export function ToolingDonut() {
  const c = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip {...c.tooltipStyle} cursor={false} />
        <Pie
          data={donutSeries}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="92%"
          paddingAngle={3}
          stroke="none"
        >
          {donutSeries.map((entry, i) => (
            <Cell key={entry.name} fill={c.palette[i % c.palette.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Tiny KPI sparkline. */
export function Sparkline({ data, tone = 'accent' }: { data: { i: number; v: number }[]; tone?: 'accent' | 'data' }) {
  const c = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
        {/* Without an explicit domain Recharts anchors at zero and the trend
            flattens into a straight line. */}
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Line
          type="monotone"
          dataKey="v"
          stroke={tone === 'accent' ? c.accent : c.data}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
