import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PortfolioDataService } from '../../app/services/portfolio-data.service';
import * as ExperienceActions from './experience.actions';

@Injectable()
export class ExperienceEffects {
  private actions$ = inject(Actions);
  private experienceService = inject(PortfolioDataService);

  loadExperiences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExperienceActions.loadExperiences),
      switchMap(() =>
        this.experienceService.getExperiences().pipe(
          map((experiences) =>
            ExperienceActions.loadExperiencesSuccess({ experiences })
          ),
          catchError((error) =>
            of(
              ExperienceActions.loadExperiencesFailure({
                error: error.message || 'Failed to load experiences',
              })
            )
          )
        )
      )
    )
  );
}
