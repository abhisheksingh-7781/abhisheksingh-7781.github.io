'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Github, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef } from 'react';

import { modalOverlay, modalPanel } from '@/animations/motion';
import { PlaceholderMedia, Value } from '@/components/ui/placeholder';
import { SmartLink } from '@/components/ui/smart-link';
import { Tag } from '@/components/ui/tag';
import { isPlaceholder } from '@/data/placeholders';
import type { Project } from '@/data/projects';
import { useEscapeKey, useFocusTrap, useScrollLock } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/** One titled block of the case study. */
function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-6">
      <h3 className="eyebrow">{label}</h3>
      <div className="mt-3 text-sm leading-relaxed text-chalk-muted">{children}</div>
    </section>
  );
}

function List({ items, marker }: { items: string[]; marker: 'build' | 'analyze' }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn(
              'mt-[0.45rem] h-1 w-1 shrink-0 rounded-full',
              marker === 'build' ? 'bg-accent/70' : 'bg-data/70',
            )}
          />
          <span className="flex-1">
            <Value value={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = Boolean(project);
  const close = useCallback(() => onClose(), [onClose]);

  useScrollLock(open);
  useEscapeKey(open, close);
  useFocusTrap(panelRef, open);

  const tone = project?.discipline === 'analyze' ? 'analyze' : 'build';

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key="project-modal"
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto overscroll-contain p-0 sm:p-6 md:p-10"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          data-lenis-prevent
        >
          <button
            type="button"
            aria-label="Close case study"
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 h-full w-full cursor-default bg-ink-950/85 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            variants={modalPanel}
            className="relative my-0 w-full max-w-4xl overflow-hidden border border-line bg-ink-900 shadow-lift sm:my-auto sm:rounded-2xl"
          >
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-ink-900/90 px-6 py-5 backdrop-blur-xl sm:px-8">
              <div className="min-w-0">
                <p className="eyebrow">Project {project.index}</p>
                <h2
                  id="project-modal-title"
                  className="mt-2 truncate text-xl font-medium tracking-tight text-chalk sm:text-2xl"
                >
                  <Value value={project.title} placeholderClassName="text-[0.7em]" />
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close case study"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line
                           text-chalk-muted transition-colors hover:border-line-strong hover:text-chalk"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </header>

            <div className="px-6 pb-10 pt-6 sm:px-8">
              {/* Hero media */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line">
                {isPlaceholder(project.image) ? (
                  <PlaceholderMedia
                    label="[PROJECT IMAGE]"
                    tone={tone}
                    className="h-full w-full rounded-none border-0"
                  />
                ) : (
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-cover"
                  />
                )}
              </div>

              {/* Meta strip */}
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-b border-line pb-6 sm:grid-cols-4">
                <div>
                  <dt className="eyebrow">Role</dt>
                  <dd className="mt-2 text-sm text-chalk">
                    <Value value={project.role} />
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Year</dt>
                  <dd className="mt-2 font-mono text-sm text-chalk">
                    <Value value={project.year} />
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Discipline</dt>
                  <dd className="mt-2 text-sm capitalize text-chalk">
                    {project.discipline === 'both' ? 'Build + Analyze' : project.discipline}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Links</dt>
                  <dd className="mt-2 flex items-center gap-3">
                    <SmartLink
                      href={project.links.live}
                      className="inline-flex items-center gap-1.5 text-sm text-chalk transition-colors hover:text-accent"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Live
                    </SmartLink>
                    <SmartLink
                      href={project.links.github}
                      className="inline-flex items-center gap-1.5 text-sm text-chalk transition-colors hover:text-accent"
                    >
                      <Github className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Code
                    </SmartLink>
                  </dd>
                </div>
              </dl>

              {/* Case study */}
              <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="space-y-8">
                  <Block label="Overview">
                    <Value value={project.detail.overview} />
                  </Block>
                  <Block label="Problem">
                    <Value value={project.detail.problem} />
                  </Block>
                  <Block label="Solution">
                    <Value value={project.detail.solution} />
                  </Block>
                  <Block label="Architecture">
                    <Value value={project.detail.architecture} />
                  </Block>
                  <Block label="Challenges">
                    <List items={project.detail.challenges} marker={tone} />
                  </Block>
                  <Block label="Results">
                    <List items={project.detail.results} marker={tone} />
                  </Block>
                </div>

                <aside className="space-y-8">
                  <Block label="Key features">
                    <List items={project.detail.features} marker={tone} />
                  </Block>
                  <Block label="Technology">
                    <ul className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <li key={tech}>
                          <Tag tone={tone}>{tech}</Tag>
                        </li>
                      ))}
                    </ul>
                  </Block>
                  <Block label="Screenshots">
                    <ul className="space-y-4">
                      {project.detail.screenshots.map((shot, i) => (
                        <li key={i}>
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line">
                            {isPlaceholder(shot.src) ? (
                              <PlaceholderMedia
                                label="[SCREENSHOT]"
                                tone={tone}
                                className="h-full w-full rounded-none border-0"
                              />
                            ) : (
                              <Image
                                src={shot.src}
                                alt={shot.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 320px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <p className="mt-2 text-xs text-chalk-faint">
                            <Value value={shot.caption} />
                          </p>
                        </li>
                      ))}
                    </ul>
                  </Block>
                </aside>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
