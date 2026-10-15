import { MatDialog } from '@angular/material/dialog';
import { Project } from '../classes/project.model';

/** Opens the project case-study dialog (lazy-loaded). */
export async function openProjectDetails(dialog: MatDialog, project: Project): Promise<void> {
  const { ProjectDetailsComponent } = await import('../pages/projects/project-details/project-details.component');
  dialog.open(ProjectDetailsComponent, {
    data: { project },
    width: '760px',
    maxWidth: '94vw',
    maxHeight: '90vh',
    autoFocus: 'dialog',
  });
}
