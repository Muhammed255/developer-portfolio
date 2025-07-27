import { ExperienceType } from "../../utils/enums/experience-type.enum";

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements: string[];
  technologies: string[];
  location: string;
  type: ExperienceType;
  companyLogo?: string;
  companyWebsite?: string;
}