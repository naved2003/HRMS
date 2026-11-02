import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PayrollRepository } from '../repositories/payroll.repository';
import {
  PayrollRecord,
  Payslip,
  ProcessBulkPayrollRequest,
  ProcessPayrollRequest,
} from '../models';

/**
 * PayrollService — owns the list of payroll records shown on the payroll
 * page, plus the payslip currently being viewed. `processBulk` refreshes
 * the list once the bulk operation completes.
 */
@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly repo = inject(PayrollRepository);

  private readonly _records = signal<PayrollRecord[]>([]);
  private readonly _payslip = signal<Payslip | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly records = this._records.asReadonly();
  readonly payslip = this._payslip.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly totalNet = computed(() =>
    this._records().reduce((sum, r) => sum + (r.netPay ?? 0), 0)
  );

  loadByMonthYear(month: number, year: number): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getByMonthYear(month, year)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => this._records.set(list),
        error: (err) => this._error.set(err?.message ?? 'Failed to load payroll'),
      });
  }

  process(req: ProcessPayrollRequest, onDone?: (rec: PayrollRecord) => void): void {
    this.repo
      .process(req)
      .subscribe({
        next: (rec) => { onDone?.(rec); this.loadByMonthYear(req.month, req.year); },
        error: (err) => this._error.set(err?.message ?? 'Failed to process payroll'),
      });
  }

  processBulk(req: ProcessBulkPayrollRequest, onDone?: () => void): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .processBulk(req)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (list) => {
          this._records.set(list);
          onDone?.();
        },
        error: (err) => this._error.set(err?.message ?? 'Failed to bulk-process payroll'),
      });
  }

  viewPayslip(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this.repo
      .getPayslip(id)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (slip) => this._payslip.set(slip),
        error: (err) => this._error.set(err?.message ?? 'Failed to load payslip'),
      });
  }

  clearPayslip(): void {
    this._payslip.set(null);
  }
}
