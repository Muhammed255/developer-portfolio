import { createReducer, on } from '@ngrx/store';
import { ThemeState } from '../app.state';
import * as ThemeActions from './theme.actions';

const initialState: ThemeState = {
  isDarkMode: false,
  primaryColor: '#3f51b5',
  accentColor: '#ff4081'
};

export const themeReducer = createReducer(
  initialState,
  on(ThemeActions.toggleTheme, (state) => ({
    ...state,
    isDarkMode: !state.isDarkMode
  })),
  on(ThemeActions.setTheme, (state, { isDarkMode }) => ({
    ...state,
    isDarkMode
  })),
  on(ThemeActions.setPrimaryColor, (state, { color }) => ({
    ...state,
    primaryColor: color
  })),
  on(ThemeActions.setAccentColor, (state, { color }) => ({
    ...state,
    accentColor: color
  }))
);