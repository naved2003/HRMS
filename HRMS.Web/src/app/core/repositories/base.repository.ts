import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Abstract base class for all HRMS repositories.
 *
 * Each aggregate repository extends this class and reuses the typed HTTP
 * helpers so business code does not duplicate HttpClient plumbing. The
 * base URL is read from `environment.apiUrl` (default `/api`).
 */
@Injectable()
export abstract class BaseRepository {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.apiUrl;

  protected list<T>(url: string, params?: HttpParams | Record<string, unknown>): Observable<T[]> {
    const httpParams = this.toHttpParams(params);
    return this.http.get<T[]>(`${this.baseUrl}${url}`, { params: httpParams });
  }

  protected get<T>(url: string, params?: HttpParams | Record<string, unknown>): Observable<T> {
    const httpParams = this.toHttpParams(params);
    return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams });
  }

  protected post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body);
  }

  protected postVoid(url: string, body: unknown): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}${url}`, body);
  }

  protected put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body);
  }

  protected putVoid(url: string, body: unknown): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}${url}`, body);
  }

  protected delete(url: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${url}`);
  }

  /** Convert a Record of primitives / arrays into HttpParams. */
  private toHttpParams(params?: HttpParams | Record<string, unknown>): HttpParams | undefined {
    if (!params) return undefined;
    if (params instanceof HttpParams) return params;
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => (httpParams = httpParams.append(key, String(v))));
      } else {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
