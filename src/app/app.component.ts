import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
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
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatSidenav;
  
  private store = inject(Store<AppState>);
  private themeService = inject(ThemeService);
  private destroy$ = new Subject<void>();
  private scrollSubject = new Subject<number>();
  
  portfolioName = 'Mohamed Abdelazim';
  isDarkTheme$: Observable<boolean>;
  showScrollButton = false;
  isThemeTransitioning = false;
  currentYear = new Date().getFullYear();

  // Navigation items for consistency
  navigationItems = [
    { route: '/home', icon: 'home', label: 'Home' },
    { route: '/about', icon: 'person', label: 'About' },
    { route: '/projects', icon: 'work', label: 'Projects' },
    { route: '/skills', icon: 'code', label: 'Skills' },
    { route: '/experiences', icon: 'timeline', label: 'Experience' },
    { route: '/blog', icon: 'article', label: 'Blog' },
    { route: '/contact', icon: 'contact_mail', label: 'Contact' }
  ];

  socialLinks = [
    { 
      href: 'https://github.com/Muhammed255', 
      icon: 'code', 
      label: 'GitHub',
      ariaLabel: 'Visit GitHub profile'
    },
    { 
      href: 'https://linkedin.com/in/mhmdahmd97', 
      icon: 'work', 
      label: 'LinkedIn',
      ariaLabel: 'Visit LinkedIn profile'
    }
  ];

  languages = [
    { code: 'en', flag: 'flag', label: 'English' },
    { code: 'es', flag: 'flag', label: 'Español' },
    { code: 'fr', flag: 'flag', label: 'Français' }
  ];

  constructor() {
    this.isDarkTheme$ = this.store.select(selectCurrentTheme);
    this.setupScrollHandler();
  }

  ngOnInit() {
    // Initialize theme with enhanced features
    this.themeService.initTheme();
    
    // Handle theme changes with transition effect
    this.isDarkTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.handleThemeTransition();
      });
    
    // Setup reduced motion handling
    this.handleReducedMotion();
    
    // Setup keyboard navigation
    this.setupKeyboardNavigation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupScrollHandler() {
    this.scrollSubject
      .pipe(
        debounceTime(10),
        takeUntil(this.destroy$)
      )
      .subscribe(scrollY => {
        this.showScrollButton = scrollY > 300;
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.scrollSubject.next(window.pageYOffset);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    // Handle Escape key to close sidenav
    if (event.key === 'Escape' && this.drawer?.opened) {
      this.drawer.close();
      event.preventDefault();
    }
    
    // Handle theme toggle with keyboard shortcut (Ctrl/Cmd + Shift + T)
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
      this.onThemeToggle();
      event.preventDefault();
    }
  }

  private handleThemeTransition() {
    this.isThemeTransitioning = true;
    
    // Remove transition class after animation completes
    setTimeout(() => {
      this.isThemeTransitioning = false;
    }, 400);
  }

  onThemeToggle() {
    // Provide haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    this.store.dispatch(toggleTheme());
    this.announceThemeChange();
  }

  private announceThemeChange() {
    const currentTheme = this.themeService.getCurrentTheme();
    const message = `Switched to ${currentTheme} theme`;
    
    // Create accessible announcement
    this.createAriaLiveAnnouncement(message);
  }

  private createAriaLiveAnnouncement(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }

  changeLanguage(lang: string) {
    console.log('Changing language to:', lang);
    
    // Announce language change
    this.createAriaLiveAnnouncement(`Language changed to ${this.getLanguageLabel(lang)}`);
    
    // Here you would implement actual language switching
    // For example, using Angular i18n or a translation service
    
    // Update document lang attribute
    document.documentElement.lang = lang;
  }

  private getLanguageLabel(code: string): string {
    const language = this.languages.find(lang => lang.code === code);
    return language ? language.label : code;
  }

  scrollToTop() {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      left: 0,
      behavior: this.prefersReducedMotion() ? 'auto' : 'smooth'
    };
    
    window.scrollTo(scrollOptions);
    
    // Announce action for screen readers
    this.createAriaLiveAnnouncement('Scrolled to top of page');
  }

  toggleSidenav() {
    this.drawer.toggle();
    
    // Announce sidenav state
    const state = this.drawer.opened ? 'opened' : 'closed';
    this.createAriaLiveAnnouncement(`Navigation menu ${state}`);
  }

  closeSidenavOnNavigation() {
    if (this.drawer.opened) {
      this.drawer.close();
    }
  }

  private handleReducedMotion() {
    if (this.prefersReducedMotion()) {
      document.body.classList.add('reduce-motion');
    }
    
    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
    });
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private setupKeyboardNavigation() {
    // Setup focus management for better keyboard navigation
    document.addEventListener('keydown', (event) => {
      // Skip link functionality (could be added to template)
      if (event.key === 'Tab' && event.shiftKey && document.activeElement === document.body) {
        // Focus first navigation item
        const firstNavItem = document.querySelector('.desktop-nav .mat-button') as HTMLElement;
        if (firstNavItem) {
          firstNavItem.focus();
          event.preventDefault();
        }
      }
    });
  }

  // Helper method for template to check if route is active
  isRouteActive(route: string): boolean {
    // This would typically use Angular Router
    return window.location.pathname === route;
  }

  // Track by function for navigation items (for performance)
  trackByRoute(index: number, item: any): string {
    return item.route;
  }

  trackBySocialLink(index: number, item: any): string {
    return item.href;
  }

  trackByLanguage(index: number, item: any): string {
    return item.code;
  }
}
