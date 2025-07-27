import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ThemeState } from '../app.state';

export const selectThemeState = createFeatureSelector<ThemeState>('theme');

export const selectCurrentTheme = createSelector(
  selectThemeState,
  (state: ThemeState) => state.isDarkMode
);

export const selectPrimaryColor = createSelector(
  selectThemeState,
  (state: ThemeState) => state.primaryColor
);

export const selectAccentColor = createSelector(
  selectThemeState,
  (state: ThemeState) => state.accentColor
);