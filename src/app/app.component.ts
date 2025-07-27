import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { selectCurrentTheme } from '../store/theme/theme.selectors';
import { toggleTheme } from '../store/theme/theme.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatSlideToggleModule,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  private store = inject(Store<AppState>);
  private themeService = inject(ThemeService);
  
  portfolioName = 'Mohamed Abdelazim';
  isDarkTheme$: Observable<boolean>;

  constructor() {
    this.isDarkTheme$ = this.store.select(selectCurrentTheme);
  }

  ngOnInit() {
    // Initialize theme
    this.themeService.initTheme();
  }

  onThemeToggle() {
    this.store.dispatch(toggleTheme());
  }

  changeLanguage(lang: string) {
    // Implement language change logic
    console.log('Changing language to:', lang);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth', left:0 });
  }
  
}
