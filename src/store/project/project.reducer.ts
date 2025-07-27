import { createReducer, on } from '@ngrx/store';
import { ProjectState } from '../app.state';
import * as ProjectActions from './project.actions';

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  filters: {},
};

export const projectsReducer = createReducer(
  initialState,

  // Load Projects
  on(ProjectActions.loadProjects, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProjectActions.loadProjectsSuccess, (state, { projects }) => ({
    ...state,
    projects,
    loading: false,
    error: null,
  })),

  on(ProjectActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Project
  on(ProjectActions.loadProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProjectActions.loadProjectSuccess, (state, { project }) => ({
    ...state,
    selectedProject: project,
    loading: false,
    error: null,
  })),

  on(ProjectActions.loadProjectFailure, (state, { error }) => ({
    ...state,
    selectedProject: null,
    loading: false,
    error,
  })),

  // Filters
  on(ProjectActions.setProjectFilters, (state, { filters }) => {
    console.log("REDUCER FILTER", filters)
    return {...state,
    filters: { ...state.filters, ...filters },}
  }),

  on(ProjectActions.clearProjectFilters, (state) => ({
    ...state,
    filters: {},
  })),

  // Engagement
  on(ProjectActions.likeProject, (state, { projectId }) => ({
    ...state,
    projects: state.projects.map((project) =>
      project.id === projectId
        ? { ...project, likes: project.likes + 1 }
        : project
    ),
    selectedProject:
      state.selectedProject?.id === projectId
        ? { ...state.selectedProject, likes: state.selectedProject.likes + 1 }
        : state.selectedProject,
  })),

  on(ProjectActions.viewProject, (state, { projectId }) => ({
    ...state,
    projects: state.projects.map((project) =>
      project.id === projectId
        ? { ...project, views: project.views + 1 }
        : project
    ),
  }))
);
