import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PortfolioDataService } from '../../app/services/portfolio-data.service';
import * as SkillActions from './skills.actions';

@Injectable()
export class SkillsEffects {
  private actions$ = inject(Actions);
  private skillService = inject(PortfolioDataService);

  loadSkills$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SkillActions.loadSkills),
      switchMap(() =>
        this.skillService.getSkills().pipe(
          map((skills) => SkillActions.loadSkillsSuccess({ skills })),
          catchError((error) =>
            of(
              SkillActions.loadSkillsFailure({
                error: error.message || 'Failed to load skills',
              })
            )
          )
        )
      )
    )
  );
}
