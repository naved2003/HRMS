import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { Attendance, AttendanceFilter, AttendanceInput } from '../models';

/**
 * AttendanceService — drives the attendance page. Supports loading by date,
 * by employee, or by an arbitrary filter. `mark` posts a single attendance
 * row, `markBulk` is a convenience wrapper that calls `mark` for each entry.
 */
@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly repo = inject(AttendanceRepository);

  private readonly _records = signal<Attendance[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly records = this._records.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly presentCount = computed(
    () => this._records().filter((r) => r.status === 'Present').length
  );

  loadByDate(date: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getByDate(date)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._records.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load attendance'),
      });
  }

  loadByEmployee(employeeId: string, from?: string, to?: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getByEmployee(employeeId, from, to)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._records.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load attendance'),
      });
  }

  loadByFilter(filter: AttendanceFilter): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .queryByFilter(filter)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._records.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load attendance'),
      });
  }

  mark(dto: AttendanceInput, onSuccess?: (rec: Attendance) => void): void {
    this.repo
      .mark(dto)
      .subscribe({
        next: (rec) => { this.upsert(rec); onSuccess?.(rec); },
        error: (err) => this._error.set(err?.message ?? 'Failed to save attendance'),
      });
  }

  private upsert(rec: Attendance): void {
    const current = this._records();
    const idx = current.findIndex((r) => r.id === rec.id);
    if (idx === -1) {
      this._records.set([rec, ...current]);
    } else {
      const next = [...current];
      next[idx] = rec;
      this._records.set(next);
    }
  }
}
