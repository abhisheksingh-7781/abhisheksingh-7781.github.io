import { createHash } from 'node:crypto';

import { HttpError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { Message } from '../models/message.js';
import type { ContactInput } from '../validation/contact.js';
import { isDatabaseConnected } from './database.js';
import { sendContactNotification } from './mailer.js';

/**
 * The order here matters: the message is stored *before* delivery is attempted,
 * so a submission survives an SMTP outage. The stored record is then updated
 * with the outcome, which makes failed deliveries findable afterwards.
 *
 * A submission is only reported as failed when it was neither stored nor sent.
 */

export type SubmissionContext = { ip?: string | undefined; userAgent?: string | undefined };

/**
 * IPs are hashed rather than stored raw: enough to spot one address flooding
 * the form, without keeping identifying data about ordinary visitors.
 */
function hashIp(ip?: string): string | null {
  if (!ip) return null;
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export type SubmissionResult = { stored: boolean; delivered: boolean };

export async function submitContactMessage(
  input: ContactInput,
  context: SubmissionContext,
): Promise<SubmissionResult> {
  let recordId: string | null = null;

  if (isDatabaseConnected()) {
    try {
      const record = await Message.create({
        name: input.name,
        email: input.email,
        message: input.message,
        ipHash: hashIp(context.ip),
        userAgent: context.userAgent?.slice(0, 500) ?? null,
      });
      recordId = record.id;
    } catch (error) {
      logger.error('Failed to store contact message.', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const delivery = await sendContactNotification(input);

  if (recordId) {
    // Best effort: the message is already safe, this only annotates it.
    await Message.findByIdAndUpdate(recordId, {
      delivered: delivery.sent,
      deliveryError: delivery.error ?? null,
    }).catch((error: unknown) => {
      logger.warn('Could not record delivery outcome.', {
        id: recordId,
        error: error instanceof Error ? error.message : String(error),
      });
    });
  }

  const stored = Boolean(recordId);

  if (!stored && !delivery.sent) {
    throw HttpError.serviceUnavailable(
      'The message could not be delivered or saved. Please email directly instead.',
    );
  }

  logger.info('Contact submission handled.', { stored, delivered: delivery.sent });

  return { stored, delivered: delivery.sent };
}

/** Newest-first page of stored messages, for an authenticated admin read. */
export async function listMessages(limit: number, skip: number) {
  if (!isDatabaseConnected()) {
    throw HttpError.serviceUnavailable('Message storage is not configured on this deployment.');
  }

  const [items, total] = await Promise.all([
    Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Message.countDocuments(),
  ]);

  return { items, total };
}
