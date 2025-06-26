import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    if (
      this.authService.isAuthenticated() ||
      !!localStorage.getItem('authToken')
    ) {
      return this.authService.getUserRoleAsync().then((userRole) => {
        const requiredRoles = route.data['roles'] as Array<string>;
        if (requiredRoles && requiredRoles.includes(userRole)) {
          return true;
        } else {
          this.router.navigate(['/apartments']);
          return false;
        }
      });
    } else {
      this.router.navigate(['/login']);
      return Promise.resolve(false);
    }
  }
}
