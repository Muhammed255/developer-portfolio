import { createReducer, on } from '@ngrx/store';
import { BlogState } from '../app.state';
import * as BlogActions from './blog.actions';

const initialState: BlogState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
  filters: {},
};

export const blogReducer = createReducer(
  initialState,

  // Initialize with mock data
  on(BlogActions.initializeBlogPosts, (state) => ({
    ...state,
    posts: [...state.posts],
    loading: false,
    error: null,
  })),

  // Load Posts
  on(BlogActions.loadBlogPosts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BlogActions.loadBlogPostsSuccess, (state, { posts }) => ({
    ...state,
    posts: [...posts].sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    ),
    loading: false,
    error: null,
  })),

  on(BlogActions.loadBlogPostsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Post
  on(BlogActions.loadBlogPost, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BlogActions.loadBlogPostSuccess, (state, { post }) => ({
    ...state,
    selectedPost: post,
    loading: false,
    error: null,
  })),

  on(BlogActions.loadBlogPostFailure, (state, { error }) => ({
    ...state,
    selectedPost: null,
    loading: false,
    error,
  })),

  // Filters
  on(BlogActions.setBlogFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),

  on(BlogActions.setBlogSearchTerm, (state, { searchTerm }) => ({
    ...state,
    filters: { ...state.filters, searchTerm },
  })),

  on(BlogActions.clearBlogFilters, (state) => ({
    ...state,
    filters: {},
  })),

  // Engagement
  on(BlogActions.likeBlogPost, (state, { postId }) => ({
    ...state,
    posts: state.posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ),
    selectedPost:
      state.selectedPost?.id === postId
        ? { ...state.selectedPost, likes: state.selectedPost.likes + 1 }
        : state.selectedPost,
  })),

  on(BlogActions.viewBlogPost, (state, { postId }) => ({
    ...state,
    posts: state.posts.map((post) =>
      post.id === postId ? { ...post, views: post.views + 1 } : post
    ),
  }))
);
