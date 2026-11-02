import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { AttendanceService } from '../../core/services/attendance.service';
import { LeaveService } from '../../core/services/leave.service';
import { PayrollService } from '../../core/services/payroll.service';
import { Attendance, LeaveRequest, PayrollRecord } from '../../core/models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CsvColumn, exportToCsv } from '../../shared/utils/csv-export.util';

/**
 * ReportsComponent — three report cards (Attendance, Leave, Payroll).
 *
 * Each card has its own filter inputs and an "Export to CSV" button that
 * triggers the shared CSV utility. Data is sourced from the existing
 * feature services so no extra endpoints are needed.
 */
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    DecimalPipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatProgressBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  private readonly attendanceService = inject(AttendanceService);
  private readonly leaveService = inject(LeaveService);
  private readonly payrollService = inject(PayrollService);

  readonly attendanceRecords = this.attendanceService.records;
  readonly leaveRecords = this.leaveService.requests;
  readonly payrollRecords = this.payrollService.records;

  readonly attendanceColumns = ['employeeName', 'date', 'status', 'checkIn', 'checkOut'];
  readonly leaveColumns = ['employeeName', 'leaveType', 'fromDate', 'toDate', 'days', 'status'];
  readonly payrollColumns = ['employeeName', 'month', 'year', 'netPay', 'status'];

  private readonly _from = signal<string>(this.isoDate(new Date(Date.now() - 7 * 86400000)));
  private readonly _to = signal<string>(this.isoDate(new Date()));
  private readonly _month = signal<number>(new Date().getMonth() + 1);
  private readonly _year = signal<number>(new Date().getFullYear());

  readonly from = this._from;
  readonly to = this._to;
  readonly month = this._month;
  readonly year = this._year;

  readonly months = Array.from({ length: 12 }, (_, i) => i + 1);
  readonly years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  ngOnInit(): void {
    this.loadAttendance();
    this.leaveService.loadAll();
    this.payrollService.loadByMonthYear(this._month(), this._year());
  }

  loadAttendance(): void {
    this.attendanceService.loadByFilter({
      from: this._from(),
      to: this._to(),
    });
  }

  onFromChange(value: Date | string): void {
    this._from.set(this.isoDate(typeof value === 'string' ? new Date(value) : value));
    this.loadAttendance();
  }

  onToChange(value: Date | string): void {
    this._to.set(this.isoDate(typeof value === 'string' ? new Date(value) : value));
    this.loadAttendance();
  }

  onMonthChange(value: number): void {
    this._month.set(value);
    this.payrollService.loadByMonthYear(value, this._year());
  }

  onYearChange(value: number): void {
    this._year.set(value);
    this.payrollService.loadByMonthYear(this._month(), value);
  }

  exportAttendance(): void {
    const columns: CsvColumn<Attendance>[] = [
      { header: 'Employee', value: (r) => r.employeeName },
      { header: 'Code', value: (r) => r.employeeCode },
      { header: 'Date', value: (r) => r.date },
      { header: 'Status', value: (r) => r.status },
      { header: 'Check In', value: (r) => r.checkIn ?? '' },
      { header: 'Check Out', value: (r) => r.checkOut ?? '' },
      { header: 'Hours', value: (r) => r.workedHours ?? '' },
    ];
    exportToCsv(this.attendanceRecords(), columns, `attendance-${this._from()}_to_${this._to()}`);
  }

  exportLeave(): void {
    const columns: CsvColumn<LeaveRequest>[] = [
      { header: 'Employee', value: (r) => r.employeeName },
      { header: 'Code', value: (r) => r.employeeCode },
      { header: 'Leave Type', value: (r) => r.leaveType },
      { header: 'From', value: (r) => r.fromDate },
      { header: 'To', value: (r) => r.toDate },
      { header: 'Days', value: (r) => r.days },
      { header: 'Status', value: (r) => r.status },
      { header: 'Reason', value: (r) => r.reason ?? '' },
    ];
    exportToCsv(this.leaveRecords(), columns, `leave-report-${this.isoDate(new Date())}`);
  }

  exportPayroll(): void {
    const columns: CsvColumn<PayrollRecord>[] = [
      { header: 'Employee', value: (r) => r.employeeName },
      { header: 'Code', value: (r) => r.employeeCode },
      { header: 'Month', value: (r) => r.month },
      { header: 'Year', value: (r) => r.year },
      { header: 'Gross', value: (r) => r.gross },
      { header: 'Earnings', value: (r) => r.totalEarnings },
      { header: 'Deductions', value: (r) => r.totalDeductions },
      { header: 'Net Pay', value: (r) => r.netPay },
      { header: 'Status', value: (r) => r.status },
    ];
    exportToCsv(this.payrollRecords(), columns, `payroll-${this._month()}-${this._year()}`);
  }

  private isoDate(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  }
}
