import { createReducer, on } from '@ngrx/store';
import { SkillState } from '../app.state';
import * as SkillActions from './skills.actions';

const initialState: SkillState = {
  skills: [],
  loading: false,
  error: null,
};

export const skillsReducer = createReducer(
  initialState,

  on(SkillActions.loadSkills, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SkillActions.loadSkillsSuccess, (state, { skills }) => ({
    ...state,
    skills,
    loading: false,
    error: null,
  })),

  on(SkillActions.loadSkillsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
