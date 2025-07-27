import { SkillCategory } from "../../utils/enums/skill-category.enum";
import { SkillLevel } from "../../utils/enums/skill-level.enum";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  experience: number; // years
  projects: string[]; // project IDs
  certifications?: string[];
  icon?: string;
  color?: string;
}