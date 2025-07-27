import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { finalize, map, Subject, takeUntil } from 'rxjs';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormControls {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  subject: FormControl<string>;
  message: FormControl<string>;
}


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  
  // Component state using signals
  readonly isSubmitting = signal(false);

  submitStatus = signal<'idle' | 'success' | 'error'>('idle');
  
  // Form setup
  readonly contactForm: FormGroup<ContactFormControls>;
  
  // Subject options for the select dropdown
  readonly subjectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'project', label: 'Project Discussion' },
    { value: 'collaboration', label: 'Collaboration' },
    { value: 'job', label: 'Job Opportunity' },
    { value: 'other', label: 'Other' }
  ] as const;

  // Cleanup subscription
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.contactForm = this.createForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Creates and configures the reactive form with validation
   */
  private createForm(): FormGroup<ContactFormControls> {
    return this.fb.nonNullable.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * Handles form submission with proper error handling
   */
  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched();
      this.showError('Please fill in all required fields correctly');
      return;
    }

    if (this.isSubmitting()) {
      return; // Prevent double submission
    }

    this.submitStatus.set('idle');

    this.isSubmitting.set(true);
    const formData = this.getFormData();

    this.contactService.sendMessage(formData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: (response) => {
          this.submitStatus.set('success');
          return this.handleSuccess(response)
        },
        error: (error) => {
          this.submitStatus.set('error');
          setTimeout(() => {
            if (this.submitStatus() === 'error') {
              this.submitStatus.set('idle');
            }
          }, 5000);
          return this.handleError(error)
        }
      });
      this.isSubmitting.set(false)
  }

  /**
   * Resets the form to initial state
   */
  resetForm(): void {
    if (this.isSubmitting()) {
      return;
    }
    
    this.contactForm.reset();
    this.markFormGroupUntouched();
  }

  /**
   * Gets strongly typed form data
   */
  private getFormData(): ContactFormData {
    const formValue = this.contactForm.getRawValue();
    return {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim().toLowerCase(),
      subject: formValue.subject,
      message: formValue.message.trim()
    };
  }

  /**
   * Marks all form controls as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    this.contactForm.markAllAsTouched();
  }

  /**
   * Marks all form controls as untouched to hide validation errors
   */
  private markFormGroupUntouched(): void {
    this.contactForm.markAsUntouched();
  }

  /**
   * Handles successful form submission
   */
  private handleSuccess(response: any): void {
    this.showSuccess('Message sent successfully! We\'ll get back to you soon.');
    this.resetForm();
  }

  /**
   * Handles form submission errors
   */
  private handleError(error: any): void {
    console.error('Contact form submission error:', error);
    
    let errorMessage = 'Failed to send message. Please try again.';
    
    if (error.status === 429) {
      errorMessage = 'Too many requests. Please wait a moment before trying again.';
    } else if (error.status === 400) {
      errorMessage = 'Please check your input and try again.';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    this.showError(errorMessage);
  }

  /**
   * Shows success message
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Shows error message
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 7000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Helper method to check if a specific form control has an error
   */
  hasError(controlName: keyof ContactFormControls, errorType: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control?.hasError(errorType) && control?.touched);
  }

  /**
   * Gets the error message for a specific form control
   */
  getErrorMessage(controlName: keyof ContactFormControls): string {
    const control = this.contactForm.get(controlName);
    if (!control?.errors || !control?.touched) {
      return '';
    }

    const errors = control.errors;
    
    if (errors['required']) {
      return `${this.getFieldDisplayName(controlName)} is required`;
    }
    
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${this.getFieldDisplayName(controlName)} must be at least ${requiredLength} characters`;
    }
    
    return 'Invalid input';
  }

  /**
   * Gets display name for form fields
   */
  private getFieldDisplayName(controlName: keyof ContactFormControls): string {
    const displayNames: Record<keyof ContactFormControls, string> = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message'
    };
    
    return displayNames[controlName];
  }
}
