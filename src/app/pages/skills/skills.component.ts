import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { loadSkills } from '../../../store/skills/skills.actions';
import { selectSkillsGroupedByCategory } from '../../../store/skills/skills.selectors';
import { SkillCategory } from '../../../utils/enums/skill-category.enum';
import { SkillLevel } from '../../../utils/enums/skill-level.enum';

const LEVEL_LABELS: Record<SkillLevel, string> = {
  [SkillLevel.BEGINNER]: 'Familiar',
  [SkillLevel.INTERMEDIATE]: 'Working knowledge',
  [SkillLevel.ADVANCED]: 'Advanced',
  [SkillLevel.EXPERT]: 'Expert',
};

const CATEGORY_ICONS: Partial<Record<SkillCategory, string>> = {
  [SkillCategory.FRONTEND]: 'web',
  [SkillCategory.BACKEND]: 'dns',
  [SkillCategory.DATABASE]: 'storage',
  [SkillCategory.DEVOPS]: 'cloud',
  [SkillCategory.TOOLS]: 'build',
  [SkillCategory.TESTING]: 'bug_report',
  [SkillCategory.MOBILE]: 'smartphone',
  [SkillCategory.DESIGN]: 'palette',
};

@Component({
  selector: 'app-skills',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent implements OnInit {
  private readonly store = inject(Store<AppState>);

  readonly groups = toSignal(this.store.select(selectSkillsGroupedByCategory), { initialValue: [] });
  readonly levels = [SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED, SkillLevel.EXPERT];
  readonly levelLabels = LEVEL_LABELS;
  readonly categoryIcons = CATEGORY_ICONS;

  ngOnInit(): void {
    this.store.dispatch(loadSkills());
  }
}
