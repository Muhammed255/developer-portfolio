import { ProjectCategory } from "../../utils/enums/project-category.enum";
import { ProjectStatus } from "../../utils/enums/project-status.enum";
import { ProjectMetrics } from "./project-metrics.model";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  images: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  teamSize?: number;
  myRole?: string;
  challenges?: string[];
  solutions?: string[];
  metrics?: ProjectMetrics;
  tags: string[];
  likes: number;
  views: number;
  liked?: boolean
}
