import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { themeReducer } from '../store/theme/theme.reducer';
import { provideEffects } from '@ngrx/effects';
import { ProjectsEffects } from '../store/project/project.effects';
import { ExperienceEffects } from '../store/experience/experience.effects';
import { SkillsEffects } from '../store/skills/skills.effects';
import { BlogEffects } from '../store/blog/blog.effects';
import { projectsReducer } from '../store/project/project.reducer';
import { experienceReducer } from '../store/experience/experience.reducers';
import { skillsReducer } from '../store/skills/skills.reducers';
import { blogReducer } from '../store/blog/blog.reducers';
import { uiReducer } from '../store/ui/ui.reducers';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideStore({
      theme: themeReducer,
      projects: projectsReducer,
      experience: experienceReducer,
      skills: skillsReducer,
      blog: blogReducer,
      ui: uiReducer
    }),
    provideEffects(
      ProjectsEffects,
      ExperienceEffects,
      SkillsEffects,
      BlogEffects
    ),
  ],
};
