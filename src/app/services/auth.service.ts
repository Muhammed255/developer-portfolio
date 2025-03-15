import { Injectable } from '@angular/core';
import * as netlifyIdentity from 'netlify-identity-widget';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    netlifyIdentity.init();
  }
  
  login() {
    netlifyIdentity.open('login');
  }
  
  logout() {
    netlifyIdentity.logout();
  }
  
  getCurrentUser() {
    return netlifyIdentity.currentUser();
  }
  
  isAuthenticated(): boolean {
    return !!netlifyIdentity.currentUser();
  }
  
  isAdmin(): boolean | null {
    const user = netlifyIdentity.currentUser();
    return user && user.app_metadata && user.app_metadata.roles && user.app_metadata.roles.includes('admin');
  }
}
