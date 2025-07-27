import { createAction, props } from '@ngrx/store';

export const toggleTheme = createAction('[Theme] Toggle Theme');
export const setTheme = createAction(
  '[Theme] Set Theme',
  props<{ isDarkMode: boolean }>()
);
export const setPrimaryColor = createAction(
  '[Theme] Set Primary Color',
  props<{ color: string }>()
);
export const setAccentColor = createAction(
  '[Theme] Set Accent Color',
  props<{ color: string }>()
);