import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../../../../store/app.state';
import { BlogPost } from '../../../classes/blog.model';
import { AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { dummyBlogPosts } from '../../../../utils/dummy/dummy-blog-posts';
import { selectSelectedBlogPost } from '../../../../store/blog/blog.selectors';
import { likeBlogPost, loadBlogPost } from '../../../../store/blog/blog.actions';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    AsyncPipe,
    MatTooltipModule
  ],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss'
})
export class BlogDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store<AppState>);
  
  post$: Observable<BlogPost | null> = this.store.select(selectSelectedBlogPost);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.store.dispatch(loadBlogPost({ slug }));
    }
  }

  goBack() {
    this.router.navigate(['/blog']);
  }

  onLike(post: BlogPost) {
    this.store.dispatch(likeBlogPost({ postId: post.id }));
  }

  shareOnTwitter(post: BlogPost) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article: ${post.title}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    // You might want to show a snackbar notification here
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
