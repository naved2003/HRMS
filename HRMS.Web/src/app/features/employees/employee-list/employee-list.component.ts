import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { DepartmentService } from '../../../core/services/department.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeInput, EmployeeListItem } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../../shared/components/status-chip/status-chip.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

/**
 * EmployeeListComponent — lists employees with department filter and
 * free-text search. Clicking a row navigates to the detail page.
 */
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  private readonly service = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly employees = this.service.employees;
  readonly loading = this.service.loading;
  readonly error = this.service.error;
  readonly departments = this.departmentService.departments;

  readonly displayedColumns = [
    'employeeCode',
    'fullName',
    'email',
    'departmentName',
    'designationName',
    'status',
    'actions',
  ];

  private readonly _search = signal('');
  private readonly _departmentId = signal<string>('');

  readonly filtered = computed<EmployeeListItem[]>(() => {
    const term = this._search().trim().toLowerCase();
    const dept = this._departmentId();
    return (this.employees() ?? []).filter((e) => {
      const matchesTerm =
        !term ||
        e.fullName.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.employeeCode.toLowerCase().includes(term);
      const matchesDept = !dept || e.departmentId === dept;
      return matchesTerm && matchesDept;
    });
  });

  ngOnInit(): void {
    this.service.load();
    this.departmentService.load();
  }

  onSearch(term: string): void {
    this._search.set(term);
  }

  onDepartmentFilter(deptId: string): void {
    this._departmentId.set(deptId);
  }

  openCreate(): void {
    const ref = this.dialog.open(EmployeeFormComponent, {
      width: '720px',
      data: { employee: null },
    });
    ref.afterClosed().subscribe((result: EmployeeInput | undefined) => {
      if (result) this.service.create(result);
    });
  }

  openEdit(row: EmployeeListItem): void {
    // Navigate to detail page to edit (full form is on detail).
    void this.router.navigate(['/employees', row.id]);
  }

  confirmDelete(row: EmployeeListItem): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      data: {
        title: 'Delete Employee',
        message: `Delete "${row.fullName}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.service.remove(row.id);
    });
  }

  openRow(row: EmployeeListItem): void {
    void this.router.navigate(['/employees', row.id]);
  }
}
