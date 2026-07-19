import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export function roleGuard(role: Role): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }

    const existingUser = authService.currentUser();
    if (existingUser) {
      return existingUser.role === role ? true : router.createUrlTree(['/dashboard']);
    }

    return authService.loadCurrentUser().pipe(
      map((user) => (user.role === role ? true : router.createUrlTree(['/dashboard']))),
      catchError(() => of(router.createUrlTree(['/login']))),
    );
  };
}
