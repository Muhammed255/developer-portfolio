import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, timeout, timer } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactMessage {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot: bound to a field hidden from humans. Must stay empty. */
  website?: string;
}

export interface ContactResponse {
  message: string;
}

export interface ContactError {
  message: string;
  status: number;
}

interface ContactApiPayload {
  name: string;
  from: string;
  subject: string;
  body: string;
  website: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;
  private readonly timeoutMs = 15000;
  private readonly retryAttempts = 2;

  /**
   * Sends a contact message to the backend `/send-mail` endpoint.
   * Network errors and 5xx responses are retried with a short backoff;
   * 4xx responses (validation, rate limit) are not.
   */
  sendMessage(message: ContactMessage): Observable<ContactResponse> {
    return this.http
      .post<ContactResponse>(`${this.apiUrl}/send-mail`, this.toApiPayload(message))
      .pipe(
        timeout(this.timeoutMs),
        retry({
          count: this.retryAttempts,
          delay: (error, retryCount) =>
            this.isRetryable(error) ? timer(1000 * retryCount) : throwError(() => error),
        }),
        catchError((error) => throwError(() => this.toContactError(error)))
      );
  }

  private toApiPayload(message: ContactMessage): ContactApiPayload {
    return {
      name: `${message.firstName.trim()} ${message.lastName.trim()}`,
      from: message.email.trim(),
      subject: message.subject.trim(),
      body: message.message.trim(),
      website: message.website ?? '',
    };
  }

  private isRetryable(error: unknown): boolean {
    return error instanceof HttpErrorResponse && (error.status === 0 || error.status >= 500);
  }

  private toContactError(error: unknown): ContactError {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return { status: 0, message: 'Network error. Please check your connection and try again.' };
        case 400:
          return { status: 400, message: 'Please check your input and try again.' };
        case 429:
          return { status: 429, message: 'Too many messages. Please wait a few minutes before trying again.' };
        default:
          return { status: error.status, message: 'Server error. Please try again later.' };
      }
    }
    if (error instanceof Error && error.name === 'TimeoutError') {
      return { status: 408, message: 'The request timed out. Please try again.' };
    }
    return { status: 0, message: 'Failed to send message. Please try again.' };
  }
}
