import { Router } from 'express';

import { contactRouter } from './contact.js';
import { healthRouter } from './health.js';

/** Everything under /api. */
export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(contactRouter);

apiRouter.get('/', (_req, res) => {
  res.json({
    ok: true,
    name: 'abhishek-singh-portfolio-api',
    endpoints: {
      'GET /api/health': 'Service health and configured capabilities.',
      'POST /api/contact': 'Submit a contact form message.',
      'GET /api/contact/messages': 'List stored messages (requires x-api-key).',
    },
  });
});
