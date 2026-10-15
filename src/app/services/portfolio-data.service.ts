import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Experience } from '../classes/experience.model';
import { Project } from '../classes/project.model';
import { Skill } from '../classes/skill.model';
import { projectsData } from '../../data/projects.data';
import { skillsData } from '../../data/skills.data';
import { experiencesData } from '../../data/experiences.data';

/**
 * Serves the static portfolio content in src/data as Observables, so the
 * store effects would not change if the content moved to an API.
 * Always returns copies: callers must never mutate the shared data arrays.
 */
@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  getProjects(): Observable<Project[]> {
    return of(projectsData.map((p) => ({ ...p })));
  }

  getSkills(): Observable<Skill[]> {
    return of(skillsData.map((s) => ({ ...s })));
  }

  getExperiences(): Observable<Experience[]> {
    return of(
      experiencesData
        .map((e) => ({ ...e }))
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    );
  }

}
