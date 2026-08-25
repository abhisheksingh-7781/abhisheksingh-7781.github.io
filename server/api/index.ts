import type { IncomingMessage, ServerResponse } from 'node:http';

import { createApp } from '../src/app.js';
import { logger } from '../src/lib/logger.js';
import { ensureDatabase } from '../src/services/database.js';

/**
 * VERCEL SERVERLESS ENTRY
 * ---------------------------------------------------------------------------
 * Vercel invokes a handler per request instead of running src/index.ts, so
 * there is no boot step and no app.listen(). The Express app is built once at
 * module scope: that cost is paid on a cold start and reused by every warm
 * invocation on the same instance.
 *
 * src/index.ts remains the entry for long-running hosts (Render, Docker).
 */
const app = createApp();

/**
 * vercel.json sends every path to this function. Whether the platform hands us
 * the original path or the route destination has varied across Vercel's
 * routing versions, so rather than depend on it, anything that does not
 * already address the API is prefixed with /api — the mount point the Express
 * app expects.
 */
function normalisePath(req: IncomingMessage) {
  const url = req.url ?? '/';
  if (url === '/api' || url.startsWith('/api/') || url.startsWith('/api?')) return;
  req.url = url === '/' ? '/api' : `/api${url.startsWith('/') ? '' : '/'}${url}`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  normalisePath(req);

  try {
    // Lazy because there is no boot hook here. Resolves immediately when the
    // connection is already open, or when storage is not configured at all.
    await ensureDatabase();
  } catch (error) {
    // Not fatal: without storage the API can still deliver by email, and the
    // contact route returns 503 only if neither route is available.
    logger.error('Database unavailable for this invocation.', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return app(req, res);
}
