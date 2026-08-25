import { education } from './education';
import { certifications, experience } from './experience';
import { links } from './links';
import { projects } from './projects';

/**
 * PROFILE
 * ---------------------------------------------------------------------------
 * Content is taken from Abhishek's CV. Anything the CV does not state stays a
 * bracketed placeholder, which the UI renders as visibly unfinished rather
 * than inventing a value.
 */
export const profile = {
  name: 'Abhishek Singh',
  roles: ['Full Stack Developer', 'Data Analyst'] as const,
  graduation: '2021-2024',
  email: 'abhisheksingh5208@gmail.com',
  phone: links.phone,
  phoneHref: links.phoneHref,
  location: 'Versova, Andheri West, Mumbai 400061',
  availability: 'Open to opportunities',

  links,

  /** Drop a file in /public and point here, e.g. '/abhishek.jpg'. */
  profileImage: '',
  profileImageAlt: 'Portrait of Abhishek Singh',

  hero: {
    eyebrow: 'Full Stack Developer / Data Analyst',
    headingLines: ['Full Stack Developer', '& Data Analyst'] as const,
    description:
      'I build scalable web applications, intuitive digital experiences, and data-driven solutions that turn complex problems into meaningful products.',
    primaryCta: { label: 'View My Work', target: 'projects' },
    secondaryCta: { label: 'Lets Connect', target: 'contact' },
  },

  about: {
    heading: ['Building with Code.', 'Thinking with Data.'] as const,
    paragraphs: [
      'I am a full stack developer working mainly with React, Redux, Node.js and MongoDB. Recent work includes a ChatGPT-style AI chatbot with a two-layer memory system, a Blinkit-style grocery delivery app covering the whole path from product listing through cart to order, and an electronics storefront shipped inside a hackathon weekend.',
      'Alongside the product work I look after the data those systems run on: modelling it in MongoDB and PostgreSQL, querying it with SQL, and working through it in Excel. Building a system and understanding its data are the same job to me, because a feature is only ever as good as what it does with the information it holds.',
    ],
    bio: '[EXTENDED BIO]',
  },

  disciplines: {
    build: {
      key: 'build' as const,
      title: 'Full Stack Development',
      lead: 'Designing and shipping applications end to end.',
      points: [
        'React and Redux interfaces',
        'Responsive layouts for mobile and desktop',
        'REST APIs with Node.js and Express',
        'MongoDB and PostgreSQL data models',
        'Authentication and user accounts',
        'AI integration with Gemini AI and OpenAI',
      ],
      /** Flow rendered in the Build / Analyze visual. */
      flow: ['Frontend', 'Backend', 'APIs', 'Database'],
    },
    analyze: {
      key: 'analyze' as const,
      title: 'Data Analytics',
      lead: 'Working with the data those applications produce.',
      points: [
        'SQL queries',
        'PostgreSQL',
        'MongoDB data modelling',
        'Microsoft Excel',
        'Vector data with Pinecone',
        '[ADDITIONAL DATA SKILL]',
      ],
      flow: ['Data Collection', 'Cleaning', 'Analysis', 'Visualization', 'Insights'],
    },
  },

  /** The one-line thesis that ties both disciplines together. */
  thesis: 'I do not just build systems. I understand the data flowing through them.',

  contact: {
    heading: ['Have an idea?', "Let's build it."] as const,
    supporting:
      "Whether it's a web application, data problem, or something completely new, let's talk.",
    /**
     * Endpoint for the contact form, supplied by the API in ./server.
     *
     * Set NEXT_PUBLIC_API_URL (e.g. https://portfolio-api.onrender.com) and the
     * form submits for real. Because the site is a static export, this is baked
     * in at build time, so changing it means rebuilding.
     *
     * Left unset, the form stays in "not connected" mode: it validates, but
     * never pretends to send.
     */
    formEndpoint: process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/api/contact`
      : '',
  },

  projects,
  experience,
  certifications,
  education,
} as const;

export type Profile = typeof profile;
