'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { profile } from '@/data/profile';
import { cn } from '@/lib/utils';

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  else if (values.name.trim().length < 2) errors.name = 'That name looks too short.';

  if (!values.email.trim()) errors.email = 'Please enter an email address.';
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    errors.email = 'That does not look like a valid email address.';

  if (!values.message.trim()) errors.message = 'Please add a message.';
  else if (values.message.trim().length < 20)
    errors.message = 'A little more detail helps — at least 20 characters.';

  return errors;
}

/**
 * The form validates fully on the client. Submission is only attempted when
 * `profile.contact.formEndpoint` is set; otherwise it reports honestly that no
 * backend is connected and offers the mailto route instead. It never pretends
 * to have sent anything.
 */
export function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<Fields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');

  const endpoint = profile.contact.formEndpoint;

  const update = (field: keyof Fields, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: value }));
    }
  };

  const blur = (field: keyof Fields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(nextErrors).length) return;

    if (!endpoint) {
      setStatus('unconfigured');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      setStatus('success');
      setValues({ name: '', email: '', message: '' });
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const fieldClass = (field: keyof Fields) =>
    cn(
      'w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-chalk placeholder:text-chalk-faint',
      'transition-[border-color,background-color] duration-300 outline-none',
      'focus:border-accent/50 focus:bg-ink-900',
      errors[field] && touched[field] ? 'border-data/60' : 'border-line',
    );

  return (
    <form onSubmit={onSubmit} noValidate className="surface p-6 sm:p-8" aria-describedby={`${uid}-status`}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-base font-medium tracking-tight text-chalk">Send a message</h3>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-chalk-faint">
          {endpoint ? 'Connected' : 'Backend not connected'}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {/* Name */}
        <div>
          <label htmlFor={`${uid}-name`} className="eyebrow block">
            Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            onBlur={() => blur('name')}
            aria-invalid={Boolean(errors.name && touched.name)}
            aria-describedby={errors.name && touched.name ? `${uid}-name-error` : undefined}
            placeholder="Your name"
            className={cn(fieldClass('name'), 'mt-2.5')}
          />
          {errors.name && touched.name ? (
            <p id={`${uid}-name-error`} className="mt-2 flex items-center gap-1.5 text-xs text-data-soft">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              {errors.name}
            </p>
          ) : null}
        </div>

        {/* Email */}
        <div>
          <label htmlFor={`${uid}-email`} className="eyebrow block">
            Email
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            onBlur={() => blur('email')}
            aria-invalid={Boolean(errors.email && touched.email)}
            aria-describedby={errors.email && touched.email ? `${uid}-email-error` : undefined}
            placeholder="you@example.com"
            className={cn(fieldClass('email'), 'mt-2.5')}
          />
          {errors.email && touched.email ? (
            <p id={`${uid}-email-error`} className="mt-2 flex items-center gap-1.5 text-xs text-data-soft">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              {errors.email}
            </p>
          ) : null}
        </div>

        {/* Message */}
        <div>
          <label htmlFor={`${uid}-message`} className="eyebrow block">
            Message
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={5}
            required
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
            onBlur={() => blur('message')}
            aria-invalid={Boolean(errors.message && touched.message)}
            aria-describedby={errors.message && touched.message ? `${uid}-message-error` : undefined}
            placeholder="What are you working on?"
            className={cn(fieldClass('message'), 'mt-2.5 resize-y')}
          />
          {errors.message && touched.message ? (
            <p id={`${uid}-message-error`} className="mt-2 flex items-center gap-1.5 text-xs text-data-soft">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          ) : (
            <Send className="h-4 w-4" strokeWidth={1.9} />
          )}
          Send Message
        </Button>

        <p className="text-xs text-chalk-faint">
          Or email directly:{' '}
          <a href={`mailto:${profile.email}`} className="link-underline text-chalk-muted hover:text-chalk">
            {profile.email}
          </a>
        </p>
      </div>

      {/* Status region */}
      <div id={`${uid}-status`} aria-live="polite" className="mt-5 empty:mt-0">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 rounded-xl border border-accent/25 bg-accent/[0.07] p-4 text-sm text-accent-soft"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
              Message sent. Thanks — you will get a reply at the address you provided.
            </motion.p>
          ) : null}

          {status === 'error' ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 rounded-xl border border-data/30 bg-data/[0.07] p-4 text-sm text-data-soft"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
              Something went wrong sending that. Please email {profile.email} instead.
            </motion.p>
          ) : null}

          {status === 'unconfigured' ? (
            <motion.div
              key="unconfigured"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed border-line-strong bg-ink-800/50 p-4"
            >
              <p className="text-sm text-chalk">
                This form has no backend connected yet, so nothing was sent.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-chalk-faint">
                Set{' '}
                <code className="rounded border border-line bg-ink-850 px-1.5 py-0.5 font-mono text-[0.6875rem] text-chalk-muted">
                  contact.formEndpoint
                </code>{' '}
                in{' '}
                <code className="rounded border border-line bg-ink-850 px-1.5 py-0.5 font-mono text-[0.6875rem] text-chalk-muted">
                  src/data/profile.ts
                </code>{' '}
                to an API route or form service, and this submits for real. Until then, use the
                email link above.
              </p>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent('Portfolio enquiry')}&body=${encodeURIComponent(values.message)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-xs text-chalk transition-colors hover:border-accent/45"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                Open this message in your email client
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
