import nodemailer, { type Transporter } from 'nodemailer';

import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import type { ContactInput } from '../validation/contact.js';

/**
 * Email delivery over SMTP. Optional: without full credentials the transport
 * is never created and sendContactNotification reports that it did nothing,
 * leaving the database as the record of the message.
 */

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.mailerConfigured) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER!, pass: env.SMTP_PASSWORD! },
  });

  return transporter;
}

/** Verifies SMTP credentials at boot so failures surface before a visitor hits them. */
export async function verifyMailer(): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    logger.warn('SMTP is not fully configured — no notification emails will be sent.');
    return;
  }

  try {
    await transport.verify();
    logger.info('SMTP transport verified.', { host: env.SMTP_HOST, port: env.SMTP_PORT });
  } catch (error) {
    logger.error('SMTP verification failed — email delivery will likely fail.', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/** Escapes text before it goes into the HTML body of the notification. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type DeliveryResult = { sent: boolean; error?: string };

/**
 * Sends the notification for one submission. Reply-To is the sender's address,
 * so replying from the inbox reaches them directly. From stays on a domain the
 * SMTP account is allowed to send as — putting the visitor's address there
 * would fail SPF and land the mail in spam.
 */
export async function sendContactNotification(input: ContactInput): Promise<DeliveryResult> {
  const transport = getTransporter();
  if (!transport) return { sent: false, error: 'SMTP is not configured.' };

  const from = env.CONTACT_FROM_EMAIL ?? env.SMTP_USER!;

  try {
    await transport.sendMail({
      from: { name: 'Portfolio contact form', address: from },
      to: env.CONTACT_TO_EMAIL!,
      replyTo: { name: input.name, address: input.email },
      subject: `Portfolio enquiry from ${input.name}`,
      text: [
        `Name:    ${input.name}`,
        `Email:   ${input.email}`,
        '',
        input.message,
      ].join('\n'),
      html: [
        '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.6">',
        `<p><strong>Name:</strong> ${escapeHtml(input.name)}<br>`,
        `<strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>`,
        '<hr style="border:none;border-top:1px solid #ddd">',
        `<p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`,
        '</div>',
      ].join(''),
    });

    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Failed to send contact notification.', { error: message });
    return { sent: false, error: message };
  }
}
