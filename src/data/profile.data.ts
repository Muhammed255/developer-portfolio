// Single source of truth for personal details shown across the site
// (header, footer, home, about, contact).

export interface Profile {
  name: string;
  shortName: string;
  role: string;
  headline: string;
  summary: string;
  location: string;
  availability: string;
  email: string;
  photo: string;
  links: { github: string; linkedin: string };
  focusAreas: { icon: string; title: string; text: string }[];
  education: { degree: string; school: string; year: number }[];
  languages: { name: string; level: string }[];
}

export const profile: Profile = {
  name: 'Mohamed Ahmed Abdelazim',
  shortName: 'Mohamed Abdelazim',
  role: 'Full-Stack Developer',
  headline: 'I build reliable web applications, from database to UI.',
  summary:
    'MEAN stack developer focused on Angular front ends and Node.js / NestJS back ends. ' +
    'I design REST APIs, model data in MongoDB and PostgreSQL, and ship containerised services with Docker.',
  location: 'Egypt · Remote',
  availability: 'Open to new opportunities',
  email: 'mhmd.ahmd.0597@gmail.com',
  photo: 'dev-pic.webp',
  links: {
    github: 'https://github.com/Muhammed255',
    linkedin: 'https://linkedin.com/in/mhmdahmd97',
  },
  focusAreas: [
    {
      icon: 'web',
      title: 'Front end',
      text: 'Angular applications with Angular Material, reactive state with NgRx and RxJS, responsive and accessible UI.',
    },
    {
      icon: 'dns',
      title: 'Back end',
      text: 'REST APIs with Node.js, Express and NestJS, documented with Swagger, backed by MongoDB, PostgreSQL and Redis.',
    },
    {
      icon: 'cloud',
      title: 'Delivery',
      text: 'Docker-based environments, microservice-oriented architecture and Git workflows for teams.',
    },
  ],
  education: [{ degree: "Bachelor's Degree in Computer Science", school: 'Helwan University', year: 2022 }],
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Intermediate' },
  ],
};
