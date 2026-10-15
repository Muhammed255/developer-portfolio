import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { profile } from '../../../data/profile.data';

@Component({
  selector: 'app-about',
  imports: [MatButtonModule, MatIconModule, RouterLink, NgOptimizedImage],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  readonly profile = profile;

  readonly principles = [
    {
      icon: 'architecture',
      title: 'Structure first',
      text: 'Clear module boundaries, typed contracts and documented APIs, so a codebase stays easy to change as it grows.',
    },
    {
      icon: 'speed',
      title: 'Performance matters',
      text: 'Caching, efficient queries and lean front-end bundles: users feel the difference before they see it.',
    },
    {
      icon: 'groups',
      title: 'Team player',
      text: 'Comfortable in remote, cross-functional teams, with Git-based workflows and API docs others can rely on.',
    },
  ];
}
