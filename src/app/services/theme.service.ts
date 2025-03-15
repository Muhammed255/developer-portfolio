import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = false;

  constructor() { }

  
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
  }
  
  getTheme() {
    return this.isDarkMode ? 'dark' : 'light';
  }
}
