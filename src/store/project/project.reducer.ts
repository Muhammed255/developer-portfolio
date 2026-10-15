import { createReducer, on } from '@ngrx/store';
import { ProjectState } from '../app.state';
import * as Actions from './project.actions';

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

export const projectsReducer = createReducer(
  initialState,
  on(Actions.loadProjects, (state) => ({ ...state, loading: true, error: null })),
  on(Actions.loadProjectsSuccess, (state, { projects }) => ({ ...state, projects, loading: false })),
  on(Actions.loadProjectsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
