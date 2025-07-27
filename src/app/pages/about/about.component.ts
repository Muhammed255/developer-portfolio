import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { MatListModule } from '@angular/material/list';

interface Experience {
  title: string;
  company: string;
  location: string;
  duration: string;
  responsibilities: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  features: string[];
}

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'database' | 'tools';
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRippleModule,
    FlexLayoutModule,
    MatListModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate(
          '0.5s ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(30px)' }),
            stagger(
              100,
              animate(
                '0.4s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class AboutComponent {
   personalInfo = signal({
    name: 'Mohamed Ahmed Abdelazim',
    title: 'MEAN Stack Developer',
    email: 'mhmd.ahmd.0597@email.com',
    linkedin: 'mhmd.ahmd.0597@email.com',
    github: 'mhmd.ahmd.0597@email.com',
    phone: '+201154089964',
    summary: 'A dedicated MEAN Stack Developer with 3+ years of experience building full-stack web applications. Proficient in MongoDB, Express.js, Angular, Node.js, with expertise in NestJS, PostgreSQL, Docker, and microservices architecture.'
  });

  experiences = signal<Experience[]>([
    {
      title: 'Mid-level MEAN Stack Developer',
      company: 'DAF',
      location: 'Remote',
      duration: 'March 2022 - Present',
      responsibilities: [
        'Developed and maintained full-stack applications using the MEAN stack',
        'Implemented NestJS to enhance architecture and maintainability',
        'Created RESTful APIs documented with Swagger for developer collaboration',
        'Set up PostgreSQL databases with TypeORM and Sequelize',
        'Optimized application performance with Redis caching',
        'Containerized applications using Docker for consistent environments',
        'Collaborated with cross-functional teams using Git version control',
        'Designed responsive UI using Angular Material and Flex Layout'
      ]
    },
    {
      title: 'MEAN Stack Developer',
      company: 'Gulf Goal',
      location: 'Remote',
      duration: 'October 2020 - April 2021',
      responsibilities: [
        'Developed web applications with Node.js, Express, MongoDB, and Angular',
        'Built responsive UIs with Angular and Bootstrap',
        'Designed RESTful APIs for client-server communication',
        'Worked collaboratively with the team using Git',
        'Used Postman for API testing and documentation'
      ]
    }
  ]);

  skills = signal<Skill[]>([
    // Frontend Skills
    { name: 'Angular', level: 95, category: 'frontend' },
    { name: 'Angular Material', level: 90, category: 'frontend' },
    { name: 'HTML5', level: 95, category: 'frontend' },
    { name: 'CSS3', level: 90, category: 'frontend' },
    { name: 'JavaScript', level: 90, category: 'frontend' },
    { name: 'Bootstrap', level: 85, category: 'frontend' },
    { name: 'Flex Layout', level: 88, category: 'frontend' },
    
    // Backend Skills
    { name: 'Node.js', level: 92, category: 'backend' },
    { name: 'Express.js', level: 90, category: 'backend' },
    { name: 'NestJS', level: 88, category: 'backend' },
    { name: 'RESTful APIs', level: 93, category: 'backend' },
    
    // Database Skills
    { name: 'MongoDB', level: 90, category: 'database' },
    { name: 'PostgreSQL', level: 85, category: 'database' },
    { name: 'Redis', level: 75, category: 'database' },
    { name: 'TypeORM', level: 80, category: 'database' },
    { name: 'Sequelize', level: 78, category: 'database' },
    
    // Tools
    { name: 'Docker', level: 80, category: 'tools' },
    { name: 'Git', level: 90, category: 'tools' },
    { name: 'Postman', level: 85, category: 'tools' },
    { name: 'Swagger', level: 82, category: 'tools' },
    { name: 'Kubernetes', level: 60, category: 'tools' }
  ]);

  // Computed signal for organizing skills by category
  skillCategories = computed(() => {
    const categories = [
      { name: 'Frontend Development', key: 'frontend' as const },
      { name: 'Backend Development', key: 'backend' as const },
      { name: 'Database Management', key: 'database' as const },
      { name: 'Tools & DevOps', key: 'tools' as const }
    ];

    return categories.map(category => ({
      name: category.name,
      skills: this.skills().filter(skill => skill.category === category.key)
    }));
  });

  achievements = signal<any[]>([
    {
      icon: 'code',
      title: 'Full-Stack Expertise',
      description: '3+ years building end-to-end web applications',
      color: '#2196F3'
    },
    {
      icon: 'architecture',
      title: 'Modern Architecture',
      description: 'Microservices, Docker, and scalable solutions',
      color: '#4CAF50'
    },
    {
      icon: 'speed',
      title: 'Performance Optimization',
      description: 'Redis caching and database optimization',
      color: '#FF9800'
    },
    {
      icon: 'api',
      title: 'API Development',
      description: 'RESTful APIs with comprehensive documentation',
      color: '#E91E63'
    }
  ]);

  education = signal<any[]>([
    {
      degree: 'Bachelor\'s Degree in Computer Science',
      institution: 'Helwan University',
      year: '2022',
      icon: 'school'
    }
  ]);

  projects = signal<Project[]>([
    {
      name: 'Collab Flow',
      description: 'A comprehensive project management application designed to handle projects with task management, deadline notifications, and resource allocation.',
      technologies: ['Angular', 'NestJS', 'TypeORM', 'Angular Material'],
      features: [
        'Project and task management',
        'Deadline notifications',
        'Risk assessment criteria',
        'Resource allocation',
        'Budget overview'
      ]
    },
    {
      name: 'Developers Articles',
      description: 'A platform for developers to share knowledge through articles, with category-based organization and interactive community features.',
      technologies: ['Angular', 'Node.js', 'Express', 'MongoDB'],
      features: [
        'Article posting by category and topic',
        'User reactions and engagement',
        'Comment and reply system',
        'Developer community interaction'
      ]
    },
    {
      name: 'Post It Here',
      description: 'A social networking application with comprehensive user management and content sharing capabilities.',
      technologies: ['Angular', 'Node.js', 'Express', 'MongoDB'],
      features: [
        'Social media posting',
        'User reactions and interactions',
        'Group management with roles',
        'Follow/unfollow functionality'
      ]
    },
    {
      name: 'Quonvo',
      description: 'An Ask.fm clone that enables anonymous question-and-answer interactions between users.',
      technologies: ['Angular', 'NestJS', 'TypeORM', 'Angular Material'],
      features: [
        'Anonymous question submission',
        'User answer system',
        'Privacy-focused design',
        'User profile management'
      ]
    },
    {
      name: 'Let us talk',
      description: 'A real-time chat application that facilitates seamless communication between users.',
      technologies: ['Angular', 'Node.js', 'Express', 'MongoDB'],
      features: [
        'Real-time messaging',
        'User-to-user communication',
        'Responsive chat interface',
        'Message history'
      ]
    },
    {
      name: 'Developer Portfolio',
      description: 'A personal portfolio website showcasing projects and including a blog for sharing development insights.',
      technologies: ['Angular', 'NestJS', 'TypeORM', 'Angular Material'],
      features: [
        'Project showcase',
        'Integrated blog system',
        'Responsive design',
        'Content management'
      ]
    }
  ]);

  // Methods
  openContact(type: string): void {
    const info = this.personalInfo();
    switch (type) {
      case 'email':
        window.open(`mailto:${info.email}`);
        break;
      case 'linkedin':
        window.open(info.linkedin, '_blank');
        break;
      case 'github':
        window.open(info.github, '_blank');
        break;
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  }
}
