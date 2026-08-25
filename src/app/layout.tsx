import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

import { AppProviders } from '@/components/providers/app-providers';
import { THEME_SCRIPT } from '@/components/providers/theme-provider';
import { profile } from '@/data/profile';

import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  axes: ['opsz'],
});

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic', 'normal'],
  display: 'swap',
  variable: '--font-display',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const title = `${profile.name} - Full Stack Developer & Data Analyst`;
const description = profile.hero.description;

export const metadata: Metadata = {
  title: { default: title, template: `%s - ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    'Abhishek Singh',
    'Full Stack Developer',
    'Data Analyst',
    'React',
    'Next.js',
    'TypeScript',
    'SQL',
    'Python',
    'Portfolio',
  ],
  openGraph: {
    title,
    description,
    type: 'profile',
    siteName: `${profile.name} Portfolio`,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
  // Set this once the site has a domain, so social cards resolve correctly.
  // metadataBase: new URL('[SITE URL]'),
};

export const viewport: Viewport = {
  // Two entries so the browser chrome matches before scripting decides; the
  // theme provider rewrites the tag afterwards to follow the actual choice.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F7F9' },
    { media: '(prefers-color-scheme: dark)', color: '#08090B' },
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Applies the stored (or system) theme before the first paint. A
          blocking inline script is the only thing that runs early enough —
          anything bundled would arrive after the page has already painted the
          wrong colours. suppressHydrationWarning above covers the class this
          adds to <html>.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />

        {/*
          Framer Motion renders each element's `initial` state into the HTML, so
          roughly a hundred nodes ship with inline opacity:0. That is correct
          while scripting works — and leaves a blank page when it does not.
          This reveals them for anyone browsing without JavaScript.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh bg-ink-950 font-sans text-chalk">
        <a
          href="#main"
          className="sr-only rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink-950
                     focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[110]"
        >
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
