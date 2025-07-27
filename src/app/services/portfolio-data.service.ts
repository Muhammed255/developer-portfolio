import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map } from 'rxjs';
import { ExperienceType } from '../../utils/enums/experience-type.enum';
import { PostStatus } from '../../utils/enums/post-status.enum';
import { ProjectCategory } from '../../utils/enums/project-category.enum';
import { ProjectStatus } from '../../utils/enums/project-status.enum';
import { SkillCategory } from '../../utils/enums/skill-category.enum';
import { SkillLevel } from '../../utils/enums/skill-level.enum';
import { BlogPost } from '../classes/blog.model';
import { Experience } from '../classes/experience.model';
import { Project } from '../classes/project.model';
import { Skill } from '../classes/skill.model';
import { projectsData } from '../../data/projects.data';
import { skillsData } from '../../data/skills.data';
import { experiencesData } from '../../data/experiences.data';
import { blogPostsData } from '../../data/blog-post.data';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  // State subjects for reactive updates
  private projectsSubject = new BehaviorSubject<Project[]>(projectsData);
  private skillsSubject = new BehaviorSubject<Skill[]>(skillsData);
  private experiencesSubject = new BehaviorSubject<Experience[]>(
    experiencesData
  );
  private blogPostsSubject = new BehaviorSubject<BlogPost[]>(blogPostsData);

  // Public observables
  public readonly projects$ = this.projectsSubject.asObservable();
  public readonly skills$ = this.skillsSubject.asObservable();
  public readonly experiences$ = this.experiencesSubject.asObservable();
  public readonly blogPosts$ = this.blogPostsSubject.asObservable();

  // ======================
  // PROJECT METHODS
  // ======================

  getProjects(): Observable<Project[]> {
    return of([...projectsData]);
  }

  getProject(id: string): Observable<Project> {
    const project = projectsData.find((p) => p.id === id);
    if (!project) {
      return of();
    }
    return of(project);
  }

  getFeaturedProjects(): Observable<Project[]> {
    return of(projectsData.filter((p) => p.featured));
  }

  getProjectsByCategory(category: ProjectCategory): Observable<Project[]> {
    return of(projectsData.filter((p) => p.category === category));
  }

  getProjectsByTechnology(technology: string): Observable<Project[]> {
    return of(
      projectsData.filter((p) =>
        p.technologies.some((tech) =>
          tech.toLowerCase().includes(technology.toLowerCase())
        )
      )
    );
  }

  // Simulate incrementing views (could store in localStorage)
  incrementProjectViews(id: string): Observable<Project | undefined> {
    const project = projectsData.find((p) => p.id === id);
    if (project) {
      project.views++;
      this.projectsSubject.next([...projectsData]);
    }
    return of(project);
  }

  // Simulate liking (could store in localStorage)
  likeProject(id: string): Observable<Project | undefined> {
    const project = projectsData.find((p) => p.id === id);
    if (project) {
      project.likes++;
      this.projectsSubject.next([...projectsData]);
    }
    return of(project);
  }

  // ======================
  // SKILL METHODS
  // ======================

  getSkills(): Observable<Skill[]> {
    return of([...skillsData]);
  }

  getSkillsByCategory(category: SkillCategory): Observable<Skill[]> {
    return of(skillsData.filter((s) => s.category === category));
  }

  getSkillsByLevel(level: SkillLevel): Observable<Skill[]> {
    return of(skillsData.filter((s) => s.level === level));
  }

  getTopSkills(limit: number = 6): Observable<Skill[]> {
    return of(
      skillsData.sort((a, b) => b.experience - a.experience).slice(0, limit)
    );
  }

  // ======================
  // EXPERIENCE METHODS
  // ======================

  getExperiences(): Observable<Experience[]> {
    return of(
      [...experiencesData].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )
    );
  }

  getExperience(id: string): Observable<Experience | undefined> {
    const experience = experiencesData.find((e) => e.id === id);
    return of(experience);
  }

  getCurrentExperience(): Observable<Experience | undefined> {
    const current = experiencesData.find((e) => !e.endDate);
    return of(current);
  }

  // ======================
  // BLOG POST METHODS
  // ======================

  getBlogPosts(): Observable<BlogPost[]> {
    return of(
      blogPostsData
        .filter((p) => p.status === PostStatus.PUBLISHED)
        .sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        )
    );
  }

  getBlogPost(slug: string): Observable<BlogPost> {
    const post = blogPostsData.find((p) => p.slug === slug);
    if (!post) {
      return of();
    }
    return of(post);
  }

  getFeaturedBlogPosts(): Observable<BlogPost[]> {
    return of(
      blogPostsData.filter(
        (p) => p.featured && p.status === PostStatus.PUBLISHED
      )
    );
  }

  getBlogPostsByCategory(category: string): Observable<BlogPost[]> {
    return of(
      blogPostsData.filter(
        (p) => p.category === category && p.status === PostStatus.PUBLISHED
      )
    );
  }

  getBlogPostsByTag(tag: string): Observable<BlogPost[]> {
    return of(
      blogPostsData.filter(
        (p) => p.tags.includes(tag) && p.status === PostStatus.PUBLISHED
      )
    );
  }

  getRecentBlogPosts(limit: number = 3): Observable<BlogPost[]> {
    return this.getBlogPosts().pipe(map((posts) => posts.slice(0, limit)));
  }

  incrementBlogPostViews(slug: string): Observable<BlogPost | undefined> {
    const post = blogPostsData.find((p) => p.slug === slug);
    if (post) {
      post.views++;
      this.blogPostsSubject.next([...blogPostsData]);
    }
    return of(post);
  }

  likeBlogPost(id: string): Observable<BlogPost | undefined> {
    const post = blogPostsData.find((p) => p.id === id);
    if (post) {
      post.likes++;
      this.blogPostsSubject.next([...blogPostsData]);
    }
    return of(post);
  }

  // ======================
  // SEARCH & UTILITY METHODS
  // ======================

  searchAll(query: string): Observable<{
    projects: Project[];
    skills: Skill[];
    experiences: Experience[];
    blogPosts: BlogPost[];
  }> {
    const lowercaseQuery = query.toLowerCase();

    const filteredProjects = projectsData.filter(
      (p) =>
        p.title.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery) ||
        p.technologies.some((tech) =>
          tech.toLowerCase().includes(lowercaseQuery)
        ) ||
        p.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );

    const filteredSkills = skillsData.filter((s) =>
      s.name.toLowerCase().includes(lowercaseQuery)
    );

    const filteredExperiences = experiencesData.filter(
      (e) =>
        e.company.toLowerCase().includes(lowercaseQuery) ||
        e.position.toLowerCase().includes(lowercaseQuery) ||
        e.technologies.some((tech) =>
          tech.toLowerCase().includes(lowercaseQuery)
        )
    );

    const filteredBlogPosts = blogPostsData.filter(
      (p) =>
        p.status === PostStatus.PUBLISHED &&
        (p.title.toLowerCase().includes(lowercaseQuery) ||
          p.excerpt.toLowerCase().includes(lowercaseQuery) ||
          p.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
    );

    return of({
      projects: filteredProjects,
      skills: filteredSkills,
      experiences: filteredExperiences,
      blogPosts: filteredBlogPosts,
    });
  }

  getDashboardStats(): Observable<{
    totalProjects: number;
    totalSkills: number;
    totalExperiences: number;
    totalBlogPosts: number;
    totalViews: number;
    totalLikes: number;
  }> {
    const totalViews = [
      ...projectsData.map((p) => p.views),
      ...blogPostsData.map((p) => p.views),
    ].reduce((sum, views) => sum + views, 0);

    const totalLikes = [
      ...projectsData.map((p) => p.likes),
      ...blogPostsData.map((p) => p.likes),
    ].reduce((sum, likes) => sum + likes, 0);

    return of({
      totalProjects: projectsData.length,
      totalSkills: skillsData.length,
      totalExperiences: experiencesData.length,
      totalBlogPosts: blogPostsData.filter(
        (p) => p.status === PostStatus.PUBLISHED
      ).length,
      totalViews,
      totalLikes,
    });
  }

  // Get all unique technologies across projects
  getAllTechnologies(): Observable<string[]> {
    const allTechs = projectsData
      .flatMap((p) => p.technologies)
      .concat(experiencesData.flatMap((e) => e.technologies));

    const uniqueTechs = [...new Set(allTechs)].sort();
    return of(uniqueTechs);
  }

  // Get all unique categories
  getAllCategories(): Observable<string[]> {
    const categories = [
      ...new Set(blogPostsData.map((p) => p.category)),
    ].sort();
    return of(categories);
  }

  // Get all unique tags
  getAllTags(): Observable<string[]> {
    const allTags = blogPostsData
      .flatMap((p) => p.tags)
      .concat(projectsData.flatMap((p) => p.tags));

    const uniqueTags = [...new Set(allTags)].sort();
    return of(uniqueTags);
  }
}
