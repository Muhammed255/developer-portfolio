import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { BlogPost } from '../../classes/blog.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { BlogCardComponent } from './blog-card/blog-card.component';
import { AsyncPipe } from '@angular/common';
import * as BlogActions from '../../../store/blog/blog.actions';
import * as BlogSelectors from '../../../store/blog/blog.selectors';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
} from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    BlogCardComponent,
    AsyncPipe,
    MatProgressBarModule,
    MatProgressSpinner,
    MatGridListModule,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);

  // Store observables
  posts$ = this.store.select(BlogSelectors.selectFilteredBlogPosts);
  allPosts$ = this.store.select(BlogSelectors.selectAllBlogPosts);
  loading$ = this.store.select(BlogSelectors.selectBlogLoading);
  error$ = this.store.select(BlogSelectors.selectBlogError);
  featuredPosts$ = this.store.select(BlogSelectors.selectFeaturedBlogPosts);
  categories$ = this.store.select(BlogSelectors.selectBlogCategories);
  tags$ = this.store.select(BlogSelectors.selectBlogTags);
  filters$ = this.store.select(BlogSelectors.selectBlogFilters);
  blogStats$ = this.store.select(BlogSelectors.selectBlogStats);

  // Local UI state using signals
  searchTerm = signal('');
  selectedCategory = signal('');
  selectedTag = signal('');

  searchTerm$ = combineLatest([
    toObservable(this.searchTerm).pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
  ]).pipe(
    map(([st]) => {
      console.log('SEARCH TERM', st);
      return this.store.dispatch(
        BlogActions.setBlogSearchTerm({ searchTerm: st })
      );
    })
  );

  stats = combineLatest([
    this.blogStats$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((data) => console.log('blogStats$', data))
    ),
  ]).pipe(
    map(([stats]) => [
      { label: 'Articles', value: stats?.totalPosts ?? 0, icon: 'article' },
      { label: 'Views', value: stats?.totalViews ?? 0, icon: 'visibility' },
      { label: 'Likes', value: stats?.totalLikes ?? 0, icon: 'thumb_up' },
      {
        label: 'Avg Read Time',
        value: stats?.averageReadTime ?? 'N/A',
        icon: 'schedule',
      },
    ])
  );

  // stats = computed(() => {
  //   const stats = this.blogStats$;
  // });

  ngOnInit() {
    // Initialize with mock data (since we're skipping effects)
    this.store.dispatch(BlogActions.loadBlogPosts());

    this.blogStats$.pipe(tap((d) => console.log('adfadfasdsd', d))).subscribe();

    // Set up reactive search with debouncing
  }

  onSearch() {
    // Search is handled reactively through the signal
    // The observable above will dispatch the action with debouncing
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.updateFilters();
  }

  onTagChange(tag: string) {
    this.selectedTag.set(tag);
    this.updateFilters();
  }

  refreshBlog() {
    this.store.dispatch(BlogActions.initializeBlogPosts());
  }

  onPostClick(post: BlogPost) {
    // Dispatch view action to increment view count
    this.store.dispatch(BlogActions.viewBlogPost({ postId: post.id }));

    // Navigate to blog post detail
    this.router.navigate(['/blog', post.slug]);
  }

  onLikePost(post: BlogPost, event: Event) {
    // event.stopPropagation();
    // this.store.dispatch(BlogActions.likeBlogPost({ postId: post.id }));
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedTag.set('');
    this.store.dispatch(BlogActions.clearBlogFilters());
  }

  showFeaturedOnly() {
    this.store.dispatch(
      BlogActions.setBlogFilters({
        filters: { featured: true },
      })
    );
  }

  showAllPosts() {
    this.store.dispatch(
      BlogActions.setBlogFilters({
        filters: { featured: undefined },
      })
    );
  }

  trackByPost(index: number, post: BlogPost): string {
    return post.id;
  }

  private updateFilters() {
    const filters: any = {};

    if (this.selectedCategory()) {
      filters.category = this.selectedCategory();
    }

    if (this.selectedTag()) {
      filters.tag = this.selectedTag();
    }

    this.store.dispatch(BlogActions.setBlogFilters({ filters }));
  }

  // Utility methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getReadTimeText(minutes: number): string {
    return `${minutes} min read`;
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      Frontend: '#e91e63',
      Backend: '#3f51b5',
      Database: '#4caf50',
      DevOps: '#ff9800',
      Design: '#f44336',
      Mobile: '#9c27b0',
      Testing: '#607d8b',
    };
    return colors[category] || '#666';
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}
