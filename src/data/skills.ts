export type SkillCategoryId = 'frontend' | 'backend' | 'ai' | 'data';

export type SkillCategory = {
  id: SkillCategoryId;
  label: string;
  /** Short line under the category heading. */
  summary: string;
  /** 'build' tints the group with the primary accent, 'analyze' with the data accent. */
  discipline: 'build' | 'analyze';
  skills: string[];
};

/**
 * SKILLS
 * ---------------------------------------------------------------------------
 * Taken from the Technical Skills section of Abhishek's CV. Shown as tags and
 * clusters, never as invented proficiency percentages. Nothing is listed here
 * that the CV does not actually claim.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    summary: 'Interfaces built to stay responsive on the screens people use.',
    discipline: 'build',
    skills: ['React', 'Redux', 'JavaScript', 'HTML', 'CSS', 'GSAP', 'Bootstrap'],
  },
  {
    id: 'backend',
    label: 'Backend & Database',
    summary: 'The APIs, data models and services behind the interface.',
    discipline: 'build',
    skills: ['Node.js', 'Express', 'REST APIs', 'MongoDB', 'PostgreSQL', 'Authentication'],
  },
  {
    id: 'ai',
    label: 'AI Integration',
    summary: 'Wiring language models into products, with memory that persists.',
    discipline: 'build',
    skills: ['Gemini AI', 'OpenAI', 'Pinecone', 'Vector databases', 'Memory systems'],
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    summary: 'Working with the data the applications produce.',
    discipline: 'analyze',
    skills: [
      'Microsoft Excel',
      'SQL',
      'PostgreSQL',
      '[ADDITIONAL DATA TOOL]',
      '[ADDITIONAL DATA SKILL]',
    ],
  },
];

/** Tooling that scrolls in the ambient marquee under the skills grid. */
export const toolbelt: string[] = [
  'React',
  'Redux',
  'JavaScript',
  'Node.js',
  'Express',
  'MongoDB',
  'PostgreSQL',
  'Pinecone',
  'Gemini AI',
  'GSAP',
  'Bootstrap',
  'Git',
  'Postman',
  'Excel',
];

/** General tooling, shown as a secondary row rather than a skill claim. */
export const workflowTools: string[] = ['Git', 'Postman'];
