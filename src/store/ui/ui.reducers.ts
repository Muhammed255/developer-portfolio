import { createReducer, on } from '@ngrx/store';
import { UIState } from '../app.state';
import * as UIActions from './ui.actions';

const initialState: UIState = {
  sidenavOpen: false,
  loading: false,
  language: 'en',
};

export const uiReducer = createReducer(
  initialState,

  on(UIActions.toggleSidenav, (state) => ({
    ...state,
    sidenavOpen: !state.sidenavOpen,
  })),

  on(UIActions.openSidenav, (state) => ({
    ...state,
    sidenavOpen: true,
  })),

  on(UIActions.closeSidenav, (state) => ({
    ...state,
    sidenavOpen: false,
  })),

  on(UIActions.setLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),

  on(UIActions.setLanguage, (state, { language }) => ({
    ...state,
    language,
  }))
);
