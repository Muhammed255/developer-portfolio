import { createReducer, on } from '@ngrx/store';
import { SkillState } from '../app.state';
import * as Actions from './skills.actions';

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
};

export const skillsReducer = createReducer(
  initialState,
  on(Actions.loadSkills, (state) => ({ ...state, loading: true, error: null })),
  on(Actions.loadSkillsSuccess, (state, { skills }) => ({ ...state, skills, loading: false })),
  on(Actions.loadSkillsFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
