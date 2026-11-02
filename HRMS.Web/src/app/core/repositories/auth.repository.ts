import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { AuthUser, LoginRequest, LoginResponse } from '../models';

/**
 * AuthRepository wraps /api/auth/* endpoints.
 * The .NET backend issues a HTTP-only cookie on login, so the browser
 * transparently sends it on subsequent requests.
 */
@Injectable({ providedIn: 'root' })
export class AuthRepository extends BaseRepository {
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.post<LoginResponse>('/auth/login', payload);
  }

  logout(): Observable<void> {
    return this.postVoid('/auth/logout', {});
  }

  getCurrentUser(): Observable<AuthUser> {
    return this.get<AuthUser>('/auth/me');
  }
}
