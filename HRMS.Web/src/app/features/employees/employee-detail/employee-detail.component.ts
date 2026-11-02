import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EmployeeService } from '../../../core/services/employee.service';
import { AttendanceService } from '../../../core/services/attendance.service';
import { LeaveService } from '../../../core/services/leave.service';
import { PayrollService } from '../../../core/services/payroll.service';
import { Attendance, LeaveRequest, PayrollRecord } from '../../../core/models';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';

/**
 * EmployeeDetailComponent — six-tab view (Profile, Attendance, Leave,
 * Salary/Payroll, Performance, Documents). Loads the employee plus
 * dependent sub-aggregates via their respective services.
 *
 * Tab content for Performance and Documents is currently placeholder
 * (data shape is not yet stabilised by the .NET agent).
 */
@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css',
})
export class EmployeeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly employeeService = inject(EmployeeService);
  private readonly attendanceService = inject(AttendanceService);
  private readonly leaveService = inject(LeaveService);
  private readonly payrollService = inject(PayrollService);

  readonly employee = this.employeeService.selected;
  readonly loading = this.employeeService.loading;
  readonly error = this.employeeService.error;

  readonly attendanceRecords = this.attendanceService.records;
  readonly leaveRequests = this.leaveService.requests;
  readonly payrollRecords = this.payrollService.records;

  readonly attendanceColumns = ['date', 'status', 'checkIn', 'checkOut', 'workedHours'];
  readonly leaveColumns = ['leaveType', 'fromDate', 'toDate', 'days', 'status'];
  readonly payrollColumns = ['month', 'year', 'gross', 'totalDeductions', 'netPay', 'status'];

  private readonly _tabIndex = signal(0);
  readonly tabIndex = this._tabIndex.asReadonly();

  private readonly _loadedTabs = signal<Set<number>>(new Set([0]));

  readonly employeeId = computed(() => this.employee()?.id ?? '');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (id) {
      this.employeeService.loadById(id);
    }
  }

  ngOnDestroy(): void {
    this.employeeService.clearSelected();
  }

  onTabChange(index: number): void {
    this._tabIndex.set(index);
    const id = this.employeeId();
    if (!id) return;
    if (this._loadedTabs().has(index)) return;

    switch (index) {
      case 1:
        this.attendanceService.loadByEmployee(id);
        break;
      case 2:
        this.leaveService.loadMine();
        break;
      case 3:
        this.payrollService.loadByMonthYear(new Date().getMonth() + 1, new Date().getFullYear());
        break;
      default:
        break;
    }
    const next = new Set(this._loadedTabs());
    next.add(index);
    this._loadedTabs.set(next);
  }

  goBack(): void {
    void this.router.navigate(['/employees']);
  }

  formatDate(value: string | undefined): string {
    return value ? new Date(value).toLocaleDateString() : '—';
  }
}
