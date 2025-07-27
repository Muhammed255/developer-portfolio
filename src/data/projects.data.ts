import { Project } from '../app/classes/project.model';
import { ProjectCategory } from '../utils/enums/project-category.enum';
import { ProjectStatus } from '../utils/enums/project-status.enum';

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'Graduation Project',
    description: 'Full-stack web application developed using the MEAN stack',
    longDescription: 'Led the technical implementation of a comprehensive web application using MongoDB, Express.js, Angular, and Node.js. Architected the database design and built RESTful APIs with complete front-end integration.',
    technologies: ['MongoDB', 'Express.js', 'Angular', 'Node.js'],
    images: ['GP_Logo.png'],
    githubUrl: 'https://github.com/Muhammed255/graduation-project',
    featured: true,
    category: ProjectCategory.WEB_APP,
    status: ProjectStatus.COMPLETED,
    startDate: new Date('2019-06-01'),
    endDate: new Date('2020-06-30'),
    teamSize: 1,
    myRole: 'Full-Stack Developer & Technical Lead',
    challenges: [
      'Database architecture design',
      'API integration complexity',
      'Frontend-backend communication'
    ],
    solutions: [
      'Implemented MongoDB for flexible data storage',
      'Built comprehensive RESTful APIs',
      'Created responsive Angular frontend'
    ],
    tags: ['graduation', 'mean-stack', 'full-stack'],
    likes: 15,
    views: 450
  },
  {
    id: '2',
    title: 'Developers Articles',
    description: 'Angular-based platform for developers to post and interact with technical articles',
    longDescription: 'A comprehensive platform allowing developers to share articles based on specific categories and topics, with features for reactions, comments, and replies.',
    technologies: ['Angular', 'Angular Material', 'Flex Layout', 'Node.js', 'Express', 'MongoDB'],
    images: ['dev-articles-logo.jpg'],
    githubUrl: 'https://github.com/Muhammed255/developers-articles',
    featured: true,
    demoUrl: 'https://dev-article.netlify.app',
    category: ProjectCategory.WEB_APP,
    status: ProjectStatus.COMPLETED,
    startDate: new Date('2021-01-01'),
    endDate: new Date('2021-04-30'),
    teamSize: 1,
    myRole: 'Full-Stack Developer',
    challenges: [
      'Category-based content organization',
      'User interaction system',
      'Comment threading system'
    ],
    solutions: [
      'Implemented categorized article system',
      'Built reaction and comment functionality',
      'Created responsive UI with Angular Material'
    ],
    tags: ['articles', 'community', 'angular', 'mongodb'],
    likes: 28,
    views: 720
  },
  {
    id: '3',
    title: 'Let us talk',
    description: 'Real-time chat application built with Angular and Node.js',
    longDescription: 'A simple yet effective chat application that enables real-time communication between users with a clean, responsive interface.',
    technologies: ['Angular', 'Angular Material', 'Flex Layout', 'Node.js', 'Express', 'MongoDB'],
    images: ['default-logo.png'],
    githubUrl: 'https://github.com/Muhammed255/let-us-talk',
    featured: false,
    category: ProjectCategory.WEB_APP,
    status: ProjectStatus.COMPLETED,
    startDate: new Date('2021-05-01'),
    endDate: new Date('2021-07-30'),
    teamSize: 1,
    myRole: 'Full-Stack Developer',
    challenges: [
      'Real-time message delivery',
      'User presence management',
      'Message persistence'
    ],
    solutions: [
      'Implemented WebSocket communication',
      'Built user status tracking',
      'Created MongoDB message storage'
    ],
    tags: ['chat', 'real-time', 'websocket'],
    likes: 22,
    views: 580
  },
  {
    id: '4',
    title: 'Post It Here',
    description: 'Social media platform with posts, reactions, and user groups',
    longDescription: 'A comprehensive social media application featuring posts, reactions, user groups with different roles (admins, moderators, users), and follow/unfollow functionality.',
    technologies: ['Angular', 'Angular Material', 'Flex Layout', 'Node.js', 'Express', 'MongoDB'],
    images: ['PostItHere-logo.svg'],
    githubUrl: 'https://github.com/Muhammed255/post-it-here',
    featured: true,
    category: ProjectCategory.WEB_APP,
    status: ProjectStatus.COMPLETED,
    startDate: new Date('2021-08-01'),
    endDate: new Date('2021-11-30'),
    teamSize: 1,
    myRole: 'Full-Stack Developer',
    challenges: [
      'Complex user role management',
      'Social interactions system',
      'Group administration features'
    ],
    solutions: [
      'Implemented role-based access control',
      'Built comprehensive reaction system',
      'Created group management functionality'
    ],
    tags: ['social-media', 'groups', 'roles', 'angular'],
    likes: 35,
    views: 920
  },
  {
    id: '5',
    title: 'Collab Flow',
    description: 'Project management application with task handling and notifications',
    longDescription: 'A comprehensive project management tool for handling projects with tasks, deadline notifications, risky project criteria definition, resource allocation, and budget overview.',
    technologies: ['Angular', 'Angular Material', 'Flex Layout', 'Node.js', 'NestJS', 'TypeORM'],
    images: ['default-logo.png'],
    githubUrl: 'https://github.com/Muhammed255/collab-flow',
    featured: true,
    category: ProjectCategory.WEB_APP,
    status: ProjectStatus.COMPLETED,
    startDate: new Date('2022-01-01'),
    endDate: new Date('2022-05-30'),
    teamSize: 1,
    myRole: 'Full-Stack Developer',
    challenges: [
      'Complex project hierarchy management',
      'Resource allocation algorithms',
      'Real-time notification system'
    ],
    solutions: [
      'Implemented NestJS for scalable architecture',
      'Built comprehensive task management system',
      'Created automated notification system'
    ],
    metrics: {
      performanceImprovement: 'Improved project tracking efficiency by 60%',
      codeQuality: 'Clean architecture with NestJS',
      testCoverage: '85%'
    },
    tags: ['project-management', 'nestjs', 'notifications', 'budget'],
    likes: 42,
    views: 1180
  },
  {
    id: '6',
    title: 'Developer Portfolio',
    description: 'Personal portfolio website with integrated blog functionality',
    longDescription: 'A professional portfolio website showcasing projects and skills, with an integrated blog for sharing helpful content with the developer community.',
    technologies: ['Angular', 'Angular Material', 'Flex Layout', 'Node.js', 'NestJS', 'TypeORM'],
    images: ['default-logo.png'],
    demoUrl: 'https://3bdelazim-portfolio.netlify.app',
    githubUrl: 'https://github.com/Muhammed255/developer-portfolio',
    featured: true,
    category: ProjectCategory.WEB_APP,
    status: ProjectStatus.COMPLETED,
    startDate: new Date('2022-06-01'),
    endDate: new Date('2022-09-30'),
    teamSize: 1,
    myRole: 'Full-Stack Developer',
    challenges: [
      'SEO optimization',
      'Blog content management',
      'Responsive design across devices'
    ],
    solutions: [
      'Implemented server-side rendering',
      'Built comprehensive CMS for blog',
      'Created fully responsive design'
    ],
    tags: ['portfolio', 'blog', 'personal', 'seo'],
    likes: 38,
    views: 850
  },
  {
    id: '7',
    title: 'Quonvo',
    description: 'Anonymous Q&A platform similar to Ask.fm',
    longDescription: 'A social Q&A platform that allows users to send anonymous questions and receive answers, fostering open communication and knowledge sharing.',
    technologies: ['Angular', 'Angular Material', 'Flex Layout', 'Node.js', 'NestJS', 'TypeORM'],
    images: ['quonvo-logo.png'],
    githubUrl: 'https://github.com/Muhammed255/quonvo',
    featured: false,
    category: ProjectCategory.WEB_APP,
    status: ProjectStatus.COMPLETED,
    startDate: new Date('2022-10-01'),
    endDate: new Date('2023-01-30'),
    teamSize: 1,
    myRole: 'Full-Stack Developer',
    challenges: [
      'Anonymous user management',
      'Question-answer matching system',
      'User privacy protection'
    ],
    solutions: [
      'Implemented secure anonymous system',
      'Built efficient Q&A matching',
      'Created privacy-focused architecture'
    ],
    tags: ['qna', 'anonymous', 'social', 'privacy'],
    likes: 19,
    views: 470
  }
];