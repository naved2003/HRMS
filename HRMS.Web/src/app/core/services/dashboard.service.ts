import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardStats } from '../models';

/** DashboardService — fetches aggregated stats for the dashboard landing page. */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly repo = inject(DashboardRepository);

  private readonly _stats = signal<DashboardStats | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly stats = this._stats.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasData = computed(() => this._stats() !== null);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getStats()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (s) => this._stats.set(s),
        error: (err) => this._error.set(err?.message ?? 'Failed to load dashboard'),
      });
  }
}
