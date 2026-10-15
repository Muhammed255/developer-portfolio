import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from '../app.state';

const selectThemeState = createFeatureSelector<ThemeState>('theme');

export const selectCurrentTheme = createSelector(selectThemeState, (state) => state.isDarkMode);
