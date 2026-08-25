import type { ContactInput } from '../validation/contact.js';

/**
 * CONTACT NOTIFICATION EMAIL
 * ---------------------------------------------------------------------------
 * Rendered to match the portfolio's own design language: charcoal ground, jade
 * accent, monospace eyebrows.
 *
 * Written the way email demands rather than the way the web does — nested
 * tables for layout, every style inlined, no external assets. Mail clients
 * strip <style> blocks, ignore flexbox and grid, and block remote images by
 * default, so anything structural has to survive on its own.
 */

/** Times are shown where Abhishek reads them, not in the server's UTC. */
const DISPLAY_TIME_ZONE = 'Asia/Kolkata';

/** Portfolio palette (tailwind.config.ts). */
const COLOR = {
  page: '#08090B',
  card: '#0F1116',
  raised: '#14171D',
  border: '#20242C',
  text: '#F4F5F7',
  body: '#D3D8DE',
  muted: '#9AA1AC',
  faint: '#666D78',
  accent: '#35C79A',
} as const;

const FONT_SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const FONT_MONO = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes, then turns newlines into <br> — Outlook ignores white-space:pre-wrap. */
function escapeParagraph(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: DISPLAY_TIME_ZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/** First line of inbox preview text, after the subject. */
function preheader(message: string) {
  const flat = message.replace(/\s+/g, ' ').trim();
  return flat.length > 110 ? `${flat.slice(0, 109)}…` : flat;
}

export type RenderedEmail = { subject: string; text: string; html: string };

export function renderContactEmail(input: ContactInput, receivedAt: Date): RenderedEmail {
  const when = formatTimestamp(receivedAt);
  const subject = `Portfolio message from ${input.name}`;

  const text = [
    `New message from your portfolio contact form`,
    ``,
    `From:     ${input.name}`,
    `Email:    ${input.email}`,
    `Received: ${when}`,
    ``,
    `------------------------------------------------------------`,
    ``,
    input.message,
    ``,
    `------------------------------------------------------------`,
    ``,
    `Reply straight to this email — it goes to ${input.email}.`,
  ].join('\n');

  const replyHref = `mailto:${encodeURIComponent(input.email)}?subject=${encodeURIComponent(
    `Re: ${subject}`,
  )}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLOR.page};">

<!-- Inbox preview line. Hidden in the body, shown in the message list. -->
<div style="display:none;font-size:1px;color:${COLOR.page};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
${escapeHtml(preheader(input.message))}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.page}" style="background-color:${COLOR.page};margin:0;padding:0;">
<tr>
<td align="center" style="padding:32px 16px;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background-color:${COLOR.card};border:1px solid ${COLOR.border};border-radius:14px;overflow:hidden;">

<!-- Accent rule: the one piece of colour that identifies the sender at a glance -->
<tr><td style="height:3px;line-height:3px;font-size:0;background-color:${COLOR.accent};">&nbsp;</td></tr>

<!-- Header -->
<tr>
<td style="padding:30px 32px 0 32px;">
<p style="margin:0;font-family:${FONT_MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLOR.faint};">
New message
</p>
<h1 style="margin:12px 0 0 0;font-family:${FONT_SANS};font-size:23px;line-height:1.25;font-weight:600;letter-spacing:-0.02em;color:${COLOR.text};">
${escapeHtml(input.name)}
</h1>
<p style="margin:7px 0 0 0;font-family:${FONT_SANS};font-size:14px;line-height:1.5;">
<a href="mailto:${escapeHtml(input.email)}" style="color:${COLOR.accent};text-decoration:none;">${escapeHtml(input.email)}</a>
</p>
</td>
</tr>

<!-- Message -->
<tr>
<td style="padding:24px 32px 0 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLOR.raised};border-radius:10px;">
<tr>
<td style="padding:20px 22px;border-left:3px solid ${COLOR.accent};border-radius:10px;">
<p style="margin:0;font-family:${FONT_SANS};font-size:15px;line-height:1.7;color:${COLOR.body};">
${escapeParagraph(input.message)}
</p>
</td>
</tr>
</table>
</td>
</tr>

<!-- Reply action -->
<tr>
<td style="padding:24px 32px 0 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td bgcolor="${COLOR.accent}" style="background-color:${COLOR.accent};border-radius:999px;">
<a href="${replyHref}" style="display:inline-block;padding:12px 26px;font-family:${FONT_SANS};font-size:14px;font-weight:600;color:${COLOR.page};text-decoration:none;border-radius:999px;">
Reply to ${escapeHtml(input.name.split(' ')[0] ?? input.name)}
</a>
</td>
</tr>
</table>
<p style="margin:12px 0 0 0;font-family:${FONT_SANS};font-size:12px;line-height:1.5;color:${COLOR.faint};">
Replying to this email also works — it goes straight to them.
</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:26px 32px 30px 32px;">
<div style="height:1px;line-height:1px;font-size:0;background-color:${COLOR.border};">&nbsp;</div>
<p style="margin:18px 0 0 0;font-family:${FONT_MONO};font-size:11px;line-height:1.7;letter-spacing:0.04em;color:${COLOR.faint};">
${escapeHtml(when)}<br>
Sent from the contact form on abhisheksingh-7781.github.io
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`;

  return { subject, text, html };
}
