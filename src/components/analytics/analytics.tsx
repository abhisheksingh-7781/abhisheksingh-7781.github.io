'use client';

import { SectionHeading } from '@/components/ui/section-heading';

import { Dashboard } from './dashboard';
import { Workflow } from './workflow';

export function Analytics() {
  return (
    <section
      id="analytics"
      aria-labelledby="analytics-title"
      className="section-y relative overflow-hidden border-t border-line"
    >
      {/* Warm ambient tint marks this as the "analyze" half of the site. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(224,164,88,0.06),transparent)]"
      />

      <div className="shell relative">
        <SectionHeading
          tone="analyze"
          eyebrow="05 / Analytics"
          title={
            <span id="analytics-title">
              Turning Data Into{' '}
              <span className="serif-accent text-chalk-muted">Decisions.</span>
            </span>
          }
          description="The analyst half of the practice: cleaning what arrives, questioning what it says, and presenting it so a decision becomes obvious. The dashboard below is a presentation of that craft using demo data."
        />

        <div className="mt-14 lg:mt-20">
          <Dashboard />
        </div>

        <div className="mt-20 border-t border-line pt-14 lg:mt-28">
          <Workflow />
        </div>
      </div>
    </section>
  );
}
