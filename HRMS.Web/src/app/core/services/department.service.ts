import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DepartmentRepository } from '../repositories/department.repository';
import { Department, DepartmentInput } from '../models';

/**
 * DepartmentService — wraps the DepartmentRepository, exposes a signals-based
 * `departments` list plus loading/error flags. All write operations refresh
 * the list after success.
 */
@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly repo = inject(DepartmentRepository);

  private readonly _departments = signal<Department[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly departments = this._departments.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._departments().length);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getAll()
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({
        next: (list) => this._departments.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load departments'),
      });
  }

  create(dto: DepartmentInput, onSuccess?: () => void): void {
    this.repo
      .create(dto)
      .subscribe({ next: () => { this.load(); onSuccess?.(); } });
  }

  update(id: string, dto: DepartmentInput, onSuccess?: () => void): void {
    this.repo
      .update(id, dto)
      .subscribe({ next: () => { this.load(); onSuccess?.(); } });
  }

  remove(id: string, onSuccess?: () => void): void {
    this.repo
      .delete(id)
      .subscribe({ next: () => { this.load(); onSuccess?.(); } });
  }

  getById(id: string) {
    return this.repo.getById(id);
  }
}
