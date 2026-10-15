import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { loadExperiences } from '../../../store/experience/experience.actions';
import { selectAllExperiences } from '../../../store/experience/experience.selectors';
import { profile } from '../../../data/profile.data';
import { ExperienceType } from '../../../utils/enums/experience-type.enum';
import { formatDuration, formatRange } from '../../shared/format';

const TYPE_LABELS: Record<ExperienceType, string> = {
  [ExperienceType.FULL_TIME]: 'Full-time',
  [ExperienceType.PART_TIME]: 'Part-time',
  [ExperienceType.CONTRACT]: 'Contract',
  [ExperienceType.FREELANCE]: 'Freelance',
  [ExperienceType.INTERNSHIP]: 'Internship',
};

@Component({
  selector: 'app-experiences',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperiencesComponent implements OnInit {
  private readonly store = inject(Store<AppState>);

  readonly experiences = toSignal(this.store.select(selectAllExperiences), { initialValue: [] });
  readonly education = profile.education;
  readonly typeLabels = TYPE_LABELS;
  readonly formatRange = formatRange;
  readonly formatDuration = formatDuration;

  ngOnInit(): void {
    this.store.dispatch(loadExperiences());
  }
}
