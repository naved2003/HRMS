import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthRepository } from '../repositories/auth.repository';
import { AuthUser, LoginRequest, UserRole } from '../models';

const USER_STORAGE_KEY = 'hrms.currentUser';

/**
 * AuthService owns the authenticated-user state.
 *
 * State is exposed as Angular signals (`currentUser`, `isAuthenticated`,
 * `hasRole`) so that components can react without manual subscriptions.
 * The user object is persisted to localStorage so a refresh does not lose
 * the identity (the actual auth cookie is HTTP-only and managed by the
 * .NET backend).
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authRepo = inject(AuthRepository);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<AuthUser | null>(this.restoreUser());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly roles = computed<UserRole[]>(() => this._currentUser()?.roles ?? []);

  login(payload: LoginRequest): Observable<unknown> {
    return this.authRepo.login(payload).pipe(
      tap((res) => {
        this.setUser(res.user);
      })
    );
  }

  logout(): void {
    this.authRepo.logout().subscribe({
      complete: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  loadCurrentUser(): Observable<AuthUser> {
    return this.authRepo.getCurrentUser().pipe(
      tap((user) => this.setUser(user))
    );
  }

  hasRole(role: UserRole): boolean {
    return this.roles().includes(role);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    if (!roles.length) return true;
    return this.roles().some((r) => roles.includes(r));
  }

  private setUser(user: AuthUser): void {
    this._currentUser.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }

  private restoreUser(): AuthUser | null {
    try {
      const raw = typeof localStorage !== 'undefined'
        ? localStorage.getItem(USER_STORAGE_KEY)
        : null;
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private finishLogout(): void {
    this._currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    void this.router.navigate(['/login']);
  }
}
