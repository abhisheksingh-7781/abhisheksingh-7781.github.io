import { Router } from 'express';

import { env } from '../config/env.js';
import { isDatabaseConnected } from '../services/database.js';

/**
 * Liveness and capability report. Hosting platforms poll this to decide
 * whether the instance is healthy; it also makes a misconfigured deploy
 * obvious at a glance, by naming which subsystems are actually wired up.
 */
export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    ok: true,
    status: 'healthy',
    uptimeSeconds: Math.round(process.uptime()),
    environment: env.NODE_ENV,
    build: env.commit,
    services: {
      database: env.storageConfigured ? (isDatabaseConnected() ? 'connected' : 'unavailable') : 'disabled',
      email: env.mailerConfigured ? 'configured' : 'disabled',
      admin: env.adminEnabled ? 'enabled' : 'disabled',
    },
    acceptingMessages: env.canAcceptMessages,
  });
});
