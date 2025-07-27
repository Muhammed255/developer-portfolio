import { BlogPost } from "../../app/classes/blog.model";
import { PostStatus } from "../enums/post-status.enum";

export const dummyBlogPosts: BlogPost[] = [
  {
    id: 'post1',
    title: 'Understanding Observables in Angular',
    slug: 'observables-in-angular',
    excerpt: 'A quick guide to using Observables effectively in your Angular apps.',
    content: `Observables are a powerful way to manage async data in Angular...`,
    author: 'Jane Doe',
    publishDate: new Date('2024-12-01'),
    lastModified: new Date('2025-01-10'),
    tags: ['Angular', 'RxJS', 'Frontend'],
    category: 'Web Development',
    featured: true,
    coverImage: 'https://source.unsplash.com/featured/?angular,code',
    readTime: 5,
    likes: 150,
    views: 1200,
    status: PostStatus.PUBLISHED
  },
  {
    id: 'post2',
    title: '10 VSCode Tips for Faster Development',
    slug: 'vscode-tips',
    excerpt: 'Speed up your workflow with these VSCode tricks.',
    content: `VSCode offers a ton of productivity features that often go unnoticed...`,
    author: 'John Smith',
    publishDate: new Date('2025-03-22'),
    tags: ['VSCode', 'Productivity'],
    category: 'Tools & Tips',
    featured: false,
    readTime: 3,
    likes: 89,
    views: 470,
    status: PostStatus.DRAFT
  },
  {
    id: 'post3',
    title: 'How to Build a Blog with Node.js and MongoDB',
    slug: 'nodejs-blog-tutorial',
    excerpt: 'This tutorial walks you through creating a blog from scratch using Node and MongoDB.',
    content: `To build a blog, you'll need a backend to manage posts, a database to store them...`,
    author: 'Emily Zhang',
    publishDate: new Date('2023-09-14'),
    lastModified: new Date('2024-01-15'),
    tags: ['Node.js', 'MongoDB', 'Backend'],
    category: 'Backend Development',
    featured: true,
    coverImage: 'https://source.unsplash.com/featured/?nodejs,mongodb',
    readTime: 8,
    likes: 340,
    views: 2600,
    status: PostStatus.ARCHIVED
  }
];