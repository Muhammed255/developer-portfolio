import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PortfolioDataService } from '../../app/services/portfolio-data.service';
import * as BlogActions from './blog.actions';

@Injectable()
export class BlogEffects {
  private actions$ = inject(Actions);
  private blogService = inject(PortfolioDataService);

  loadBlogPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadBlogPosts),
      switchMap(() =>
        this.blogService.getBlogPosts().pipe(
          map((posts) => BlogActions.loadBlogPostsSuccess({ posts })),
          catchError((error) =>
            of(
              BlogActions.loadBlogPostsFailure({
                error: error.message || 'Failed to load blog posts',
              })
            )
          )
        )
      )
    )
  );

  loadBlogPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlogActions.loadBlogPost),
      switchMap(({ slug }) =>
        this.blogService.getBlogPost(slug).pipe(
          map((post) => BlogActions.loadBlogPostSuccess({ post })),
          catchError((error) =>
            of(
              BlogActions.loadBlogPostFailure({
                error: error.message || 'Failed to load blog post',
              })
            )
          )
        )
      )
    )
  );
}
