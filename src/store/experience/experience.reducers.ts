import { createReducer, on } from '@ngrx/store';
import { ExperienceState } from '../app.state';
import * as ExperienceActions from './experience.actions';

const initialState: ExperienceState = {
  experiences: [],
  loading: false,
  error: null,
  filters: {},
};

export const experienceReducer = createReducer(
  initialState,

  on(ExperienceActions.loadExperiences, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ExperienceActions.loadExperiencesSuccess, (state, { experiences }) => {
    console.log(
  experiences,
  [...experiences].sort((a, b) => {
    console.log(new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return 0;
  })
);

    return {
      ...state,
      experiences: [...experiences].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ),
      loading: false,
      error: null,
    };
  }),

  on(ExperienceActions.loadExperiencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ExperienceActions.setExperienceFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),

  on(ExperienceActions.clearExperienceFilters, (state) => ({
    ...state,
    filters: {},
  }))
);
