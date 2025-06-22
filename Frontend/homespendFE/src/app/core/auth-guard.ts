import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

   canActivate(): boolean {
    // Check AuthService and localStorage
    if (this.authService.isAuthenticated() || !!localStorage.getItem('authToken')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
