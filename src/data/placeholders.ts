/**
 * Placeholder convention
 * ---------------------------------------------------------------------------
 * Every value Abhishek has not supplied yet is written as `[SOMETHING]`.
 * The UI detects that shape and renders a clearly-marked, non-interactive
 * placeholder instead of a broken link or an invented fact.
 *
 * To go live: replace the bracketed string with the real value. Nothing else
 * needs to change.
 */
export const isPlaceholder = (value?: string | null): boolean =>
  !value || /^\s*\[.*\]\s*$/.test(value);

/** Real value if present, otherwise `fallback` (default: empty string). */
export const resolve = (value: string | undefined, fallback = ''): string =>
  isPlaceholder(value) ? fallback : (value as string);
