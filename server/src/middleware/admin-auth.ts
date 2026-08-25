import { timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

import { env } from '../config/env.js';
import { HttpError } from '../lib/errors.js';

/** Constant-time compare, so a wrong key leaks nothing through timing. */
function matches(provided: string, expected: string) {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Guards the admin endpoints with a shared secret sent as `x-api-key`. With no
 * ADMIN_API_KEY configured the routes answer 404 — an unconfigured admin
 * surface should look absent, not merely locked.
 */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!env.ADMIN_API_KEY) {
    next(HttpError.notFound());
    return;
  }

  const provided = req.get('x-api-key');
  if (!provided || !matches(provided, env.ADMIN_API_KEY)) {
    next(new HttpError(401, 'UNAUTHORIZED', 'A valid x-api-key header is required.'));
    return;
  }

  next();
};
