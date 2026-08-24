export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  /** Free text so that "Present" or a placeholder both work. */
  start: string;
  end: string;
  location: string;
  type: string;
  description: string;
  /** Bullet points, taken from the CV. */
  highlights: string[];
  stack: string[];
};

/**
 * EXPERIENCE
 * ---------------------------------------------------------------------------
 * From the Internship Experience section of Abhishek's CV. Nothing is added
 * that the CV does not state; unstated fields stay as placeholders.
 */
export const experience: ExperienceItem[] = [
  {
    id: 'humming-byte-intern',
    role: 'Software Developer Intern',
    company: 'Humming Byte Technologies',
    start: 'May 2024',
    end: 'Sep 2024',
    location: '[LOCATION]',
    type: 'Internship',
    description:
      'Worked as a Software Developer Intern on real-world development tasks and assignments.',
    highlights: [
      'Gained hands-on experience in web application development and problem-solving.',
      'Collaborated with mentors and team members to understand project requirements and implementation.',
      'Demonstrated strong learning ability, self-motivation and responsibility while completing tasks on time.',
    ],
    stack: ['[TECHNOLOGY USED]'],
  },
];

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  /** Credential URL, or a PDF served from /public. */
  url: string;
  /** Optional one-line note about what the credential was for. */
  note?: string;
};

/**
 * CERTIFICATIONS
 * The hackathon certificate PDF lives in /public and is linked directly.
 */
export const certifications: Certification[] = [
  {
    name: 'Job-Ready Hackathon - Certificate of Participation',
    issuer: 'Sheryians Coding School',
    date: '26 July 2025',
    url: '/abhishek-singh-hackathon-certificate.pdf',
    note: 'A frontend-focused competition run as part of the AI Powered Job-Ready Cohort.',
  },
];
