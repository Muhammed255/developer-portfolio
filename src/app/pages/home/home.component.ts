import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  private router = inject(Router);

  navigateToProjects() {
    this.router.navigate(['/projects']);
  }

  navigateToSkills() {
    this.router.navigate(['/skills']);
  }

  navigateToExperience() {
    this.router.navigate(['/experience']);
  }

  navigateToBlog() {
    this.router.navigate(['/blog']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

}
