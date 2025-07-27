import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PortfolioDataService } from '../../app/services/portfolio-data.service';
import * as ProjectActions from './project.actions';

@Injectable()
export class ProjectsEffects {
  private actions$ = inject(Actions);
  private projectService = inject(PortfolioDataService);

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProjects),
      switchMap(() =>
        this.projectService.getProjects().pipe(
          map((projects) => ProjectActions.loadProjectsSuccess({ projects })),
          catchError((error) =>
            of(
              ProjectActions.loadProjectsFailure({
                error: error.message || 'Failed to load projects',
              })
            )
          )
        )
      )
    )
  );

  loadProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProject),
      switchMap(({ id }) =>
        this.projectService.getProject(id).pipe(
          map((project) => ProjectActions.loadProjectSuccess({ project })),
          catchError((error) =>
            of(
              ProjectActions.loadProjectFailure({
                error: error.message || 'Failed to load project',
              })
            )
          )
        )
      )
    )
  );
}
