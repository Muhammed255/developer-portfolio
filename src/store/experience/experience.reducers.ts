import { createReducer, on } from '@ngrx/store';
import { ExperienceState } from '../app.state';
import * as Actions from './experience.actions';

const initialState: ExperienceState = {
  experiences: [],
  loading: false,
  error: null,
};

export const experienceReducer = createReducer(
  initialState,
  on(Actions.loadExperiences, (state) => ({ ...state, loading: true, error: null })),
  on(Actions.loadExperiencesSuccess, (state, { experiences }) => ({ ...state, experiences, loading: false })),
  on(Actions.loadExperiencesFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
