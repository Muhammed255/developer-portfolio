import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SkillState } from '../app.state';
import { Skill } from '../../app/classes/skill.model';
import { SkillCategory } from '../../utils/enums/skill-category.enum';
import { SkillLevel } from '../../utils/enums/skill-level.enum';

export const selectSkillsState = createFeatureSelector<SkillState>('skills');

export const selectAllSkills = createSelector(
  selectSkillsState,
  (state: SkillState) => state.skills
);

export const selectSkillsLoading = createSelector(
  selectSkillsState,
  (state: SkillState) => state.loading
);

export const selectSkillsError = createSelector(
  selectSkillsState,
  (state: SkillState) => state.error
);

export const selectSkillsByCategory = (category: SkillCategory) =>
  createSelector(selectAllSkills, (skills) =>
    skills.filter((skill) => skill.category === category)
  );

export const selectSkillCategories = createSelector(
  selectAllSkills,
  (skills) => [...new Set(skills.map((skill) => skill.category))]
);

// Enhanced selectors for the component
export const selectSkillsByLevel = (minLevel: SkillLevel) =>
  createSelector(selectAllSkills, (skills) =>
    skills.filter((skill) => skill.level >= minLevel)
  );

export const selectSkillsGroupedByCategory = createSelector(
  selectAllSkills,
  (skills) => {
    const categories = [
      { value: SkillCategory.FRONTEND, label: 'Frontend Development' },
      { value: SkillCategory.BACKEND, label: 'Backend Development' },
      { value: SkillCategory.DATABASE, label: 'Database' },
      { value: SkillCategory.DEVOPS, label: 'DevOps & Cloud' },
      { value: SkillCategory.MOBILE, label: 'Mobile Development' },
      { value: SkillCategory.DESIGN, label: 'Design & UI/UX' },
      { value: SkillCategory.TESTING, label: 'Testing & QA' },
      { value: SkillCategory.TOOLS, label: 'Tools & Utilities' },
    ];

    return categories
      .map((cat) => ({
        category: cat.value,
        label: cat.label,
        skills: skills.filter((skill) => skill.category === cat.value),
      }))
      .filter((group) => group.skills.length > 0);
  }
);

export const selectSkillsOverview = createSelector(
  selectSkillsGroupedByCategory,
  (groupedSkills) => {
    return groupedSkills.map((group) => {
      const avgYears =
        group.skills.reduce((sum, skill) => sum + skill.experience, 0) /
        group.skills.length;

      return {
        title: group.label,
        count: group.skills.length,
        avgYears: Math.round(avgYears * 10) / 10,
        icon: getCategoryIcon(group.category),
        color: getCategoryColor(group.category),
      };
    });
  }
);

export const selectSkillsTimeline = createSelector(
  selectAllSkills,
  (skills) => {
    const currentYear = new Date().getFullYear();
    const timelineMap = new Map<number, Skill[]>();

    skills.forEach((skill) => {
      // Simulate when skill was acquired based on experience
      const acquiredYear = currentYear - skill.experience + 1;

      if (!timelineMap.has(acquiredYear)) {
        timelineMap.set(acquiredYear, []);
      }
      timelineMap.get(acquiredYear)!.push(skill);
    });

    return Array.from(timelineMap.entries())
      .map(([year, skills]) => ({ year, skills }))
      .sort((a, b) => b.year - a.year); // Sort by year descending
  }
);

// Filtered selectors
export const selectFilteredSkills = (filters: {
  category?: SkillCategory;
  minLevel?: SkillLevel;
}) =>
  createSelector(selectAllSkills, (skills) => {
    let filtered = [...skills];

    if (filters.category) {
      filtered = filtered.filter((skill) => skill.category === filters.category);
    }

    if (filters.minLevel) {
      filtered = filtered.filter((skill) => skill.level >= filters.minLevel!);
    }

    return filtered;
  });

export const selectFilteredSkillsByCategory = (filters: {
  category?: SkillCategory;
  minLevel?: SkillLevel;
}) =>
  createSelector(
    selectSkillsGroupedByCategory,
    selectFilteredSkills(filters),
    (groupedSkills, filteredSkills) => {
      return groupedSkills
        .map((group) => ({
          ...group,
          skills: group.skills.filter((skill) =>
            filteredSkills.some((filtered) => filtered.id === skill.id)
          ),
        }))
        .filter((group) => group.skills.length > 0);
    }
  );

// Helper functions (you might want to move these to a utils file)
function getCategoryIcon(category: SkillCategory): string {
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

function getCategoryColor(category: SkillCategory): string {
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