/**
 * DEMO DATA
 * ---------------------------------------------------------------------------
 * Everything in this file is illustrative sample data used to demonstrate
 * charting and dashboard craft. It is labelled "Demo data" in the UI and must
 * never be presented as a real result or achievement.
 */

export const DEMO_LABEL = 'Demo data';

export type KpiCard = {
  id: string;
  label: string;
  value: string;
  delta: number;
  /** Tiny sparkline series. */
  series: { i: number; v: number }[];
};

export const kpis: KpiCard[] = [
  {
    id: 'records',
    label: 'Records processed',
    value: '48,120',
    delta: 12.4,
    series: [28, 31, 30, 36, 34, 41, 44, 48].map((v, i) => ({ i, v })),
  },
  {
    id: 'quality',
    label: 'Data quality score',
    value: '96.2%',
    delta: 3.1,
    series: [88, 89, 91, 90, 93, 94, 95, 96].map((v, i) => ({ i, v })),
  },
  {
    id: 'runtime',
    label: 'Pipeline runtime',
    value: '2m 14s',
    delta: -18.6,
    series: [4.1, 3.8, 3.9, 3.2, 3.0, 2.6, 2.4, 2.2].map((v, i) => ({ i, v })),
  },
  {
    id: 'coverage',
    label: 'Report coverage',
    value: '31 views',
    delta: 6.8,
    series: [14, 16, 18, 21, 23, 26, 29, 31].map((v, i) => ({ i, v })),
  },
];

export const trendSeries = [
  { month: 'Jan', queries: 320, dashboards: 180 },
  { month: 'Feb', queries: 412, dashboards: 214 },
  { month: 'Mar', queries: 388, dashboards: 246 },
  { month: 'Apr', queries: 501, dashboards: 268 },
  { month: 'May', queries: 546, dashboards: 305 },
  { month: 'Jun', queries: 612, dashboards: 341 },
  { month: 'Jul', queries: 690, dashboards: 372 },
  { month: 'Aug', queries: 734, dashboards: 415 },
];

export const barSeries = [
  { stage: 'Ingest', hours: 6 },
  { stage: 'Clean', hours: 14 },
  { stage: 'Model', hours: 11 },
  { stage: 'Analyse', hours: 9 },
  { stage: 'Report', hours: 5 },
];

export const donutSeries = [
  { name: 'SQL', value: 38 },
  { name: 'Python', value: 27 },
  { name: 'Excel', value: 21 },
  { name: 'Other', value: 14 },
];

export const tableRows = [
  { id: 'DS-014', source: 'Transactions', rows: '12,480', quality: 98, status: 'Clean' },
  { id: 'DS-021', source: 'User events', rows: '31,207', quality: 94, status: 'Clean' },
  { id: 'DS-033', source: 'Survey export', rows: '2,914', quality: 81, status: 'Review' },
  { id: 'DS-047', source: 'Support tickets', rows: '1,519', quality: 89, status: 'Clean' },
];

export type WorkflowStep = {
  id: string;
  label: string;
  caption: string;
  icon: 'database' | 'brush' | 'sigma' | 'chart' | 'lightbulb' | 'target';
};

/** The analytics workflow rail: Raw Data through to Decision. */
export const workflowSteps: WorkflowStep[] = [
  { id: 'raw', label: 'Raw Data', caption: 'Collect from source systems, exports and APIs.', icon: 'database' },
  { id: 'clean', label: 'Clean', caption: 'Deduplicate, type-check and reconcile the messy parts.', icon: 'brush' },
  { id: 'analyze', label: 'Analyze', caption: 'Segment, compare and test what the numbers imply.', icon: 'sigma' },
  { id: 'visualize', label: 'Visualize', caption: 'Choose the view that makes the pattern obvious.', icon: 'chart' },
  { id: 'insight', label: 'Insight', caption: 'State the finding plainly, with its limits.', icon: 'lightbulb' },
  { id: 'decision', label: 'Decision', caption: 'Hand over something a team can act on.', icon: 'target' },
];
