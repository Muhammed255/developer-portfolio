import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PortfolioDataService } from '../../app/services/portfolio-data.service';
import * as ExperienceActions from './experience.actions';

@Injectable()
export class ExperiencesEffects {
  private readonly actions$ = inject(Actions);
  private readonly data = inject(PortfolioDataService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExperienceActions.loadExperiences),
      switchMap(() =>
        this.data.getExperiences().pipe(
          map((experiences) => ExperienceActions.loadExperiencesSuccess({ experiences })),
          catchError((error) =>
            of(ExperienceActions.loadExperiencesFailure({ error: error.message || 'Failed to load experiences' }))
          )
        )
      )
    )
  );
}
