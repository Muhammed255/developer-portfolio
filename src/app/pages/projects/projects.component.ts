import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, take } from 'rxjs';
import { AppState, ProjectFilters } from '../../../store/app.state';
import { ProjectCategory } from '../../../utils/enums/project-category.enum';
import { ProjectStatus } from '../../../utils/enums/project-status.enum';
import { Project } from '../../classes/project.model';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { toObservable } from '@angular/core/rxjs-interop';
import * as ProjectActions from '../../../store/project/project.actions';
import * as ProjectSelectors from '../../../store/project/project.selectors';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    TitleCasePipe,
    AsyncPipe,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  private store = inject(Store<AppState>);
  private dialog = inject(MatDialog);

  // Observables from store
  projects$ = this.store.select(ProjectSelectors.selectAllProjects);
  loading$ = this.store.select(ProjectSelectors.selectProjectsLoading);
  error$ = this.store.select(ProjectSelectors.selectProjectsError);
  featuredProjects$ = this.store.select(ProjectSelectors.selectFeaturedProjects);
  filters$ = this.store.select(ProjectSelectors.selectProjectFilters);
  
  // Use the store-based filtered projects instead of local filtering
  filteredProjects$ = this.store.select(ProjectSelectors.selectFilteredProjects);

  // Local UI state only (not for filtering logic)
  gridView = signal(true);
  currentPage = signal(1);
  pageSize = signal(12);

  // Get filter values from store
  searchTerm$ = this.filters$.pipe(map(filters => filters.searchTerm || ''));
  selectedCategory$ = this.filters$.pipe(map(filters => filters.category || ''));
  selectedStatus$ = this.filters$.pipe(map(filters => filters.status || ''));
  showFeaturedOnly$ = this.filters$.pipe(map(filters => filters.featured || false));
  sortBy$ = this.filters$.pipe(map(filters => filters.sortBy || 'name'));

  // Computed properties
  totalProjects$ = this.projects$.pipe(map((projects) => projects?.length));

  uniqueTechnologies$ = this.projects$.pipe(
    map((projects) => {
      const techs = new Set();
      projects?.forEach((p) => p.technologies?.forEach((t) => techs.add(t)));
      return techs.size;
    })
  );

  totalViews$ = this.projects$.pipe(
    map((projects) => projects?.reduce((sum, p) => sum + p.views, 0))
  );

  totalLikes$ = this.projects$.pipe(
    map((projects) => projects?.reduce((sum, p) => sum + p.likes, 0))
  );

  // Paginated and sorted results
  paginatedProjects$ = combineLatest([
    this.filteredProjects$,
    this.filters$
  ]).pipe(
    map(([projects, filters]) => this.applySortingAndPagination(projects, filters))
  );

  hasMoreProjects$ = combineLatest([
    this.filteredProjects$,
    toObservable(this.currentPage),
    toObservable(this.pageSize)
  ]).pipe(
    map(([projects, currentPage, pageSize]) => {
      return projects?.length > currentPage * pageSize;
    })
  );

  ngOnInit() {
    // Dispatch action to load projects
    this.store.dispatch(ProjectActions.loadProjects());
  }

  private applySortingAndPagination(projects: Project[], filters: any): Project[] {
    if (!projects) return [];
    
    let sorted = [...projects];
    
    // Apply sorting
    const sortBy = filters.sortBy || 'date';
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'date':
        default:
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
    });

    // Apply pagination
    return sorted.slice(0, this.currentPage() * this.pageSize());
  }

  onSearchChange(event: any) {
    this.currentPage.set(1);
    this.updateStoreFilters({ searchTerm: event.target.value });
  }

  onCategoryChange(event: any) {
    this.currentPage.set(1);
    this.updateStoreFilters({ category: event.value });
  }

  onStatusChange(event: any) {
    this.currentPage.set(1);
    this.updateStoreFilters({ status: event.value });
  }

  onFeaturedToggle(event: any) {
    this.currentPage.set(1);
    this.updateStoreFilters({ featured: event.checked });
  }

  onViewToggle(event: any) {
    this.gridView.set(event.checked);
  }

  onSortChange(event: any) {
    this.updateStoreFilters({ sortBy: event.value });
  }

  clearFilters() {
    this.currentPage.set(1);
    this.store.dispatch(ProjectActions.clearProjectFilters());
  }

  loadMoreProjects() {
    this.currentPage.update((page) => page + 1);
  }

  openProjectDetail(project: Project) {
    // Dispatch view action
    this.store.dispatch(ProjectActions.viewProject({ projectId: project.id }));

    this.dialog.open(ProjectDetailsComponent, {
      data: { project },
      maxWidth: '900px',
      width: '90vw',
      maxHeight: '90vh',
    });
  }

  openDemo(project: Project, event: Event) {
    event.stopPropagation();
    if (project.demoUrl) {
      // Dispatch view action
      this.store.dispatch(
        ProjectActions.viewProject({ projectId: project.id })
      );
      window.open(project.demoUrl, '_blank');
    }
  }

  openGithub(project: Project, event: Event) {
    event.stopPropagation();
    if (project.githubUrl) {
      window.open(project.githubUrl, '_blank');
    }
  }

  likeProject(project: Project, event: Event) {
    event.stopPropagation();
    // Dispatch like action to store
    this.store.dispatch(ProjectActions.likeProject({ projectId: project.id }));
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'Completed';
      case ProjectStatus.IN_PROGRESS:
        return 'In Progress';
      case ProjectStatus.PLANNED:
        return 'Planned';
      case ProjectStatus.ARCHIVED:
        return 'Archived';
      default:
        return status;
    }
  }
private updateStoreFilters(partialFilters: Partial<ProjectFilters>) {
    // Get current filters from store and merge with new ones
    this.filters$.pipe(take(1)).subscribe(currentFilters => {
      const filters: ProjectFilters = {
        ...currentFilters,
        ...partialFilters
      };
      
      console.log("UPDATED FILTERS", filters);
      this.store.dispatch(ProjectActions.setProjectFilters({ filters }));
    });
  }
}
