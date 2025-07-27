import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { init, open, logout, currentUser } from 'netlify-identity-widget';
import { Observable, throwError, timeout, retry, map, catchError } from 'rxjs';
import { environment } from '../../environments/environment.development';


// Interfaces for type safety
export interface ContactMessage {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  message: string;
  result?: any;
}

export interface ContactApiPayload {
  name: string;
  from: string;
  subject: string;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient)

  constructor() {
    init();
  }

  login() {
    open('login');
  }

  logout() {
    logout();
  }

  getCurrentUser() {
    return currentUser();
  }

  isAuthenticated(): boolean {
    return !!currentUser();
  }

  isAdmin(): boolean | null {
    const user = currentUser();
    return (
      user &&
      user.app_metadata &&
      user.app_metadata.roles &&
      user.app_metadata.roles.includes('admin')
    );
  }
  
  // Configuration
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';
  private readonly TIMEOUT_MS = 10000; // 10 seconds
  private readonly RETRY_ATTEMPTS = 2;
  
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  /**
   * Sends a contact message to the server
   * @param message - The contact message data
   * @returns Observable<ContactResponse>
   */
  sendMessage(message: ContactMessage): Observable<ContactResponse> {
    if (!this.isValidMessage(message)) {
      return throwError(() => new Error('Invalid message data'));
    }

    const payload = this.transformToApiPayload(message);
    
    return this.http.post<ContactResponse>(
      `${this.API_URL}/send-mail`, 
      payload, 
      this.httpOptions
    ).pipe(
      timeout(this.TIMEOUT_MS),
      retry({
        count: this.RETRY_ATTEMPTS,
        delay: (error: HttpErrorResponse) => {
          // Only retry on network errors or 5xx server errors
          if (error.status === 0 || (error.status >= 500 && error.status < 600)) {
            return throwError(() => error);
          }
          // Don't retry on client errors (4xx)
          return throwError(() => error);
        }
      }),
      map(response => this.validateResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * Validates the contact message data
   * @param message - The message to validate
   * @returns boolean indicating if message is valid
   */
  private isValidMessage(message: ContactMessage): boolean {
    if (!message) return false;
    
    const requiredFields: (keyof ContactMessage)[] = [
      'firstName', 'lastName', 'email', 'subject', 'message'
    ];
    
    return requiredFields.every(field => {
      const value = message[field];
      return typeof value === 'string' && value.trim().length > 0;
    });
  }

  /**
   * Transforms the frontend message format to the API payload format
   * @param message - The contact message
   * @returns ContactApiPayload
   */
  private transformToApiPayload(message: ContactMessage): ContactApiPayload {
    return {
      name: `${message.firstName.trim()} ${message.lastName.trim()}`,
      from: message.email.trim().toLowerCase(),
      subject: message.subject.trim(),
      body: message.message.trim()
    };
  }

  /**
   * Validates the server response
   * @param response - The server response
   * @returns ContactResponse
   */
  private validateResponse(response: any): ContactResponse {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid server response');
    }
    
    if (!response.message) {
      throw new Error('Server response missing message');
    }
    
    return response as ContactResponse;
  }

  /**
   * Handles HTTP errors with proper error transformation
   * @param error - The HTTP error
   * @returns Observable that throws a user-friendly error
   */
  private handleError(error: any): Observable<never> {
    console.error('ContactService error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 0;
    
    if (error instanceof HttpErrorResponse) {
      statusCode = error.status;
      
      switch (error.status) {
        case 0:
          errorMessage = 'Network error - please check your internet connection';
          break;
        case 400:
          errorMessage = error.error?.message || 'Invalid request data';
          break;
        case 429:
          errorMessage = error.error?.message || 'Too many requests - please try again later';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = 'Server error - please try again later';
          break;
        default:
          errorMessage = error.error?.message || `Server error (${error.status})`;
      }
    } else if (error.name === 'TimeoutError') {
      errorMessage = 'Request timed out - please try again';
      statusCode = 408;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // Create a standardized error object
    const standardizedError = {
      message: errorMessage,
      status: statusCode,
      originalError: error
    };
    
    return throwError(() => standardizedError);
  }
}
