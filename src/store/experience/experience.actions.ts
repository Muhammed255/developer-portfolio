import { createAction, props } from '@ngrx/store';
import { Experience } from '../../app/classes/experience.model';
import { ExperienceFilter } from '../app.state';

export const loadExperiences = createAction('[Experience] Load Experiences');
export const loadExperiencesSuccess = createAction(
  '[Experience] Load Experiences Success',
  props<{ experiences: Experience[] }>()
);
export const loadExperiencesFailure = createAction(
  '[Experience] Load Experiences Failure',
  props<{ error: string }>()
);


export const setExperienceFilters = createAction(
  '[Experience] Set Filters',
  props<{ filters: ExperienceFilter }>()
);
export const clearExperienceFilters = createAction('[Experience] Clear Filters');

export const selectExperience = createAction(
  '[Experience] Select Experience',
  props<{ id: string }>()
);