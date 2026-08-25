import 'dotenv/config';
import { z } from 'zod';

/**
 * ENVIRONMENT
 * ---------------------------------------------------------------------------
 * Every setting the API reads is declared here and validated once, at boot.
 * A bad value crashes the process immediately with a readable message rather
 * than surfacing as a confusing runtime failure on the first request.
 *
 * Email delivery and database storage are both optional and independent. The
 * contact route refuses to accept messages only when *neither* is configured,
 * so a submission is never silently dropped.
 */

/** Splits a comma-separated list, trimming blanks. */
const csv = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  /**
   * Origins allowed to call this API from a browser. The portfolio is served
   * from GitHub Pages, so the deployed origin must be listed explicitly —
   * wildcards are deliberately not supported for a credentialed API.
   */
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3100')
    .transform(csv),

  /** Trust proxy hop count. Set to 1 behind Render/Railway/Fly/Nginx. */
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),

  /** Contact form rate limit: max submissions per IP per window. */
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  CONTACT_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),

  /** MongoDB connection string. Omit to run without persistence. */
  MONGODB_URI: z.string().url().optional(),
  MONGODB_DB_NAME: z.string().min(1).default('portfolio'),

  /** SMTP credentials. Omit any of these to run without email delivery. */
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASSWORD: z.string().min(1).optional(),

  /** Where contact notifications are sent, and the From header they carry. */
  CONTACT_TO_EMAIL: z.string().email().optional(),
  CONTACT_FROM_EMAIL: z.string().email().optional(),

  /**
   * Shared secret guarding the read-only admin endpoints. Omit it and those
   * routes stay disabled entirely, rather than being served unprotected.
   */
  ADMIN_API_KEY: z.string().min(24, 'ADMIN_API_KEY must be at least 24 characters.').optional(),
});

/**
 * A commented-out setting and one left blank mean the same thing to a reader,
 * so they must mean the same thing here. Without this, `SMTP_USER=` fails as
 * "String must contain at least 1 character(s)" instead of simply being absent.
 */
const withoutBlanks = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value?.trim() !== ''),
);

const parsed = schema.safeParse(withoutBlanks);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${details}`);
}

const raw = parsed.data;

/** True only when every field email delivery needs is present. */
const mailerConfigured = Boolean(
  raw.SMTP_HOST && raw.SMTP_USER && raw.SMTP_PASSWORD && raw.CONTACT_TO_EMAIL,
);

export const env = {
  ...raw,
  isProduction: raw.NODE_ENV === 'production',
  mailerConfigured,
  storageConfigured: Boolean(raw.MONGODB_URI),
  adminEnabled: Boolean(raw.ADMIN_API_KEY),
  /**
   * The route layer checks this: with no mailer and no database there is
   * nowhere for a message to go, and the API says so instead of accepting it.
   */
  canAcceptMessages: mailerConfigured || Boolean(raw.MONGODB_URI),
} as const;

export type Env = typeof env;
