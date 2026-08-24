/** Tiny class-name joiner. Avoids pulling in clsx for a five-line utility. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Scrolls to a section id, using Lenis when available and native otherwise. */
export function scrollToSection(id: string) {
  if (typeof window === 'undefined') return;
  const target = document.getElementById(id);
  if (!target) return;

  const lenis = window.__lenis;
  const offset = -72; // clear the sticky navigation

  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.15 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  // Keep the URL and focus in sync for keyboard and screen-reader users.
  history.replaceState(null, '', `#${id}`);
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Deterministic pseudo-random in [0,1) so SSR and client agree. */
export function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
