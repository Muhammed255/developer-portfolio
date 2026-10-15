import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PortfolioDataService } from '../../app/services/portfolio-data.service';
import * as SkillActions from './skills.actions';

@Injectable()
export class SkillsEffects {
  private readonly actions$ = inject(Actions);
  private readonly data = inject(PortfolioDataService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SkillActions.loadSkills),
      switchMap(() =>
        this.data.getSkills().pipe(
          map((skills) => SkillActions.loadSkillsSuccess({ skills })),
          catchError((error) =>
            of(SkillActions.loadSkillsFailure({ error: error.message || 'Failed to load skills' }))
          )
        )
      )
    )
  );
}
