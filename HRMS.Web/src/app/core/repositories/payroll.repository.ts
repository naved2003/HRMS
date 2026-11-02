import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import {
  PayrollRecord,
  Payslip,
  ProcessBulkPayrollRequest,
  ProcessPayrollRequest,
} from '../models';

/** PayrollRepository wraps /api/payroll/* endpoints. */
@Injectable({ providedIn: 'root' })
export class PayrollRepository extends BaseRepository {
  process(req: ProcessPayrollRequest): Observable<PayrollRecord> {
    return this.post<PayrollRecord>('/payroll/process', req);
  }

  processBulk(req: ProcessBulkPayrollRequest): Observable<PayrollRecord[]> {
    return this.post<PayrollRecord[]>('/payroll/process-bulk', req);
  }

  getPayslip(id: string): Observable<Payslip> {
    return this.get<Payslip>(`/payroll/${id}/payslip`);
  }

  getByMonthYear(month: number, year: number): Observable<PayrollRecord[]> {
    return this.list<PayrollRecord>('/payroll', { month, year });
  }

  getByEmployee(employeeId: string): Observable<PayrollRecord[]> {
    return this.list<PayrollRecord>(`/payroll/employee/${employeeId}`);
  }
}
