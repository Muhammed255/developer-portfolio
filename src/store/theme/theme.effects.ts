import { inject, Injectable, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs';
import { AppState } from '../app.state';
import * as ThemeActions from './theme.actions';
import { selectCurrentTheme } from './theme.selectors';

const STORAGE_KEY = 'portfolio-theme';

/**
 * Single source of truth for the theme: the store holds `isDarkMode`, and
 * this effect mirrors it onto <body class="dark-theme"> and localStorage.
 */
@Injectable()
export class ThemeEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<AppState>);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Restore the saved preference, falling back to the OS setting. */
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => ThemeActions.setTheme({ isDarkMode: this.readPreference() }))
    )
  );

  apply$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeActions.toggleTheme, ThemeActions.setTheme),
        withLatestFrom(this.store.select(selectCurrentTheme)),
        tap(([action, isDarkMode]) => {
          this.document.body.classList.toggle('dark-theme', isDarkMode);
          // Only persist explicit user choices, not the restored default.
          if (this.isBrowser && action.type === ThemeActions.toggleTheme.type) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(isDarkMode));
          }
        })
      ),
    { dispatch: false }
  );

  private readPreference(): boolean {
    if (!this.isBrowser) return false;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'true' || saved === 'false') return saved === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
