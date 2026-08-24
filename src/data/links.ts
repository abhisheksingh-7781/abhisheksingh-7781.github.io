import type { LucideIcon } from 'lucide-react';
import { FileText, Github, Linkedin, Mail } from 'lucide-react';

/**
 * Single source of truth for every outbound link on the site.
 * Replace the bracketed placeholders with real URLs - the UI updates itself.
 */
export const links = {
  github: 'https://github.com/abhisheksingh-7781',
  linkedin: 'https://www.linkedin.com/in/abhishek-singh-406a96307/',
  /** Resume PDF served from /public. */
  resume: '/abhishek-singh-resume.pdf',
  email: 'abhisheksingh5208@gmail.com',
  phone: '+91 8298071629',
  /** Digits only, for the tel: href. */
  phoneHref: 'tel:+918298071629',
} as const;

export type SocialKey = 'github' | 'linkedin' | 'resume' | 'email';

export type SocialLink = {
  key: SocialKey;
  label: string;
  /** Short line shown in the "Professional links" grid. */
  description: string;
  href: string;
  /** Handle or filename shown under the description. */
  handle: string;
  icon: LucideIcon;
  external: boolean;
};

export const socialLinks: SocialLink[] = [
  {
    key: 'github',
    label: 'GitHub',
    description: 'Source code for the chatbot, the storefront and the grocery app.',
    href: links.github,
    handle: '@abhisheksingh-7781',
    icon: Github,
    external: true,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    description: 'Professional background and updates.',
    href: links.linkedin,
    handle: 'in/abhishek-singh-406a96307',
    icon: Linkedin,
    external: true,
  },
  {
    key: 'resume',
    label: 'Resume',
    description: 'Full experience, skills and education as a PDF.',
    href: links.resume,
    handle: 'abhishek-singh-resume.pdf',
    icon: FileText,
    external: true,
  },
  {
    key: 'email',
    label: 'Email',
    description: 'Fastest way to start a conversation.',
    href: `mailto:${links.email}`,
    handle: links.email,
    icon: Mail,
    external: false,
  },
];
