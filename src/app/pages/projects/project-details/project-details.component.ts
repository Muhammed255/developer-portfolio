import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ProjectStatus } from '../../../../utils/enums/project-status.enum';
import { Project } from '../../../classes/project.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatCardModule,
    TitleCasePipe
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectDetailsComponent implements OnInit {
  selectedImage = '';
  currentImageIndex = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { project: Project }
  ) {}

  ngOnInit() {
    if (this.data.project?.images?.length) {
      this.selectedImage = this.data.project.images[0];
    }
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
    this.selectedImage = this.data.project.images[index];
  }

  nextImage() {
    if (this.currentImageIndex < this.data.project.images.length - 1) {
      this.selectImage(this.currentImageIndex + 1);
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.selectImage(this.currentImageIndex - 1);
    }
  }

  getStatusColor(status: ProjectStatus): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'primary';
      case ProjectStatus.IN_PROGRESS:
        return 'accent';
      case ProjectStatus.PLANNED:
        return 'warn';
      default:
        return 'primary';
    }
  }

  getStatusIcon(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return 'check_circle';
      case ProjectStatus.IN_PROGRESS:
        return 'update';
      case ProjectStatus.PLANNED:
        return 'schedule';
      case ProjectStatus.ARCHIVED:
        return 'archive';
      default:
        return 'help_outline';
    }
  }

  formatDateRange(startDate: Date, endDate?: Date): string {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    if (!endDate) {
      return `${start} - Present`;
    }
    
    const end = new Date(endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    return `${start} - ${end}`;
  }
}