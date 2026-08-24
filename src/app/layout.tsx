import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

import { AppProviders } from '@/components/providers/app-providers';
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
  themeColor: '#08090B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable} dark`}
      suppressHydrationWarning
    >
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
