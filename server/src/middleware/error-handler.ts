import type { ErrorRequestHandler, RequestHandler } from 'express';

import { HttpError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

/** Terminal 404 for any path no route claimed. */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(HttpError.notFound(`No route matches ${req.method} ${req.originalUrl}.`));
};

/**
 * Single place where errors become responses. Known HttpErrors pass their
 * status, code and message through; anything else is logged in full and
 * answered with a generic 500, so stack traces never reach a client.
 */
/**
 * express.json() rejects malformed or oversized payloads with its own tagged
 * errors. Left alone they read as unexpected faults and become a 500, so they
 * are translated into the 4xx they actually are.
 */
function fromBodyParser(error: unknown): HttpError | null {
  if (typeof error !== 'object' || error === null || !('type' in error)) return null;

  switch ((error as { type: unknown }).type) {
    case 'entity.too.large':
      return new HttpError(413, 'PAYLOAD_TOO_LARGE', 'That request body is too large.');
    case 'entity.parse.failed':
      return HttpError.badRequest('The request body is not valid JSON.');
    default:
      return null;
  }
}

export const errorHandler: ErrorRequestHandler = (rawError, req, res, _next) => {
  const error = fromBodyParser(rawError) ?? rawError;

  if (error instanceof HttpError) {
    if (error.status >= 500) {
      logger.error(error.message, { path: req.originalUrl, code: error.code });
    }
    res.status(error.status).json({
      ok: false,
      error: { code: error.code, message: error.message, details: error.details },
    });
    return;
  }

  logger.error('Unhandled error while serving request', {
    path: req.originalUrl,
    method: req.method,
    error: error instanceof Error ? error.stack ?? error.message : String(error),
  });

  res.status(500).json({
    ok: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong on our side.' },
  });
};
