'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

import { EASE, fadeUp, viewportOnce } from '@/animations/motion';
import { PlaceholderMedia, Value } from '@/components/ui/placeholder';
import { SmartLink } from '@/components/ui/smart-link';
import { Tag } from '@/components/ui/tag';
import { isPlaceholder } from '@/data/placeholders';
import type { Project } from '@/data/projects';
import { cn } from '@/lib/utils';

type ProjectCardProps = {
  project: Project;
  /** Wide layout: media beside the copy instead of above it. */
  featured?: boolean;
  /** Which side the media sits on in the wide layout. */
  mediaSide?: 'left' | 'right';
  onOpen: (project: Project) => void;
};

const toneFor = (discipline: Project['discipline']) =>
  discipline === 'analyze' ? 'analyze' : 'build';

export function ProjectCard({
  project,
  featured = false,
  mediaSide = 'left',
  onOpen,
}: ProjectCardProps) {
  const tone = toneFor(project.discipline);

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-line bg-ink-850/60',
        'transition-[border-color,transform,box-shadow] duration-500 ease-smooth',
        'hover:-translate-y-1.5 hover:border-line-strong hover:shadow-lift',
        'focus-within:-translate-y-1.5 focus-within:border-line-strong',
        featured && 'lg:col-span-2',
      )}
    >
      <span className="edge-light" aria-hidden />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500',
          'group-hover:opacity-100 group-focus-within:opacity-100',
          tone === 'build'
            ? 'bg-[radial-gradient(70%_50%_at_50%_0%,rgb(var(--accent)/0.07),transparent)]'
            : 'bg-[radial-gradient(70%_50%_at_50%_0%,rgba(224,164,88,0.07),transparent)]',
        )}
      />

      <div
        className={cn(
          'relative flex flex-col',
          featured && (mediaSide === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'),
        )}
      >
        {/* Media */}
        <div className={cn('relative overflow-hidden', featured && 'lg:w-[55%]')}>
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            {isPlaceholder(project.image) ? (
              <PlaceholderMedia
                label="[PROJECT IMAGE]"
                hint="Set `image` in src/data/projects.ts"
                tone={tone}
                className="h-full w-full rounded-none border-0 border-b border-line transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
              />
            ) : (
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes={featured ? '(max-width: 1024px) 100vw, 55vw' : '(max-width: 1024px) 100vw, 45vw'}
                loading="lazy"
                className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
              />
            )}
          </div>

          {/* Index badge */}
          <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-line-strong bg-ink-950/70 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-chalk-muted backdrop-blur-md">
            Project {project.index}
          </span>
        </div>

        {/* Body */}
        <div className={cn('flex flex-1 flex-col p-6 sm:p-7', featured && 'lg:justify-center lg:p-10')}>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                tone === 'build' ? 'bg-accent' : 'bg-data',
              )}
            />
            <span className="eyebrow">
              {project.discipline === 'both'
                ? 'Product / Data'
                : project.discipline === 'analyze'
                  ? 'Data analysis'
                  : 'Product build'}
            </span>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            <span className="font-mono text-[0.6875rem] text-chalk-faint">
              <Value value={project.year} placeholderClassName="text-[0.625rem]" />
            </span>
          </div>

          <h3 className={cn('mt-4 font-medium tracking-tight text-chalk', featured ? 'text-2xl sm:text-3xl' : 'text-xl')}>
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="text-left after:absolute after:inset-0 after:content-['']"
              aria-label={`Open case study for ${project.title}`}
            >
              <Value value={project.title} placeholderClassName="text-[0.7em]" />
            </button>
          </h3>

          <p className="mt-3 max-w-measure text-sm leading-relaxed text-chalk-muted">
            <Value value={project.summary} placeholderClassName="text-[0.8125rem] leading-relaxed" />
          </p>

          {/* Tech tags */}
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <motion.li
                key={tech}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.35, ease: EASE, delay: 0.05 * i }}
                className="transition-transform duration-500 ease-smooth group-hover:-translate-y-0.5"
                style={{ transitionDelay: `${i * 35}ms` }}
              >
                <Tag tone={tone}>{tech}</Tag>
              </motion.li>
            ))}
          </ul>

          <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-5">
            <div className="flex items-center gap-4">
              <span className="text-[0.8125rem] text-chalk-muted transition-colors group-hover:text-chalk">
                View case study
              </span>

              {/* Direct links sit above the card-wide click target, so they
                  open the repo or demo instead of the case study. */}
              {(!isPlaceholder(project.links.live) || !isPlaceholder(project.links.github)) && (
                <span aria-hidden className="h-3 w-px bg-line-strong" />
              )}

              {!isPlaceholder(project.links.live) ? (
                <SmartLink
                  href={project.links.live}
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 inline-flex items-center gap-1.5 text-[0.8125rem] text-chalk-muted
                             transition-colors hover:text-accent"
                >
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Live
                </SmartLink>
              ) : null}

              {!isPlaceholder(project.links.github) ? (
                <SmartLink
                  href={project.links.github}
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 inline-flex items-center gap-1.5 text-[0.8125rem] text-chalk-muted
                             transition-colors hover:text-accent"
                >
                  <Github className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Code
                </SmartLink>
              ) : null}
            </div>
            <span
              aria-hidden
              className={cn(
                'grid h-9 w-9 place-items-center rounded-full border border-line text-chalk-muted',
                'transition-[transform,border-color,color,background-color] duration-500 ease-smooth',
                'group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-chalk',
                tone === 'build'
                  ? 'group-hover:border-accent/45 group-hover:bg-accent/10'
                  : 'group-hover:border-data/45 group-hover:bg-data/10',
              )}
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
