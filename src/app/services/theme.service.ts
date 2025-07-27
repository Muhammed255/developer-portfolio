import { inject, Injectable } from '@angular/core';
import { setTheme } from '../../store/theme/theme.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private store = inject(Store<AppState>);

  initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const isDarkMode = savedTheme ? JSON.parse(savedTheme) : false;
    this.store.dispatch(setTheme({ isDarkMode }));
    this.applyTheme(isDarkMode);
  }

  applyTheme(isDarkMode: boolean) {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
    localStorage.setItem('portfolio-theme', JSON.stringify(isDarkMode));
  }

  private isDarkMode = false;

  constructor() {}

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
  }

  getTheme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
}
