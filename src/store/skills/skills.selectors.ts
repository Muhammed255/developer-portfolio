import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SkillState } from '../app.state';
import { SkillCategory } from '../../utils/enums/skill-category.enum';

const selectSkillsState = createFeatureSelector<SkillState>('skills');

const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: SkillCategory.FRONTEND, label: 'Frontend' },
  { value: SkillCategory.BACKEND, label: 'Backend' },
  { value: SkillCategory.DATABASE, label: 'Databases' },
  { value: SkillCategory.DEVOPS, label: 'DevOps & architecture' },
  { value: SkillCategory.MOBILE, label: 'Mobile' },
  { value: SkillCategory.DESIGN, label: 'Design' },
  { value: SkillCategory.TESTING, label: 'Testing' },
  { value: SkillCategory.TOOLS, label: 'Tools & libraries' },
];

/** Non-empty categories in display order; skills strongest first. */
export const selectSkillsGroupedByCategory = createSelector(selectSkillsState, ({ skills }) =>
  CATEGORIES.map((cat) => ({
    category: cat.value,
    label: cat.label,
    skills: skills.filter((s) => s.category === cat.value).sort((a, b) => b.level - a.level),
  })).filter((group) => group.skills.length > 0)
);
