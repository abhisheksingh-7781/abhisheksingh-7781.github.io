'use client';

import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { useState } from 'react';

import { fadeUp, viewportOnce } from '@/animations/motion';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { isPlaceholder } from '@/data/placeholders';
import { links } from '@/data/links';
import { projects, type Project } from '@/data/projects';

import { ProjectCard } from './project-card';
import { ProjectModal } from './project-modal';

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="section-y relative border-t border-line"
    >
      <div className="shell">
        <SectionHeading
          eyebrow="04 / Work"
          title={<span id="projects-title">Selected Work</span>}
          description="A collection of products, applications, and analytical solutions."
          aside={
            !isPlaceholder(links.github) ? (
              <ButtonLink href={links.github} variant="secondary" size="sm" magnetic>
                <Github className="h-4 w-4" strokeWidth={1.75} />
                All repositories
              </ButtonLink>
            ) : (
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-chalk-faint">
                {projects.length} projects
              </span>
            )
          }
        />

        {/* With a small, high-quality set every card gets the wide treatment
            and the media side alternates. Once there are four or more, only
            the first is featured and the rest fall into the two-up grid. */}
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2">
          {projects.map((project, i) => {
            const allWide = projects.length < 4;
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                featured={allWide || i === 0}
                mediaSide={allWide && i % 2 === 1 ? 'right' : 'left'}
                onOpen={setActive}
              />
            );
          })}
        </div>

        {/* Invitation to add more */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10 text-center text-sm text-chalk-faint"
        >
          More work is being documented. New entries in{' '}
          <code className="rounded border border-line bg-ink-850 px-1.5 py-0.5 font-mono text-[0.75rem] text-chalk-muted">
            src/data/projects.ts
          </code>{' '}
          appear here automatically.
        </motion.p>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
