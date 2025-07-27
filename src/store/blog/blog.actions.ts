import { createAction, props } from '@ngrx/store';
import { BlogPost } from '../../app/classes/blog.model';
import { BlogFilters } from '../app.state';

// Initialize with mock data (since we're skipping effects)
export const initializeBlogPosts = createAction('[Blog] Initialize Blog Posts');

// Load Actions (kept for future use)
export const loadBlogPosts = createAction('[Blog] Load Blog Posts');
export const loadBlogPostsSuccess = createAction(
  '[Blog] Load Blog Posts Success',
  props<{ posts: BlogPost[] }>()
);
export const loadBlogPostsFailure = createAction(
  '[Blog] Load Blog Posts Failure',
  props<{ error: string }>()
);

// Load Single Post
export const loadBlogPost = createAction(
  '[Blog] Load Blog Post',
  props<{ slug: string }>()
);
export const loadBlogPostSuccess = createAction(
  '[Blog] Load Blog Post Success',
  props<{ post: BlogPost }>()
);
export const loadBlogPostFailure = createAction(
  '[Blog] Load Blog Post Failure',
  props<{ error: string }>()
);

// Filter Actions
export const setBlogFilters = createAction(
  '[Blog] Set Filters',
  props<{ filters: Partial<BlogFilters> }>()
);
export const clearBlogFilters = createAction('[Blog] Clear Filters');

// Search Action
export const setBlogSearchTerm = createAction(
  '[Blog] Set Search Term',
  props<{ searchTerm: string }>()
);

// Engagement Actions
export const likeBlogPost = createAction(
  '[Blog] Like Blog Post',
  props<{ postId: string }>()
);
export const viewBlogPost = createAction(
  '[Blog] View Blog Post',
  props<{ postId: string }>()
);