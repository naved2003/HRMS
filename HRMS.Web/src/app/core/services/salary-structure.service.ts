import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { SalaryStructureRepository } from '../repositories/salary-structure.repository';
import { SalaryStructure, SalaryStructureInput } from '../models';

/** SalaryStructureService — CRUD for salary structures per designation. */
@Injectable({ providedIn: 'root' })
export class SalaryStructureService {
  private readonly repo = inject(SalaryStructureRepository);

  private readonly _structures = signal<SalaryStructure[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly structures = this._structures.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._structures().length);

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getAll()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._structures.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load salary structures'),
      });
  }

  create(dto: SalaryStructureInput, onDone?: () => void): void {
    this.repo
      .create(dto)
      .subscribe({ next: () => { this.load(); onDone?.(); } });
  }

  update(id: string, dto: SalaryStructureInput, onDone?: () => void): void {
    this.repo
      .update(id, dto)
      .subscribe({ next: () => { this.load(); onDone?.(); } });
  }
}
