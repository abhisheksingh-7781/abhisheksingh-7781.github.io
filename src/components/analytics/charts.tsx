'use client';

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

/**
 * Chart primitives for the analytics showcase.
 *
 * Loaded through next/dynamic (ssr: false) from <Dashboard>, so Recharts stays
 * out of the initial bundle and only downloads when this section is reached.
 */

const ACCENT = '#35C79A';
const DATA = '#E0A458';
const GRID = 'rgba(255,255,255,0.06)';
const AXIS = '#666D78';

const axisProps = {
  stroke: GRID,
  tick: { fill: AXIS, fontSize: 11, fontFamily: 'var(--font-mono)' },
  tickLine: false,
  axisLine: { stroke: GRID },
} as const;

const tooltipStyle = {
  contentStyle: {
    background: '#0F1116',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 12,
    fontSize: 12,
    color: '#F4F5F7',
    boxShadow: '0 20px 50px -24px rgba(0,0,0,0.9)',
  },
  labelStyle: { color: '#9AA1AC', fontSize: 11, marginBottom: 4 },
  cursor: { stroke: 'rgba(255,255,255,0.14)', strokeWidth: 1 },
} as const;

/** Multi-series trend, the dashboard hero chart. */
export function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={trendSeries} margin={{ top: 8, right: 14, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id="fillQueries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.32} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillDashboards" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={DATA} stopOpacity={0.22} />
            <stop offset="100%" stopColor={DATA} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} width={44} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey="queries"
          name="Queries written"
          stroke={ACCENT}
          strokeWidth={1.75}
          fill="url(#fillQueries)"
          dot={false}
          activeDot={{ r: 3.5, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="dashboards"
          name="Dashboard views"
          stroke={DATA}
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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barSeries} margin={{ top: 8, right: 6, bottom: 0, left: -14 }}>
        <XAxis dataKey="stage" {...axisProps} />
        <YAxis {...axisProps} width={40} />
        <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="hours" name="Hours" radius={[5, 5, 0, 0]} maxBarSize={34}>
          {barSeries.map((entry, i) => (
            <Cell key={entry.stage} fill={i === 1 ? ACCENT : 'rgba(53,199,154,0.34)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Tooling split donut. */
export function ToolingDonut() {
  const palette = [ACCENT, DATA, 'rgba(53,199,154,0.42)', 'rgba(255,255,255,0.18)'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip {...tooltipStyle} cursor={false} />
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
            <Cell key={entry.name} fill={palette[i % palette.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Tiny KPI sparkline. */
export function Sparkline({ data, tone = 'accent' }: { data: { i: number; v: number }[]; tone?: 'accent' | 'data' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
        {/* Without an explicit domain Recharts anchors at zero and the trend
            flattens into a straight line. */}
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Line
          type="monotone"
          dataKey="v"
          stroke={tone === 'accent' ? ACCENT : DATA}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
