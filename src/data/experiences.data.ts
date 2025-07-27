import { Experience } from '../app/classes/experience.model';
import { ExperienceType } from '../utils/enums/experience-type.enum';

export const experiencesData: Experience[] = [
  {
    id: '1',
    company: 'DAF',
    position: 'Mid-level MEAN Stack Developer',
    startDate: new Date('2022-03-01'),
    endDate: undefined, // Currently working
    description:
      'Developed and maintained full-stack applications using the MEAN stack with expertise in NestJS, PostgreSQL, Docker, and microservices architecture.',
    achievements: [
      'Implemented NestJS to enhance architecture and maintainability',
      'Created RESTful APIs documented with Swagger for developer collaboration',
      'Set up PostgreSQL databases with TypeORM and Sequelize',
      'Optimized application performance with Redis caching',
      'Containerized applications using Docker for consistent environments',
      'Designed responsive UI using Angular Material and Flex Layout',
    ],
    technologies: [
      'MongoDB',
      'Express.js',
      'Angular',
      'Node.js',
      'NestJS',
      'PostgreSQL',
      'Docker',
      'Redis',
      'TypeORM',
      'Sequelize',
      'Angular Material',
      'Swagger',
    ],
    location: 'Remote',
    type: ExperienceType.FULL_TIME,
    companyWebsite: undefined,
  },
  {
    id: '2',
    company: 'Gulf Goal',
    position: 'MEAN Stack Developer',
    startDate: new Date('2020-10-01'),
    endDate: new Date('2021-04-30'),
    description:
      'Developed web applications with Node.js, Express, MongoDB, and Angular, focusing on responsive UI design and RESTful API development.',
    achievements: [
      'Built responsive UIs with Angular and Bootstrap',
      'Designed RESTful APIs for client-server communication',
      'Collaborated effectively with cross-functional teams using Git',
      'Used Postman for comprehensive API testing and documentation',
    ],
    technologies: [
      'Node.js',
      'Express',
      'MongoDB',
      'Angular',
      'Bootstrap',
      'Git',
      'Postman',
    ],
    location: 'Remote',
    type: ExperienceType.FULL_TIME,
    companyWebsite: undefined,
  },
];
