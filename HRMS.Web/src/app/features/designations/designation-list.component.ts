import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DesignationService } from '../../core/services/designation.service';
import { Designation } from '../../core/models';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DesignationFormComponent } from './designation-form.component';

/**
 * DesignationListComponent — table of designations with CRUD actions.
 * Reuses the same pattern as the department list.
 */
@Component({
  selector: 'app-designation-list',
  standalone: true,
  imports: [
    DecimalPipe,
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
  templateUrl: './designation-list.component.html',
  styleUrl: './designation-list.component.css',
})
export class DesignationListComponent {
  private readonly service = inject(DesignationService);
  private readonly dialog = inject(MatDialog);

  readonly designations = this.service.designations;
  readonly loading = this.service.loading;
  readonly error = this.service.error;

  readonly displayedColumns = [
    'code',
    'title',
    'departmentName',
    'baseSalary',
    'employeeCount',
    'actions',
  ];

  private readonly _selection = signal<Designation | null>(null);
  readonly editing = this._selection.asReadonly();

  ngOnInit(): void {
    this.service.load();
  }

  openCreate(): void {
    this.openDialog(null);
  }

  openEdit(row: Designation): void {
    this.openDialog(row);
  }

  confirmDelete(row: Designation): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      data: {
        title: 'Delete Designation',
        message: `Delete "${row.title}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.service.remove(row.id);
    });
  }

  private openDialog(row: Designation | null): void {
    const ref = this.dialog.open(DesignationFormComponent, {
      width: '560px',
      data: { designation: row },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      if (row) this.service.update(row.id, result);
      else this.service.create(result);
    });
  }
}
