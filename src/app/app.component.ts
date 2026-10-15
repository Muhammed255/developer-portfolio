import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { selectCurrentTheme } from '../store/theme/theme.selectors';
import { toggleTheme } from '../store/theme/theme.actions';
import { profile } from '../data/profile.data';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly store = inject(Store<AppState>);

  readonly profile = profile;
  readonly year = new Date().getFullYear();
  readonly isDarkTheme = toSignal(this.store.select(selectCurrentTheme), { initialValue: false });

  readonly navItems = [
    { path: '/about', label: 'About' },
    { path: '/experiences', label: 'Experience' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
  ] as const;

  onThemeToggle(): void {
    this.store.dispatch(toggleTheme());
  }
}
