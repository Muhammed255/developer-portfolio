import { createReducer, on } from '@ngrx/store';
import { ThemeState } from '../app.state';
import * as ThemeActions from './theme.actions';

const initialState: ThemeState = {
  isDarkMode: false,
};

export const themeReducer = createReducer(
  initialState,
  on(ThemeActions.toggleTheme, (state) => ({ ...state, isDarkMode: !state.isDarkMode })),
  on(ThemeActions.setTheme, (state, { isDarkMode }) => ({ ...state, isDarkMode }))
);
