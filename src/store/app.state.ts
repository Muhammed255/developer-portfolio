import { Experience } from '../app/classes/experience.model';
import { Project } from '../app/classes/project.model';
import { Skill } from '../app/classes/skill.model';

export interface AppState {
  theme: ThemeState;
  projects: ProjectState;
  skills: SkillState;
  experience: ExperienceState;
}

export interface ThemeState {
  isDarkMode: boolean;
}

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
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
}
