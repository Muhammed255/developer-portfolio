import { createAction, props } from '@ngrx/store';
import { Skill } from '../../app/classes/skill.model';

export const loadSkills = createAction('[Skills] Load Skills');
export const loadSkillsSuccess = createAction(
  '[Skills] Load Skills Success',
  props<{ skills: Skill[] }>()
);
export const loadSkillsFailure = createAction(
  '[Skills] Load Skills Failure',
  props<{ error: string }>()
);
