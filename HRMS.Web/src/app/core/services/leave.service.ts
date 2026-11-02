import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LeaveRepository } from '../repositories/leave.repository';
import { LeaveApproval, LeaveRequest, LeaveRequestInput } from '../models';

/**
 * LeaveService — manages leave requests shown on the leave page. The list
 * reflects the most recently fetched scope (mine, pending, or all). Each
 * write operation calls `refresh(scope)` to reload.
 */
@Injectable({ providedIn: 'root' })
export class LeaveService {
  private readonly repo = inject(LeaveRepository);

  private readonly _requests = signal<LeaveRequest[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly requests = this._requests.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly pendingCount = computed(
    () => this._requests().filter((r) => r.status === 'Pending').length
  );

  loadMine(): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getMine()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._requests.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load leave requests'),
      });
  }

  loadPending(): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getPending()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._requests.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load pending requests'),
      });
  }

  loadAll(): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getAll()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._requests.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load leave requests'),
      });
  }

  apply(dto: LeaveRequestInput, onDone?: () => void): void {
    this.repo
      .apply(dto)
      .subscribe({
        next: () => { this.loadMine(); onDone?.(); },
        error: (err) => this._error.set(err?.message ?? 'Failed to apply for leave'),
      });
  }

  approve(id: string, dto: LeaveApproval, onDone?: () => void): void {
    this.repo
      .approve(id, dto)
      .subscribe({
        next: () => { this.loadPending(); onDone?.(); },
        error: (err) => this._error.set(err?.message ?? 'Failed to approve leave'),
      });
  }

  reject(id: string, dto: LeaveApproval, onDone?: () => void): void {
    this.repo
      .reject(id, dto)
      .subscribe({
        next: () => { this.loadPending(); onDone?.(); },
        error: (err) => this._error.set(err?.message ?? 'Failed to reject leave'),
      });
  }

  cancel(id: string, onDone?: () => void): void {
    this.repo
      .cancel(id)
      .subscribe({
        next: () => { this.loadMine(); onDone?.(); },
        error: (err) => this._error.set(err?.message ?? 'Failed to cancel leave'),
      });
  }
}
