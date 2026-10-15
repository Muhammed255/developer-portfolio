import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactError, ContactMessage, ContactService } from '../../services/contact.service';
import { finalize } from 'rxjs';
import { profile } from '../../../data/profile.data';

interface ContactFormControls {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  subject: FormControl<string>;
  message: FormControl<string>;
  website: FormControl<string>;
}


@Component({
    selector: 'app-contact',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatSnackBarModule
    ],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {

  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);
  
  // Component state using signals
  readonly profile = profile;
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

  constructor() {
    this.contactForm = this.createForm();
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
      message: ['', [Validators.required, Validators.minLength(10)]],
      // Honeypot: hidden from people, bots tend to fill it in.
      website: ['']
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
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: () => {
          this.submitStatus.set('success');
          this.handleSuccess();
        },
        error: (error) => {
          this.submitStatus.set('error');
          setTimeout(() => {
            if (this.submitStatus() === 'error') {
              this.submitStatus.set('idle');
            }
          }, 5000);
          this.handleError(error);
        }
      });
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
  private getFormData(): ContactMessage {
    const formValue = this.contactForm.getRawValue();
    return {
      firstName: formValue.firstName.trim(),
      lastName: formValue.lastName.trim(),
      email: formValue.email.trim().toLowerCase(),
      subject: this.subjectOptions.find((o) => o.value === formValue.subject)?.label ?? formValue.subject,
      message: formValue.message.trim(),
      website: formValue.website
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
  private handleSuccess(): void {
    this.showSuccess('Message sent successfully! We\'ll get back to you soon.');
    this.resetForm();
  }

  /**
   * Handles form submission errors
   */
  private handleError(error: ContactError): void {
    this.showError(error.message);
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
      website: 'Website',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message'
    };
    
    return displayNames[controlName];
  }
}
