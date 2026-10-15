import { firstValueFrom } from 'rxjs';
import { PortfolioDataService } from './portfolio-data.service';
import { projectsData } from '../../data/projects.data';
import { skillsData } from '../../data/skills.data';

describe('PortfolioDataService', () => {
  const service = new PortfolioDataService();

  it('returns copies so callers cannot mutate the shared data', async () => {
    const projects = await firstValueFrom(service.getProjects());
    projects[0].title = 'changed';
    expect(projectsData[0].title).not.toBe('changed');

    const skills = await firstValueFrom(service.getSkills());
    skills[0].name = 'changed';
    expect(skillsData[0].name).not.toBe('changed');
  });

  it('returns experiences newest first', async () => {
    const experiences = await firstValueFrom(service.getExperiences());
    const starts = experiences.map((e) => new Date(e.startDate).getTime());
    expect(starts).toEqual([...starts].sort((a, b) => b - a));
  });
});
