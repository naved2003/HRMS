import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DepartmentService } from '../../core/services/department.service';
import { Department } from '../../core/models';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DepartmentFormComponent } from './department-form.component';
import { DepartmentFormDialogData } from './department-form.component';

/**
 * DepartmentListComponent — lists departments in a Material table, lets
 * the user open the create/edit dialog, and confirms deletes via
 * ConfirmDialog.
 */
@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDialogModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css',
})
export class DepartmentListComponent {
  private readonly service = inject(DepartmentService);
  private readonly dialog = inject(MatDialog);

  readonly departments = this.service.departments;
  readonly loading = this.service.loading;
  readonly error = this.service.error;

  readonly displayedColumns = ['code', 'name', 'manager', 'employeeCount', 'actions'];

  private readonly _selection = signal<Department | null>(null);
  readonly editing = this._selection.asReadonly();

  ngOnInit(): void {
    this.service.load();
  }

  openCreate(): void {
    this.openDialog(null);
  }

  openEdit(row: Department): void {
    this.openDialog(row);
  }

  confirmDelete(row: Department): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      data: {
        title: 'Delete Department',
        message: `Delete "${row.name}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.remove(row.id);
      }
    });
  }

  private openDialog(row: Department | null): void {
    const data: DepartmentFormDialogData = { department: row };
    const ref = this.dialog.open(DepartmentFormComponent, {
      width: '520px',
      data,
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      if (row) {
        this.service.update(row.id, result);
      } else {
        this.service.create(result);
      }
    });
  }
}
