import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectCategory } from '../../utils/enums/project-category.enum';
import { ProjectStatus } from '../../utils/enums/project-status.enum';
import { ProjectState } from '../app.state';

export const selectProjectsState =
  createFeatureSelector<ProjectState>('projects');

export const selectAllProjects = createSelector(
  selectProjectsState,
  (state: ProjectState) => state.projects
);

export const selectProjectsLoading = createSelector(
  selectProjectsState,
  (state: ProjectState) => state.loading
);

export const selectProjectsError = createSelector(
  selectProjectsState,
  (state: ProjectState) => state.error
);

export const selectSelectedProject = createSelector(
  selectProjectsState,
  (state: ProjectState) => state.selectedProject
);

export const selectProjectFilters = createSelector(
  selectProjectsState,
  (state: ProjectState) => state.filters
);

export const selectFeaturedProjects = createSelector(
  selectAllProjects,
  (projects) => projects.filter((project) => project.featured)
);

export const selectProjectsByCategory = (category: ProjectCategory) =>
  createSelector(selectAllProjects, (projects) =>
    projects.filter((project) => project.category === category)
  );

export const selectProjectsByStatus = (status: ProjectStatus) =>
  createSelector(selectAllProjects, (projects) =>
    projects.filter((project) => project.status === status)
  );

export const selectFilteredProjects = createSelector(
  selectAllProjects,
  selectProjectFilters,
  (projects, filters) => {
    return projects.filter((project) => {
      // Category filter
      if (filters.category && project.category !== filters.category) {
        return false;
      }
      
      // Status filter
      if (filters.status && project.status !== filters.status) {
        return false;
      }
      
      // Technology filter
      if (filters.technology && !project.technologies.includes(filters.technology)) {
        return false;
      }
      
      // Featured filter
      if (filters.featured !== undefined && project.featured !== filters.featured) {
        return false;
      }
      
      // Search term filter (NEW)
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(searchTerm);
        const matchesDescription = project.description.toLowerCase().includes(searchTerm);
        const matchesTechnology = project.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm)
        );
        
        if (!matchesTitle && !matchesDescription && !matchesTechnology) {
          return false;
        }
      }
      
      return true;
    });
  }
);