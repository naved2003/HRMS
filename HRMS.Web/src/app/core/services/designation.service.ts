import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DesignationRepository } from '../repositories/designation.repository';
import { Designation, DesignationInput } from '../models';

/**
 * DesignationService — manages the list of designations, supports filtering
 * by department (the .NET API returns filtered results from the repository).
 */
@Injectable({ providedIn: 'root' })
export class DesignationService {
  private readonly repo = inject(DesignationRepository);

  private readonly _designations = signal<Designation[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly designations = this._designations.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._designations().length);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getAll()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._designations.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load designations'),
      });
  }

  loadByDepartment(departmentId: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getByDepartment(departmentId)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._designations.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load designations'),
      });
  }

  create(dto: DesignationInput, onSuccess?: () => void): void {
    this.repo
      .create(dto)
      .subscribe({ next: () => { this.load(); onSuccess?.(); } });
  }

  update(id: string, dto: DesignationInput, onSuccess?: () => void): void {
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
