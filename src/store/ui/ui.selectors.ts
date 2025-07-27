import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UIState } from '../app.state';

export const selectUIState = createFeatureSelector<UIState>('ui');

export const selectSidenavOpen = createSelector(
  selectUIState,
  (state: UIState) => state.sidenavOpen
);

export const selectLoading = createSelector(
  selectUIState,
  (state: UIState) => state.loading
);

export const selectLanguage = createSelector(
  selectUIState,
  (state: UIState) => state.language
);
