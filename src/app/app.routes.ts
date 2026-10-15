import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Software Engineer',
    data: { description: 'Mohamed Abdelazim — software engineer. Projects, skills, experience and articles.' },
    loadComponent: () =>
      import('./pages/home/home.component').then((a) => a.HomeComponent),
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'projects',
    title: 'Projects',
    data: { description: 'Selected software projects by Mohamed Abdelazim.' },
    loadComponent: () =>
      import('./pages/projects/projects.component').then(
        (a) => a.ProjectsComponent
      ),
  },
  {
    path: 'skills',
    title: 'Skills',
    data: { description: 'Technical skills and tools Mohamed Abdelazim works with.' },
    loadComponent: () =>
      import('./pages/skills/skills.component').then((a) => a.SkillsComponent),
  },
  {
    path: 'experiences',
    title: 'Experience',
    data: { description: 'Professional experience of Mohamed Abdelazim.' },
    loadComponent: () =>
      import('./pages/experiences/experiences.component').then(
        (a) => a.ExperiencesComponent
      ),
  },
  {
    path: 'about',
    title: 'About',
    data: { description: 'About Mohamed Abdelazim.' },
    loadComponent: () =>
      import('./pages/about/about.component').then((a) => a.AboutComponent),
  },
  {
    path: 'contact',
    title: 'Contact',
    data: { description: 'Get in touch with Mohamed Abdelazim.' },
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (a) => a.ContactComponent
      ),
  },
  {
    path: '**',
    title: 'Page not found',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (a) => a.NotFoundComponent
      ),
  },
];
