import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../../classes/project.model';

/** Project summary card used on the home and projects pages. */
@Component({
  selector: 'app-project-card',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  readonly maxTags = input(5);
  readonly details = output<Project>();

  year(project: Project): number {
    return new Date(project.endDate ?? project.startDate).getFullYear();
  }
}
