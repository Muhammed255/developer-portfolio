import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../../classes/project.model';
import { ProjectStatus } from '../../../../utils/enums/project-status.enum';
import { formatRange } from '../../../shared/format';

const STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.IN_PROGRESS]: 'In progress',
  [ProjectStatus.PLANNED]: 'Planned',
  [ProjectStatus.ARCHIVED]: 'Archived',
};

/** Case-study dialog for a single project. Opened via openProjectDetails(). */
@Component({
  selector: 'app-project-details',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailsComponent {
  readonly project = inject<{ project: Project }>(MAT_DIALOG_DATA).project;
  readonly statusLabel = STATUS_LABELS[this.project.status];
  readonly dates = formatRange(this.project.startDate, this.project.endDate);
  readonly highlights = Object.values(this.project.metrics ?? {}).filter((v): v is string => !!v);
}
