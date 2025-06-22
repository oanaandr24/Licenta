import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticatedValue = !!localStorage.getItem('authToken');

  setAuthenticated(value: boolean): void {
    this.isAuthenticatedValue = value;
    if (value) {
      // Example: Set a dummy token if none exists
      if (!localStorage.getItem('authToken')) {
        localStorage.setItem('authToken', 'your-default-token');
      }
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userCode');
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedValue || !!localStorage.getItem('authToken');
  }

  logout(): void {
    this.setAuthenticated(false);
  }
}
