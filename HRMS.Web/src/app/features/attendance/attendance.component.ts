import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AttendanceService } from '../../core/services/attendance.service';
import { DepartmentService } from '../../core/services/department.service';
import { EmployeeService } from '../../core/services/employee.service';
import { NotificationService } from '../../core/services/notification.service';
import { AttendanceStatus, AttendanceInput } from '../../core/models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';

interface AttendanceRow {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  dirty: boolean;
}

/**
 * AttendanceComponent — daily attendance marking screen.
 *
 * The user picks a date and a department filter; the page composes a
 * table of all employees with the existing attendance row pre-populated.
 * Each row exposes a status dropdown + check-in / check-out time inputs.
 * "Save All" persists the dirty rows back to the API via the
 * AttendanceService.mark() method.
 */
@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatTooltipModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent {
  private readonly attendanceService = inject(AttendanceService);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly notify = inject(NotificationService);

  readonly loading = this.attendanceService.loading;
  readonly error = this.attendanceService.error;

  readonly statuses = Object.values(AttendanceStatus);

  private readonly _date = signal<string>(this.todayIso());
  private readonly _departmentId = signal<string>('');
  private readonly _rows = signal<AttendanceRow[]>([]);
  private readonly _saving = signal(false);

  readonly date = this._date;
  readonly departmentId = this._departmentId;
  readonly rows = this._rows;
  readonly saving = this._saving;

  readonly displayedColumns = [
    'employee',
    'department',
    'status',
    'checkIn',
    'checkOut',
    'actions',
  ];

  readonly departments = this.departmentService.departments;

  readonly hasDirty = computed(() => this._rows().some((r) => r.dirty));

  ngOnInit(): void {
    this.departmentService.load();
    this.employeeService.load();
    this.refresh();
  }

  onDateChange(value: Date | string): void {
    const iso = typeof value === 'string' ? value : this.toIso(value);
    this._date.set(iso);
    this.refresh();
  }

  onDepartmentChange(value: string): void {
    this._departmentId.set(value);
    this.refresh();
  }

  markDirty(row: AttendanceRow): void {
    row.dirty = true;
  }

  saveRow(row: AttendanceRow): void {
    const dto: AttendanceInput = {
      employeeId: row.employeeId,
      date: this._date(),
      status: row.status,
      checkIn: row.checkIn || undefined,
      checkOut: row.checkOut || undefined,
    };
    this.attendanceService.mark(dto, () => {
      row.dirty = false;
      this.notify.success(`Attendance saved for ${row.employeeName}`);
    });
  }

  saveAll(): void {
    const dirty = this._rows().filter((r) => r.dirty);
    if (!dirty.length) {
      this.notify.info('No changes to save.');
      return;
    }
    this._saving.set(true);
    dirty.forEach((row) => this.saveRow(row));
    this._saving.set(false);
  }

  private refresh(): void {
    const date = this._date();
    const deptId = this._departmentId();

    this.attendanceService.loadByDate(date);
    // After load fires asynchronously, sync with employees.
    setTimeout(() => this.composeRows(date, deptId), 0);
  }

  private composeRows(date: string, deptId: string): void {
    const employees = this.employeeService.employees().filter(
      (e) => !deptId || e.departmentId === deptId
    );
    const existing = this.attendanceService.records();
    const rows: AttendanceRow[] = employees.map((emp) => {
      const rec = existing.find((r) => r.employeeId === emp.id);
      return {
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: emp.fullName,
        departmentName: emp.departmentName,
        status: rec?.status ?? AttendanceStatus.Present,
        checkIn: rec?.checkIn ?? '',
        checkOut: rec?.checkOut ?? '',
        dirty: false,
      };
    });
    this._rows.set(rows);
  }

  private todayIso(): string {
    return this.toIso(new Date());
  }

  private toIso(date: Date): string {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  }
}
