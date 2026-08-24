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
        ink: {
          950: '#08090B', // page background
          900: '#0B0D10', // raised background
          850: '#0F1116', // card background
          800: '#14171D', // elevated card / hover
          700: '#1C2027',
          600: '#272C35',
        },
        chalk: {
          DEFAULT: '#F4F5F7', // primary text
          muted: '#9AA1AC', // secondary text
          faint: '#666D78', // tertiary / meta text
        },
        accent: {
          DEFAULT: '#35C79A', // "build" — primary accent
          soft: '#5FD8B4',
          deep: '#1E8F6E',
        },
        data: {
          DEFAULT: '#E0A458', // "analyze" — secondary accent, charts only
          soft: '#EDBE84',
          deep: '#A9742F',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          strong: 'rgba(255,255,255,0.14)',
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
