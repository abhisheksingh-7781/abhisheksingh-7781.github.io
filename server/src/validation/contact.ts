import { z } from 'zod';

/**
 * Server-side rules for a contact submission. These deliberately mirror the
 * client checks in src/components/contact/contact-form.tsx — the client copy
 * exists for fast feedback, this one is the copy that actually decides.
 */

/** Collapses runs of whitespace so pasted content stores cleanly. */
const tidy = (value: string) => value.trim().replace(/\s+/g, ' ');

export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Please enter your name.' })
    .transform(tidy)
    .pipe(
      z
        .string()
        .min(2, 'That name looks too short.')
        .max(120, 'That name is longer than we can store.'),
    ),

  email: z
    .string({ required_error: 'Please enter an email address.' })
    .transform((value) => value.trim().toLowerCase())
    .pipe(
      z
        .string()
        .email('That does not look like a valid email address.')
        .max(254, 'That email address is too long.'),
    ),

  message: z
    .string({ required_error: 'Please add a message.' })
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .min(20, 'A little more detail helps — at least 20 characters.')
        .max(5000, 'That message is too long. Please keep it under 5000 characters.'),
    ),

  /**
   * Honeypot. The real form renders this field hidden and leaves it empty, so
   * anything in it came from a bot filling every input it found.
   */
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Flattens Zod issues into a `{ field: message }` map for the client. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in result)) {
      result[key] = issue.message;
    }
  }
  return result;
}
