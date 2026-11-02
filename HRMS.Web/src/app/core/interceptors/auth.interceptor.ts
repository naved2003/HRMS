import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

/**
 * authInterceptor — runs before every HTTP request. Sends credentials
 * (cookies) and, if present, attaches the auth token from AuthService.
 * Toggles the global LoadingService while the request is in flight.
 *
 * Note: the HRMS backend uses cookie-based ASP.NET Identity auth, so the
 * `withCredentials: true` flag is the critical piece — the Authorization
 * header is only a fallback for browsers that block third-party cookies.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const loadingService = inject(LoadingService);

  // Skip loading indicator for background polling requests if needed.
  loadingService.start();

  const user = authService.currentUser();
  let authReq = req.clone({ withCredentials: true });

  if (user) {
    // Optional token-based fallback. The backend cookie is preferred.
    authReq = authReq.clone({
      setHeaders: {
        'X-HRMS-User': user.id,
      },
    });
  }

  return next(authReq).pipe(
    finalize(() => loadingService.stop())
  );
};
