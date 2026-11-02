import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { EmployeeRepository } from '../repositories/employee.repository';
import { Employee, EmployeeInput, EmployeeListItem } from '../models';

/**
 * EmployeeService — owns the list of employees shown on the listing page and
 * exposes a separate signal for the currently selected employee used by the
 * detail view. Searches by name are done client-side for simplicity.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly repo = inject(EmployeeRepository);

  private readonly _employees = signal<EmployeeListItem[]>([]);
  private readonly _selected = signal<Employee | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly employees = this._employees.asReadonly();
  readonly selected = this._selected.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._employees().length);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getAll()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._employees.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load employees'),
      });
  }

  loadById(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getWithDetails(id)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (emp) => this._selected.set(emp),
        error: (err) => this._error.set(err?.message ?? 'Failed to load employee'),
      });
  }

  clearSelected(): void {
    this._selected.set(null);
  }

  create(dto: EmployeeInput, onSuccess?: (emp: Employee) => void): void {
    this.repo
      .create(dto)
      .subscribe({ next: (emp) => { this.load(); onSuccess?.(emp); } });
  }

  update(id: string, dto: EmployeeInput, onSuccess?: () => void): void {
    this.repo
      .update(id, dto)
      .subscribe({ next: () => { this.load(); onSuccess?.(); } });
  }

  remove(id: string, onSuccess?: () => void): void {
    this.repo
      .delete(id)
      .subscribe({ next: () => { this.load(); onSuccess?.(); } });
  }
}
