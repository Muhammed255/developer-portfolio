import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ExperienceState } from '../app.state';

export const selectExperienceState =
  createFeatureSelector<ExperienceState>('experience');

export const selectAllExperiences = createSelector(
  selectExperienceState,
  (state: ExperienceState) => state.experiences
);

export const selectExperiencesLoading = createSelector(
  selectExperienceState,
  (state: ExperienceState) => state.loading
);

export const selectExperiencesError = createSelector(
  selectExperienceState,
  (state: ExperienceState) => state.error
);

export const selectCurrentExperience = createSelector(
  selectAllExperiences,
  (experiences) => experiences.find((exp) => !exp.endDate)
);

export const selectExperienceFilters = createSelector(
  selectExperienceState,
  (state: ExperienceState) => state.filters
);

export const selectFilteredExperiences = createSelector(
  selectAllExperiences,
  selectExperienceFilters,
  (experiences, filters) => {
    let filtered = [...experiences];

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter((exp) => exp.type === filters.type);
    }

    // Apply search term filter (searches across multiple fields)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.company.toLowerCase().includes(term) ||
          exp.position.toLowerCase().includes(term) ||
          exp.description.toLowerCase().includes(term) ||
          exp.technologies.some((tech) => tech.toLowerCase().includes(term)) ||
          exp.location.toLowerCase().includes(term)
      );
    }

    // Apply specific field filters
    if (filters.company) {
      filtered = filtered.filter((exp) => 
        exp.company.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.position) {
      filtered = filtered.filter((exp) => 
        exp.position.toLowerCase().includes(filters.position!.toLowerCase())
      );
    }

    if (filters.description) {
      filtered = filtered.filter((exp) => 
        exp.description.toLowerCase().includes(filters.description!.toLowerCase())
      );
    }

    // Sort by start date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    return filtered;
  }
);

// Additional useful selectors
export const selectTotalExperienceYears = createSelector(
  selectAllExperiences,
  (experiences) => {
    const totalMonths = experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      return total + months;
    }, 0);

    return Math.round(totalMonths / 12);
  }
);

export const selectAllTechnologies = createSelector(
  selectAllExperiences,
  (experiences) => {
    const techSet = new Set<string>();
    experiences.forEach((exp) => {
      exp.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }
);

export const selectTotalAchievements = createSelector(
  selectAllExperiences,
  (experiences) => {
    return experiences.reduce(
      (total, exp) => total + exp.achievements.length,
      0
    );
  }
);

export const selectEarliestPosition = createSelector(
  selectAllExperiences,
  (experiences) => {
    if (experiences.length === 0) return '';
    
    const earliest = experiences.reduce((earliest, exp) =>
      new Date(exp.startDate) < new Date(earliest.startDate) ? exp : earliest
    );
    return earliest.position;
  }
);

export const selectCurrentPosition = createSelector(
  selectAllExperiences,
  (experiences) => {
    const current = experiences.find((exp) => !exp.endDate);
    return current ? current.position : experiences[0]?.position || '';
  }
);

export const selectExperienceTypesCount = createSelector(
  selectAllExperiences,
  (experiences) => {
    const types = new Set(experiences.map((exp) => exp.type));
    return types.size;
  }
);