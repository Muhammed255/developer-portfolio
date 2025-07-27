import { createSelector, createFeatureSelector } from '@ngrx/store';
import { BlogState, BlogFilters } from '../app.state';
import { BlogPost } from '../../app/classes/blog.model';
import { PostStatus } from '../../utils/enums/post-status.enum';

export const selectBlogState = createFeatureSelector<BlogState>('blog');

export const selectAllBlogPosts = createSelector(
  selectBlogState,
  (state: BlogState) => state.posts.filter(post => post.status === PostStatus.PUBLISHED)
);

export const selectBlogLoading = createSelector(
  selectBlogState,
  (state: BlogState) => state.loading
);

export const selectBlogError = createSelector(
  selectBlogState,
  (state: BlogState) => state.error
);

export const selectSelectedBlogPost = createSelector(
  selectBlogState,
  (state: BlogState) => state.selectedPost
);

export const selectBlogFilters = createSelector(
  selectBlogState,
  (state: BlogState) => state.filters
);

export const selectFeaturedBlogPosts = createSelector(
  selectAllBlogPosts,
  (posts) => posts.filter((post) => post.featured).slice(0, 2)
);

export const selectBlogCategories = createSelector(
  selectAllBlogPosts,
  (posts) => [...new Set(posts.map((post) => post.category))].sort()
);

export const selectBlogTags = createSelector(
  selectAllBlogPosts, 
  (posts) => [...new Set(posts.flatMap((post) => post.tags))].sort()
);

export const selectFilteredBlogPosts = createSelector(
  selectAllBlogPosts,
  selectBlogFilters,
  (posts, filters) => {
    let filtered = [...posts];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((post) => post.category === filters.category);
    }

    // Tag filter
    if (filters.tag) {
      filtered = filtered.filter((post) => post.tags.includes(filters.tag));
    }

    // Featured filter
    if (filters.featured !== undefined) {
      filtered = filtered.filter((post) => post.featured === filters.featured);
    }

    // Search term filter (if provided)
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((post) => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }
);

export const selectRecentBlogPosts = createSelector(
  selectAllBlogPosts,
  (posts) => posts.slice(0, 5)
);

export const selectBlogPostBySlug = (slug: string) =>
  createSelector(selectAllBlogPosts, (posts) =>
    posts.find((post) => post.slug === slug)
  );

export const selectBlogStats = createSelector(
  selectAllBlogPosts,
  (posts) => ({
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    featuredCount: posts.filter(post => post.featured).length,
    categoriesCount: new Set(posts.map(post => post.category)).size,
    averageReadTime: Math.round(
      posts.reduce((sum, post) => sum + post.readTime, 0) / posts.length
    )
  })
);