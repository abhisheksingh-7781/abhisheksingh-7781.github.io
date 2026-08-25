import { Router } from 'express';
import { z } from 'zod';

import { env } from '../config/env.js';
import { HttpError, asyncHandler } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { contactRateLimit } from '../middleware/rate-limit.js';
import { requireAdmin } from '../middleware/admin-auth.js';
import { listMessages, submitContactMessage } from '../services/contact-service.js';
import { contactSchema, fieldErrors } from '../validation/contact.js';

export const contactRouter = Router();

/**
 * POST /api/contact
 * The endpoint the portfolio's contact form submits to. Responses distinguish
 * validation failure (400, with per-field messages the form can render) from
 * the service having nowhere to put the message (503).
 */
contactRouter.post(
  '/contact',
  contactRateLimit,
  asyncHandler(async (req, res) => {
    if (!env.canAcceptMessages) {
      throw HttpError.serviceUnavailable(
        'This API has no email or storage configured, so it cannot accept messages.',
      );
    }

    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      throw HttpError.badRequest('Some fields need fixing.', {
        fields: fieldErrors(parsed.error),
      });
    }

    // Honeypot: answer as if it succeeded so the bot has nothing to learn,
    // but do no work and send no mail.
    if (parsed.data.company) {
      logger.warn('Contact submission rejected by honeypot.', { ip: req.ip });
      res.status(202).json({ ok: true, message: 'Message received.' });
      return;
    }

    const result = await submitContactMessage(parsed.data, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      ok: true,
      message: result.delivered
        ? 'Message sent. You will get a reply at the address you provided.'
        : 'Message received and saved. You will get a reply at the address you provided.',
    });
  }),
);

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  skip: z.coerce.number().int().min(0).default(0),
});

/**
 * GET /api/contact/messages
 * Read-only view of stored submissions, for checking what came in without
 * opening a database client. Requires the admin key.
 */
contactRouter.get(
  '/contact/messages',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const query = listQuerySchema.safeParse(req.query);
    if (!query.success) {
      throw HttpError.badRequest('Invalid query parameters.', {
        fields: fieldErrors(query.error),
      });
    }

    const { items, total } = await listMessages(query.data.limit, query.data.skip);

    res.json({
      ok: true,
      data: items,
      pagination: { total, limit: query.data.limit, skip: query.data.skip },
    });
  }),
);
