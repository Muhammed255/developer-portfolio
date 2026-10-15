import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectState } from '../app.state';

const selectProjectsState = createFeatureSelector<ProjectState>('projects');

export const selectAllProjects = createSelector(selectProjectsState, (state) => state.projects);
export const selectProjectsLoading = createSelector(selectProjectsState, (state) => state.loading);
