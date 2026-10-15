import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { loadProjects } from '../../../store/project/project.actions';
import { selectAllProjects } from '../../../store/project/project.selectors';
import { loadExperiences } from '../../../store/experience/experience.actions';
import { selectAllExperiences } from '../../../store/experience/experience.selectors';
import { loadSkills } from '../../../store/skills/skills.actions';
import { selectSkillsGroupedByCategory } from '../../../store/skills/skills.selectors';
import { profile } from '../../../data/profile.data';
import { Project } from '../../classes/project.model';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';
import { formatRange, yearsSince } from '../../shared/format';
import { openProjectDetails } from '../../shared/open-project-details';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, RouterLink, NgOptimizedImage, ProjectCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly store = inject(Store<AppState>);
  private readonly dialog = inject(MatDialog);

  readonly profile = profile;
  readonly formatRange = formatRange;

  private readonly projects = toSignal(this.store.select(selectAllProjects), { initialValue: [] });
  readonly experiences = toSignal(this.store.select(selectAllExperiences), { initialValue: [] });
  readonly skillGroups = toSignal(this.store.select(selectSkillsGroupedByCategory), { initialValue: [] });

  readonly featuredProjects = computed(() => this.projects().filter((p) => p.featured).slice(0, 3));

  readonly facts = computed(() => {
    const starts = this.experiences().map((e) => new Date(e.startDate).getTime());
    const firstJob = starts.length ? new Date(Math.min(...starts)) : null;
    return [
      { value: firstJob ? `${yearsSince(firstJob)}+` : '–', label: 'Years building for the web' },
      { value: String(this.projects().length), label: 'Projects shipped' },
      { value: String(this.skillGroups().reduce((n, g) => n + g.skills.length, 0)), label: 'Technologies' },
    ];
  });

  ngOnInit(): void {
    this.store.dispatch(loadProjects());
    this.store.dispatch(loadExperiences());
    this.store.dispatch(loadSkills());
  }

  openProject(project: Project): void {
    openProjectDetails(this.dialog, project);
  }
}
