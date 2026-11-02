import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

/**
 * roleGuard — functional route guard factory. Usage in routes:
 *
 *   canActivate: [authGuard, roleGuard([UserRole.Admin, UserRole.HR])]
 *
 * The guard checks the current user's roles. If none match, the user is
 * redirected to /dashboard with an "unauthorised" query string.
 */
export function roleGuard(roles: UserRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.hasAnyRole(roles)) {
      return true;
    }

    return router.createUrlTree(['/dashboard'], {
      queryParams: { reason: 'unauthorised' },
    });
  };
}
