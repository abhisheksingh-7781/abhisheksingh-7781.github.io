import cors, { type CorsOptions } from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { HttpError } from './lib/errors.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { globalRateLimit } from './middleware/rate-limit.js';
import { apiRouter } from './routes/index.js';

/**
 * Builds the Express application. Kept separate from the server bootstrap in
 * index.ts so the app can be imported and exercised without binding a port.
 */
export function createApp(): Express {
  const app = express();

  /**
   * Behind a platform proxy (Render, Railway, Fly, Nginx) req.ip is the proxy
   * unless Express is told how many hops to trust. Rate limiting depends on
   * this being right, so it is configured rather than assumed.
   */
  app.set('trust proxy', env.TRUST_PROXY);
  app.disable('x-powered-by');

  // This API returns only JSON, so the browser-facing CSP defaults helmet
  // applies to HTML documents are unnecessary here.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      // No Origin header means a non-browser client (curl, health checks),
      // which CORS does not govern.
      if (!origin) return callback(null, true);
      if (env.CORS_ORIGINS.includes(origin)) return callback(null, true);
      // Surfaced as a 403 rather than an opaque 500, so a missing entry in
      // CORS_ORIGINS is obvious from the response during deployment.
      return callback(
        new HttpError(403, 'CORS_DENIED', `Origin ${origin} is not allowed by this API.`),
      );
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'x-api-key'],
    maxAge: 86_400,
  };

  app.use(cors(corsOptions));
  app.use(express.json({ limit: '32kb' }));
  app.use(globalRateLimit);

  app.use('/api', apiRouter);

  // Root redirect keeps a bare visit to the host informative.
  app.get('/', (_req, res) => {
    res.redirect(308, '/api');
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
