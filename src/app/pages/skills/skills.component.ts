import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Subject } from 'rxjs';
import { AppState } from '../../../store/app.state';
import { SkillCategory } from '../../../utils/enums/skill-category.enum';
import { SkillLevel } from '../../../utils/enums/skill-level.enum';
import { Skill } from '../../classes/skill.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import * as SkillActions from '../../../store/skills/skills.actions';
import * as SkillSelectors from '../../../store/skills/skills.selectors';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatTooltipModule,
    FormsModule,
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private destroy$ = new Subject<void>();

  // Store observables
  skills$ = this.store.select(SkillSelectors.selectAllSkills);
  loading$ = this.store.select(SkillSelectors.selectSkillsLoading);
  error$ = this.store.select(SkillSelectors.selectSkillsError);
  skillsGroupedByCategory$ = this.store.select(SkillSelectors.selectSkillsGroupedByCategory);
  skillsOverview$ = this.store.select(SkillSelectors.selectSkillsOverview);
  skillsTimeline$ = this.store.select(SkillSelectors.selectSkillsTimeline);

  // Local UI state using signals
  viewMode = signal<'grid' | 'chart' | 'timeline'>('grid');
  selectedCategory = signal<SkillCategory | ''>('');
  minLevel = signal<SkillLevel>(SkillLevel.BEGINNER);

  // Computed filtered data based on local filters
  filteredSkillsByCategory$ = combineLatest([
    this.skillsGroupedByCategory$,
    this.skills$
  ]).pipe(
    map(([groupedSkills, allSkills]) => {
      // Apply filters
      let filteredSkills = [...allSkills];

      if (this.selectedCategory()) {
        filteredSkills = filteredSkills.filter(
          (skill) => skill.category === this.selectedCategory()
        );
      }

      filteredSkills = filteredSkills.filter(
        (skill) => skill.level >= this.minLevel()
      );

      // Return grouped and filtered skills
      return groupedSkills
        .map((group) => ({
          ...group,
          skills: group.skills.filter((skill) =>
            filteredSkills.some((filtered) => filtered.id === skill.id)
          ),
        }))
        .filter((group) => group.skills.length > 0);
    })
  );

  // Filter options
  categories = [
    { value: SkillCategory.FRONTEND, label: 'Frontend Development' },
    { value: SkillCategory.BACKEND, label: 'Backend Development' },
    { value: SkillCategory.DATABASE, label: 'Database' },
    { value: SkillCategory.DEVOPS, label: 'DevOps & Cloud' },
    { value: SkillCategory.MOBILE, label: 'Mobile Development' },
    { value: SkillCategory.DESIGN, label: 'Design & UI/UX' },
    { value: SkillCategory.TESTING, label: 'Testing & QA' },
    { value: SkillCategory.TOOLS, label: 'Tools & Utilities' },
  ];

  ngOnInit() {
    // Dispatch load skills action
    this.store.dispatch(SkillActions.loadSkills());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange() {
    // Filters are reactive through signals, no additional action needed
    // The filteredSkillsByCategory$ observable will automatically update
  }

  onViewModeChange() {
    // View mode is handled by signal, template will react automatically
  }

  onCategoryChange(value: any) {
    this.selectedCategory.set(value);
  }

  onMinLevelChange(value: any) {
    this.minLevel.set(value);
  }

  onViewModeToggle(mode: 'grid' | 'chart' | 'timeline') {
    this.viewMode.set(mode);
  }

  clearFilters() {
    this.selectedCategory.set('');
    this.minLevel.set(SkillLevel.BEGINNER);
  }

  retrySkills() {
    this.store.dispatch(SkillActions.loadSkills())
  }

  // Utility methods (moved from template logic)
  trackByCategory(
    index: number,
    item: { category: SkillCategory; skills: Skill[] }
  ): SkillCategory {
    return item.category;
  }

  trackBySkill(index: number, skill: Skill): string {
    return skill.id;
  }

  trackByYear(index: number, item: { year: number; skills: Skill[] }): number {
    return item.year;
  }

  getCategoryIcon(category: SkillCategory): string {
    switch (category) {
      case SkillCategory.FRONTEND:
        return 'web';
      case SkillCategory.BACKEND:
        return 'dns';
      case SkillCategory.DATABASE:
        return 'storage';
      case SkillCategory.DEVOPS:
        return 'cloud';
      case SkillCategory.MOBILE:
        return 'phone_android';
      case SkillCategory.DESIGN:
        return 'palette';
      case SkillCategory.TESTING:
        return 'bug_report';
      case SkillCategory.TOOLS:
        return 'build';
      default:
        return 'code';
    }
  }

  getCategoryColor(category: SkillCategory): string {
    const colors = {
      [SkillCategory.FRONTEND]: '#e91e63',
      [SkillCategory.BACKEND]: '#3f51b5',
      [SkillCategory.DATABASE]: '#4caf50',
      [SkillCategory.DEVOPS]: '#ff9800',
      [SkillCategory.MOBILE]: '#9c27b0',
      [SkillCategory.DESIGN]: '#f44336',
      [SkillCategory.TESTING]: '#607d8b',
      [SkillCategory.TOOLS]: '#795548',
    };
    return colors[category] || '#666';
  }

  getCategoryLabel(category: SkillCategory): string {
    const label = this.categories.find((cat) => cat.value === category);
    return label ? label.label : category;
  }

  getLevelLabel(level: SkillLevel): string {
    switch (level) {
      case SkillLevel.BEGINNER:
        return 'Beginner';
      case SkillLevel.INTERMEDIATE:
        return 'Intermediate';
      case SkillLevel.ADVANCED:
        return 'Advanced';
      case SkillLevel.EXPERT:
        return 'Expert';
      default:
        return 'Unknown';
    }
  }

  getLevelColor(level: SkillLevel): 'primary' | 'accent' | 'warn' {
    switch (level) {
      case SkillLevel.EXPERT:
        return 'primary';
      case SkillLevel.ADVANCED:
        return 'primary';
      case SkillLevel.INTERMEDIATE:
        return 'accent';
      case SkillLevel.BEGINNER:
        return 'warn';
      default:
        return 'primary';
    }
  }

  getAverageLevel(skills: Skill[]): number {
    if (skills.length === 0) return 0;
    const total = skills.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round((total / skills.length) * 10) / 10;
  }

  getTotalExperience(skills: Skill[]): number {
    return skills.reduce((sum, skill) => sum + skill.experience, 0);
  }

  getProjectName(projectId: string): string {
    // Mock implementation - would normally fetch from projects store
    const projectNames: { [key: string]: string } = {
      '1': 'E-Commerce Platform',
      '2': 'Task Management App',
      '3': 'Data Visualization Dashboard',
    };
    return projectNames[projectId] || 'Unknown Project';
  }
}