import { BlogPost } from "../app/classes/blog.model";
import { Experience } from "../app/classes/experience.model";
import { Project } from "../app/classes/project.model";
import { Skill } from "../app/classes/skill.model";
import { ExperienceType } from "../utils/enums/experience-type.enum";
import { ProjectCategory } from "../utils/enums/project-category.enum";
import { ProjectStatus } from "../utils/enums/project-status.enum";

export interface AppState {
  theme: ThemeState;
  projects: ProjectState;
  skills: SkillState;
  experience: ExperienceState;
  blog: BlogState;
  ui: UIState;
}

export interface ThemeState {
  isDarkMode: boolean;
  primaryColor: string;
  accentColor: string;
}

export interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: ProjectFilters;
}

export interface ProjectFilters {
  category?: ProjectCategory;
  technology?: string;
  status?: ProjectStatus;
  featured?: boolean;
  searchTerm?: string;
  sortBy?: string;
}

export interface SkillState {
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

export interface ExperienceState {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
  filters: ExperienceFilter;
}

export interface ExperienceFilter {
  type?: ExperienceType;
  searchTerm?: string;
  company?: string;
  position?: string;
  description?: string;
}

export interface BlogState {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  filters: BlogFilters;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  featured?: boolean;
  searchTerm?: string;
}

export interface UIState {
  sidenavOpen: boolean;
  loading: boolean;
  language: string;
}