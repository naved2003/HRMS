import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ApiError } from '../models';

/**
 * errorInterceptor — surfaces backend errors to the user via
 * NotificationService and redirects to /login on 401 responses.
 *
 * The original error is re-thrown so feature code can still react to it,
 * but the user-facing message has already been displayed.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = extractMessage(error);

      if (error.status === 401) {
        // Unauthenticated — flush stale user state and send to /login.
        if (authService.isAuthenticated()) {
          authService.logout();
        } else {
          void router.navigate(['/login']);
        }
        notification.error('You must be signed in to perform this action.');
      } else if (error.status === 403) {
        notification.error('You do not have permission to perform this action.');
      } else if (error.status === 0) {
        notification.error('Unable to reach the HRMS server. Please try again.');
      } else if (error.status >= 500) {
        notification.error('A server error occurred. Please contact support.');
      } else {
        notification.error(message);
      }

      return throwError(() => error);
    })
  );
};

/** Extract a human-friendly message from a backend error response. */
function extractMessage(error: HttpErrorResponse): string {
  const body = error.error as Partial<ApiError> | undefined;

  if (body?.message) {
    return body.message;
  }
  if (body?.title) {
    return body.title;
  }
  if (body?.errors) {
    const flat = Object.values(body.errors).flat();
    if (flat.length) {
      return flat.join(' ');
    }
  }
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }
  return `Request failed (${error.status})`;
}
