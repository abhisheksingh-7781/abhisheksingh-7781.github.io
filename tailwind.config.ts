import type { Config } from 'tailwindcss';

/**
 * Design system
 * ---------------------------------------------------------------------------
 * Colour  : dark-first charcoal scale + one primary accent (jade) and one
 *           secondary accent (amber) reserved for the data/analytics language.
 * Type    : Inter (UI/body) · Instrument Serif (display accent) · JetBrains
 *           Mono (eyebrows, tags, numerals).
 * Spacing : 4px base, section rhythm expressed through the `section-*` scale.
 */
/**
 * Builds a Tailwind colour from a CSS variable holding an "R G B" triplet.
 *
 * With no alpha modifier the colour falls back to `defaultAlphaVar` when one is
 * given (hairlines), or full opacity when it is not. With a modifier
 * (`bg-ink-800/60`) Tailwind's value wins.
 */
const themed = (rgbVar: string, defaultAlphaVar?: string): string => {
  const resolve = ({ opacityValue }: { opacityValue?: string | number } = {}) => {
    /**
     * Tailwind calls this twice per colour. For the base utility it passes its
     * own `var(--tw-*-opacity)` placeholder — which it then pins to 1 — and for
     * a modifier (`border-line/70`) it passes the literal number.
     *
     * Treating the placeholder as "no modifier given" is what lets a hairline
     * keep its resting alpha. Without this check `border-line` renders at full
     * opacity, turning every hairline into a solid rule.
     */
    // Tailwind passes a number for some modifiers and a string for others.
    const given = opacityValue === undefined ? undefined : String(opacityValue);
    const explicit = given !== undefined && !given.startsWith('var(');

    if (!explicit) {
      return defaultAlphaVar
        ? `rgb(var(${rgbVar}) / var(${defaultAlphaVar}))`
        : `rgb(var(${rgbVar}))`;
    }

    return `rgb(var(${rgbVar}) / ${given})`;
  };

  // Tailwind accepts a resolver function here, but its published types narrow
  // the field to `string`. The cast keeps the config type-checkable without
  // widening the whole theme object to `any`.
  return resolve as unknown as string;
};

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem', xl: '2.5rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        /**
         * Every colour resolves through a CSS variable, so the same class
         * (`bg-ink-950`, `text-chalk-muted`) means "page background" or
         * "secondary text" in either theme. Swapping the variables in
         * globals.css re-themes the entire site without touching a component.
         *
         * Values are space-separated RGB triplets rather than hex, because
         * `rgb(... / <alpha-value>)` is what lets Tailwind's alpha modifiers
         * (`bg-ink-800/60`) keep working.
         */
        ink: {
          950: themed('--ink-950'),
          900: themed('--ink-900'),
          850: themed('--ink-850'),
          800: themed('--ink-800'),
          700: themed('--ink-700'),
          600: themed('--ink-600'),
        },
        chalk: {
          DEFAULT: themed('--chalk'),
          muted: themed('--chalk-muted'),
          faint: themed('--chalk-faint'),
        },
        accent: {
          DEFAULT: themed('--accent'),
          soft: themed('--accent-soft'),
          deep: themed('--accent-deep'),
        },
        data: {
          DEFAULT: themed('--data'),
          soft: themed('--data-soft'),
          deep: themed('--data-deep'),
        },
        /**
         * Hairlines are translucent so they read correctly over any surface
         * beneath them. Their resting alpha is itself a variable, because a
         * light theme needs a heavier one than a dark theme to look equally
         * faint.
         */
        line: {
          DEFAULT: themed('--line', '--line-alpha'),
          strong: themed('--line', '--line-strong-alpha'),
        },
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Fluid display scale — clamp() keeps hierarchy intact on every device.
        'display-xl': ['clamp(2.75rem, 8.5vw, 7.5rem)', { lineHeight: '0.92', letterSpacing: '-0.045em' }],
        'display-lg': ['clamp(2.25rem, 5.5vw, 4.25rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(1.875rem, 4vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.5rem, 2.6vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      spacing: {
        'section-sm': '4.5rem',
        section: '7rem',
        'section-lg': '10rem',
      },
      maxWidth: { measure: '62ch', 'measure-sm': '48ch' },
      borderRadius: { xl: '0.875rem', '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.7)',
        lift: '0 24px 60px -28px rgba(0,0,0,0.85)',
        'glow-accent': '0 0 0 1px rgba(53,199,154,0.22), 0 18px 60px -24px rgba(53,199,154,0.35)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, transparent, rgba(8,9,11,0.85) 70%, #08090B 100%)',
        'accent-sheen':
          'linear-gradient(120deg, rgba(53,199,154,0.16), rgba(53,199,154,0) 55%)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        crisp: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'caret-blink': { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'caret-blink': 'caret-blink 1.1s steps(1) infinite',
        marquee: 'marquee 38s linear infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.22,1,0.36,1) infinite',
      },
      screens: { xs: '420px' },
    },
  },
  plugins: [],
};

export default config;
