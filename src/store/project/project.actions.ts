import { createAction, props } from '@ngrx/store';
import { ProjectFilters } from '../app.state';
import { Project } from '../../app/classes/project.model';

export const loadProjects = createAction('[Projects] Load Projects');
export const loadProjectsSuccess = createAction(
  '[Projects] Load Projects Success',
  props<{ projects: Project[] }>()
);
export const loadProjectsFailure = createAction(
  '[Projects] Load Projects Failure',
  props<{ error: string }>()
);

// Load Single Project
export const loadProject = createAction(
  '[Projects] Load Project',
  props<{ id: string }>()
);
export const loadProjectSuccess = createAction(
  '[Projects] Load Project Success',
  props<{ project: Project }>()
);
export const loadProjectFailure = createAction(
  '[Projects] Load Project Failure',
  props<{ error: string }>()
);

// Filter Actions
export const setProjectFilters = createAction(
  '[Projects] Set Filters',
  props<{ filters: ProjectFilters }>()
);
export const clearProjectFilters = createAction('[Projects] Clear Filters');

// Engagement Actions
export const likeProject = createAction(
  '[Projects] Like Project',
  props<{ projectId: string }>()
);
export const viewProject = createAction(
  '[Projects] View Project',
  props<{ projectId: string }>()
);
