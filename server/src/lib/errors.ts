import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * An error carrying the HTTP status it should produce. Anything thrown that is
 * not an HttpError is treated as an unexpected fault and reported as a 500
 * with no internal detail leaked to the client.
 */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, 'BAD_REQUEST', message, details);
  }

  static notFound(message = 'Resource not found.') {
    return new HttpError(404, 'NOT_FOUND', message);
  }

  static tooManyRequests(message: string) {
    return new HttpError(429, 'RATE_LIMITED', message);
  }

  static serviceUnavailable(message: string) {
    return new HttpError(503, 'SERVICE_UNAVAILABLE', message);
  }
}

/**
 * Wraps an async handler so a rejected promise reaches Express's error
 * pipeline. Express 4 does not forward rejections on its own.
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
