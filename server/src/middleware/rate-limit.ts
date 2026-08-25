import rateLimit from 'express-rate-limit';

import { env } from '../config/env.js';

/**
 * Per-IP throttle on the contact endpoint. The portfolio gets low legitimate
 * traffic, so a tight limit costs real visitors nothing while making the form
 * useless as a spam relay.
 */
export const contactRateLimit = rateLimit({
  windowMs: env.CONTACT_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  limit: env.CONTACT_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many messages sent from this address. Please try again later.',
    },
  },
});

/** A looser ceiling applied to everything, as a blunt abuse backstop. */
export const globalRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
