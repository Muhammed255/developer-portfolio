import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { SeoTitleStrategy } from './seo/seo-title.strategy';
import { themeReducer } from '../store/theme/theme.reducer';
import { ThemeEffects } from '../store/theme/theme.effects';
import { ProjectsEffects } from '../store/project/project.effects';
import { ExperiencesEffects } from '../store/experience/experience.effects';
import { SkillsEffects } from '../store/skills/skills.effects';
import { projectsReducer } from '../store/project/project.reducer';
import { experienceReducer } from '../store/experience/experience.reducers';
import { skillsReducer } from '../store/skills/skills.reducers';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
    provideStore({
      theme: themeReducer,
      projects: projectsReducer,
      experience: experienceReducer,
      skills: skillsReducer,
    }),
    provideEffects(
      ThemeEffects,
      ProjectsEffects,
      ExperiencesEffects,
      SkillsEffects
    ),
    provideClientHydration(withEventReplay()),
  ],
};
