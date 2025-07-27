import { trigger, transition, style, animate } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Experience } from '../../classes/experience.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { AppState } from '../../../store/app.state';
import { ExperienceType } from '../../../utils/enums/experience-type.enum';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { selectAllExperiences, selectAllTechnologies, selectCurrentPosition, selectEarliestPosition, selectExperienceFilters, selectExperiencesError, selectExperiencesLoading, selectExperienceTypesCount, selectFilteredExperiences, selectTotalAchievements, selectTotalExperienceYears } from '../../../store/experience/experience.selectors';
import { loadExperiences, setExperienceFilters } from '../../../store/experience/experience.actions';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatTooltipModule,
    TitleCasePipe,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.scss',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperiencesComponent implements OnInit, OnDestroy {
 private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  filterExperienceFormGroup: FormGroup;

  // View properties
  viewMode: 'timeline' | 'cards' = 'timeline';

  // selectedType = '';
  // searchTerm = '';

  // Data properties
  experiences$ = this.store.select(selectFilteredExperiences);
  loading$ = this.store.select(selectExperiencesLoading);
  error$ = this.store.select(selectExperiencesError);
  filters$ = this.store.select(selectExperienceFilters);
  totalExpYears$ = this.store.select(selectTotalExperienceYears);
  allTech$ = this.store.select(selectAllTechnologies);
  totalAchievements$ = this.store.select(selectTotalAchievements);
  earliestPosition$ = this.store.select(selectEarliestPosition);
  currentPosition$ = this.store.select(selectCurrentPosition);
  experienceTypeCount$ = this.store.select(selectExperienceTypesCount);

  // Filter options
  experienceTypes = [
    { value: ExperienceType.FULL_TIME, label: 'Full Time' },
    { value: ExperienceType.PART_TIME, label: 'Part Time' },
    { value: ExperienceType.CONTRACT, label: 'Contract' },
    { value: ExperienceType.FREELANCE, label: 'Freelance' },
    { value: ExperienceType.INTERNSHIP, label: 'Internship' },
  ];

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.filterExperienceFormGroup = this.fb.group({
      filterType: [''],
      searchExperience: [''],
    });

    this.filterExperienceFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formValue) => {
        this.updateFilters(formValue);
      });
  }

  ngOnInit() {
    this.store.dispatch(loadExperiences());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateFilters(formValue: any) {
    const filters = {
      type: formValue.filterType || undefined,
      searchTerm: formValue.searchExperience || undefined,
      company: undefined,
      position: undefined,
      description: undefined
    };

    this.store.dispatch(setExperienceFilters({ filters }));
  }


  onFilterChange() {
    // this.applyFilters();
    this.cdr.markForCheck()
  }

  onSearchChange(event: any) {
    // Update the form control which will trigger valueChanges
    this.filterExperienceFormGroup.patchValue({
      searchExperience: event.target.value
    });
  }

  onViewModeChange() {
    this.cdr.markForCheck();
  }

  clearFilters() {
    this.filterExperienceFormGroup.reset();
    this.store.dispatch(setExperienceFilters({ 
      filters: {
        type: undefined,
        searchTerm: undefined,
        company: undefined,
        position: undefined,
        description: undefined
      }
    }));
  }

  trackByExperience(index: number, experience: Experience): string {
    return experience.id;
  }

  getExperienceIcon(type: ExperienceType): string {
    switch (type) {
      case ExperienceType.FULL_TIME:
        return 'work';
      case ExperienceType.PART_TIME:
        return 'schedule';
      case ExperienceType.CONTRACT:
        return 'assignment';
      case ExperienceType.FREELANCE:
        return 'person';
      case ExperienceType.INTERNSHIP:
        return 'school';
      default:
        return 'work';
    }
  }

  getExperienceTypeClass(type: ExperienceType): string {
    return type.replace('_', '-');
  }

  getTypeColor(type: ExperienceType): 'primary' | 'accent' | 'warn' {
    switch (type) {
      case ExperienceType.FULL_TIME:
        return 'primary';
      case ExperienceType.CONTRACT:
        return 'accent';
      case ExperienceType.FREELANCE:
        return 'warn';
      default:
        return 'primary';
    }
  }

  formatDuration(startDate: Date, endDate?: Date): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const startStr = start.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    const endStr = endDate
      ? end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Present';

    // Calculate duration
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let duration = '';
    if (years > 0) duration += `${years} yr${years > 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      if (duration) duration += ' ';
      duration += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    }

    return `${startStr} - ${endStr} (${duration})`;
  }

  openExperienceDetails(exp: any) {}
}
