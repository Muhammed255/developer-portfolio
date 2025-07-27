import { createAction, props } from '@ngrx/store';

export const toggleSidenav = createAction('[UI] Toggle Sidenav');
export const openSidenav = createAction('[UI] Open Sidenav');
export const closeSidenav = createAction('[UI] Close Sidenav');

export const setLoading = createAction(
  '[UI] Set Loading',
  props<{ loading: boolean }>()
);

export const setLanguage = createAction(
  '[UI] Set Language',
  props<{ language: string }>()
);
