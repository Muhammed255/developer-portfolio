import { createAction, props } from '@ngrx/store';
import { Experience } from '../../app/classes/experience.model';

export const loadExperiences = createAction('[Experience] Load Experiences');
export const loadExperiencesSuccess = createAction('[Experience] Load Experiences Success', props<{ experiences: Experience[] }>());
export const loadExperiencesFailure = createAction('[Experience] Load Experiences Failure', props<{ error: string }>());
