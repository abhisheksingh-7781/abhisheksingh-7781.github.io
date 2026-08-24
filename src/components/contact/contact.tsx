'use client';

import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';

import { fadeUp, stagger, viewportOnce } from '@/animations/motion';
import { ButtonLink } from '@/components/ui/button';
import { PlaceholderText } from '@/components/ui/placeholder';
import { isPlaceholder } from '@/data/placeholders';
import { links } from '@/data/links';
import { profile } from '@/data/profile';

import { ContactForm } from './contact-form';

export function Contact() {
  const [headingA, headingB] = profile.contact.heading;
  const linkedinReady = !isPlaceholder(links.linkedin);

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="section-y relative overflow-hidden border-t border-line"
    >
      {/* Closing glow — the visual bookend to the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-30%] h-[560px] bg-[radial-gradient(50%_60%_at_50%_100%,rgba(53,199,154,0.09),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg opacity-[0.4] [mask-image:radial-gradient(70%_60%_at_50%_60%,#000,transparent)]"
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Pitch */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger(0.09)}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="eyebrow">09 / Contact</span>
            </motion.div>

            <motion.h2
              id="contact-title"
              variants={fadeUp}
              className="mt-6 text-display-lg font-semibold tracking-tight text-chalk"
            >
              {headingA}
              <br />
              <span className="serif-accent text-chalk-muted">{headingB}</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="lead mt-6 max-w-measure">
              {profile.contact.supporting}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href={`mailto:${profile.email}`} size="lg" magnetic>
                <Mail className="h-4 w-4" strokeWidth={1.9} />
                Send Email
              </ButtonLink>

              {linkedinReady ? (
                <ButtonLink href={links.linkedin} variant="secondary" size="lg" magnetic>
                  <Linkedin className="h-4 w-4" strokeWidth={1.9} />
                  Connect on LinkedIn
                </ButtonLink>
              ) : (
                <span
                  className="inline-flex h-[3.25rem] cursor-not-allowed items-center gap-2 rounded-full
                             border border-dashed border-line-strong px-7 text-[0.9375rem] text-chalk-faint"
                  aria-disabled="true"
                  title="Add the LinkedIn URL in src/data/links.ts"
                >
                  <Linkedin className="h-4 w-4" strokeWidth={1.9} />
                  Connect on LinkedIn
                  <PlaceholderText className="ml-1 text-[0.625rem]">[URL]</PlaceholderText>
                </span>
              )}
            </motion.div>

            <motion.dl variants={fadeUp} className="mt-12 space-y-6 border-t border-line pt-8">
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-underline break-all text-lg text-chalk transition-colors hover:text-accent sm:text-xl"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Phone</dt>
                <dd className="mt-2">
                  <a
                    href={profile.phoneHref}
                    className="link-underline font-mono text-base text-chalk transition-colors hover:text-accent"
                  >
                    {profile.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Based in</dt>
                <dd className="mt-2 text-sm text-chalk-muted">{profile.location}</dd>
              </div>
              <div>
                <dt className="eyebrow">Availability</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm text-chalk-muted">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent/70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  {profile.availability}
                </dd>
              </div>
            </motion.dl>
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
