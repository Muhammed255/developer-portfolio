import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((a) => a.HomeComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.component').then(
        (a) => a.ProjectsComponent
      ),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./pages/skills/skills.component').then((a) => a.SkillsComponent),
  },
  {
    path: 'experiences',
    loadComponent: () =>
      import('./pages/experiences/experiences.component').then(
        (a) => a.ExperiencesComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then((a) => a.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (a) => a.ContactComponent
      ),
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog.component').then((a) => a.BlogComponent),
    loadChildren: () => [
      {
        path: ':slug',
        loadComponent: () =>
          import('./pages/blog/blog-details/blog-details.component').then(
            (a) => a.BlogDetailsComponent
          ),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/dashboard/dashboard.component').then(
        (a) => a.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  // { path: 'home', component: HomeComponent },
  // { path: 'projects', component: ProjectsComponent },
  // { path: 'skills', component: SkillsComponent },
  // { path: 'experiences', component: ExperiencesComponent },
  // { path: 'blog', component: BlogComponent },
  // { path: 'about', component: BlogComponent },
  // { path: 'blog/:slug', component: BlogDetailsComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found/not-found.component').then(
        (a) => a.NotFoundComponent
      ),
  },
];
