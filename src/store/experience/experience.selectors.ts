import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExperienceState } from '../app.state';

const selectExperienceState = createFeatureSelector<ExperienceState>('experience');

/** Newest first. */
export const selectAllExperiences = createSelector(selectExperienceState, (state) =>
  [...state.experiences].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
);
