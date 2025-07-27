import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FlexLayoutModule } from 'ngx-flexible-layout';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, FlexLayoutModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }

  refresh(): void {
    window.location.reload();
  }

  contactSupport(): void {
    // Implement your support contact logic here
    // For example: open a modal, navigate to contact page, or send email
    console.log('Contact support clicked');
    // Example: this.router.navigate(['/contact']);
  }
}
