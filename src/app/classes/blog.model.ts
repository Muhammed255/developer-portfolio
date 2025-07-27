import { PostStatus } from "../../utils/enums/post-status.enum";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  lastModified?: Date;
  tags: string[];
  category: string;
  featured: boolean;
  coverImage?: string;
  readTime: number; // minutes
  likes: number;
  views: number;
  status: PostStatus;
}