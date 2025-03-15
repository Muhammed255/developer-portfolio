import { Injectable } from '@angular/core';
import { init, open, logout, currentUser } from 'netlify-identity-widget';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
}
