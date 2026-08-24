export type NavItem = {
  /** Matches the section element id — used for smooth scroll + active state. */
  id: string;
  label: string;
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];
