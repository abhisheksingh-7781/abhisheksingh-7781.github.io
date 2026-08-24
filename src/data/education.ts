export type EducationItem = {
  id: string;
  period: string;
  degree: string;
  institution: string;
  location: string;
  detail: string;
  /** Coursework, focus areas or achievements. Placeholders until supplied. */
  focus: string[];
};

/** From the Education section of Abhishek's CV. */
export const education: EducationItem[] = [
  {
    id: 'bsc-it',
    period: '2021 - 2024',
    degree: 'Bachelor of Science in Information Technology (BSc IT)',
    institution: 'Patliputra University - AN College',
    location: '[LOCATION]',
    detail:
      'Three years of undergraduate study in information technology, alongside self-directed work building full stack applications.',
    focus: ['[FOCUS AREA]', '[FOCUS AREA]'],
  },
  {
    id: 'hsc',
    period: '2019 - 2021',
    degree: 'Higher Secondary Certificate (HSC), Class 12',
    institution: 'Bihar State Board',
    location: '[LOCATION]',
    detail: 'Stream: Science.',
    focus: ['Science'],
  },
];
