import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { loadProjects } from '../../../store/project/project.actions';
import { selectAllProjects, selectProjectsLoading } from '../../../store/project/project.selectors';
import { Project } from '../../classes/project.model';
import { ProjectCardComponent } from '../../shared/project-card/project-card.component';
import { openProjectDetails } from '../../shared/open-project-details';

@Component({
  selector: 'app-projects',
  imports: [MatButtonModule, MatChipsModule, MatProgressSpinnerModule, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  private readonly store = inject(Store<AppState>);
  private readonly dialog = inject(MatDialog);

  private readonly projects = toSignal(this.store.select(selectAllProjects), { initialValue: [] });
  readonly loading = toSignal(this.store.select(selectProjectsLoading), { initialValue: false });

  /** null = all technologies. */
  readonly selectedTech = signal<string | null>(null);

  /** Most-used technologies first, so the filter row starts with the useful ones. */
  readonly technologies = computed(() => {
    const counts = new Map<string, number>();
    for (const p of this.projects()) {
      for (const t of p.technologies) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tech]) => tech);
  });

  /** Featured first, then newest. */
  readonly visibleProjects = computed(() => {
    const tech = this.selectedTech();
    return this.projects()
      .filter((p) => !tech || p.technologies.includes(tech))
      .sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
  });

  ngOnInit(): void {
    this.store.dispatch(loadProjects());
  }

  selectTech(tech: string | null): void {
    this.selectedTech.set(this.selectedTech() === tech ? null : tech);
  }

  openProject(project: Project): void {
    openProjectDetails(this.dialog, project);
  }
}
