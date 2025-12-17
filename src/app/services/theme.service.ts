import { inject, Injectable } from '@angular/core';
import { setTheme, toggleTheme } from '../../store/theme/theme.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private store = inject(Store<AppState>);
  private document = inject(DOCUMENT);
  private prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  initTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    let isDarkMode: boolean;
    
    if (savedTheme !== null) {
      isDarkMode = JSON.parse(savedTheme);
    } else {
      // Use system preference as default
      isDarkMode = this.prefersDarkScheme.matches;
    }
    
    this.store.dispatch(setTheme({ isDarkMode }));
    this.applyTheme(isDarkMode);
    
    // Listen for system theme changes
    this.prefersDarkScheme.addEventListener('change', (e) => {
      if (localStorage.getItem('portfolio-theme') === null) {
        // Only auto-switch if user hasn't manually set a preference
        const newTheme = e.matches;
        this.store.dispatch(setTheme({ isDarkMode: newTheme }));
        this.applyTheme(newTheme);
      }
    });
  }

  applyTheme(isDarkMode: boolean) {
    const body = this.document.body;
    const root = this.document.documentElement;
    
    // Add smooth transition class during theme change
    body.classList.add('theme-transitioning');
    
    if (isDarkMode) {
      body.classList.add('portfolio-theme');
      root.classList.add('portfolio-theme');
      this.setDarkThemeVariables(root);
      // Update meta theme-color for mobile browsers
      this.updateThemeColor('#2d3748');
    } else {
      body.classList.remove('portfolio-theme');
      root.classList.remove('portfolio-theme');
      this.setLightThemeVariables(root);
      // Update meta theme-color for mobile browsers
      this.updateThemeColor('#fafbfc');
    }
    
    // Save preference
    localStorage.setItem('portfolio-theme', JSON.stringify(isDarkMode));
    
    // Remove transition class after animation completes
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 400);
  }

  private setLightThemeVariables(root: HTMLElement) {
    // Set CSS custom properties for light theme
    root.style.setProperty('--primary-color', '#3182ce');
    root.style.setProperty('--primary-color-rgb', '49, 130, 206');
    root.style.setProperty('--accent-color', '#38b2ac');
    root.style.setProperty('--text-primary', '#2d3748');
    root.style.setProperty('--text-secondary', '#718096');
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f7fafc');
    root.style.setProperty('--border-color', '#e2e8f0');
    
    // Contact specific variables are already defined in CSS
  }

  private setDarkThemeVariables(root: HTMLElement) {
    // Set CSS custom properties for dark theme
    root.style.setProperty('--primary-color', '#63b3ed');
    root.style.setProperty('--primary-color-rgb', '99, 179, 237');
    root.style.setProperty('--accent-color', '#4fd1c7');
    root.style.setProperty('--text-primary', '#f7fafc');
    root.style.setProperty('--text-secondary', '#a0aec0');
    root.style.setProperty('--bg-primary', '#1a202c');
    root.style.setProperty('--bg-secondary', '#2d3748');
    root.style.setProperty('--border-color', '#4a5568');
    
    // Contact specific variables are already defined in CSS
  }

  private updateThemeColor(color: string) {
    let themeColorMeta = this.document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = this.document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      this.document.getElementsByTagName('head')[0].appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute('content', color);
  }

  toggleTheme() {
    this.store.dispatch(toggleTheme());
    
    // Get current theme and apply the opposite
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? false : true;
    this.applyTheme(newTheme);
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.document.body.classList.contains('portfolio-theme') ? 'dark' : 'light';
  }

  // Method to reset to system preference
  resetToSystemTheme() {
    localStorage.removeItem('portfolio-theme');
    const isDarkMode = this.prefersDarkScheme.matches;
    this.store.dispatch(setTheme({ isDarkMode }));
    this.applyTheme(isDarkMode);
  }

  // Helper method to check if dark mode is enabled
  isDarkMode(): boolean {
    return this.getCurrentTheme() === 'dark';
  }

  // Method to get theme preference including system preference
  getThemePreference(): 'light' | 'dark' | 'system' {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === null) {
      return 'system';
    }
    return JSON.parse(savedTheme) ? 'dark' : 'light';
  }

  // Method to set a specific theme
  setSpecificTheme(theme: 'light' | 'dark' | 'system') {
    switch (theme) {
      case 'light':
        this.store.dispatch(setTheme({ isDarkMode: false }));
        this.applyTheme(false);
        break;
      case 'dark':
        this.store.dispatch(setTheme({ isDarkMode: true }));
        this.applyTheme(true);
        break;
      case 'system':
        this.resetToSystemTheme();
        break;
    }
  }
}