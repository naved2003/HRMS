import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PayrollService } from '../../core/services/payroll.service';
import { NotificationService } from '../../core/services/notification.service';
import { PayrollRecord } from '../../core/models';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';
import { PayslipViewComponent } from './payslip-view/payslip-view.component';

/**
 * PayrollListComponent — month/year picker, table of payroll records,
 * and "Process Payroll" button for bulk processing. Clicking a row's
 * "View Payslip" button opens the PayslipViewComponent dialog.
 */
@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDialogModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payroll-list.component.html',
  styleUrl: './payroll-list.component.css',
})
export class PayrollListComponent {
  private readonly payrollService = inject(PayrollService);
  private readonly dialog = inject(MatDialog);
  private readonly notify = inject(NotificationService);

  readonly records = this.payrollService.records;
  readonly loading = this.payrollService.loading;
  readonly error = this.payrollService.error;
  readonly totalNet = this.payrollService.totalNet;

  readonly displayedColumns = [
    'employeeName',
    'month',
    'year',
    'gross',
    'totalDeductions',
    'netPay',
    'status',
    'actions',
  ];

  readonly months = Array.from({ length: 12 }, (_, i) => i + 1);
  readonly years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  private readonly _month = signal<number>(new Date().getMonth() + 1);
  private readonly _year = signal<number>(new Date().getFullYear());
  private readonly _processing = signal(false);

  readonly month = this._month;
  readonly year = this._year;
  readonly processing = this._processing;

  ngOnInit(): void {
    this.load();
  }

  onMonthChange(value: number): void {
    this._month.set(value);
    this.load();
  }

  onYearChange(value: number): void {
    this._year.set(value);
    this.load();
  }

  load(): void {
    this.payrollService.loadByMonthYear(this._month(), this._year());
  }

  processBulk(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      data: {
        title: 'Process Payroll',
        message: `Run payroll for ${this._month()}/${this._year()}? This will create payslips for all active employees.`,
        confirmLabel: 'Process',
      },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this._processing.set(true);
      this.payrollService.processBulk({ month: this._month(), year: this._year() }, () => {
        this._processing.set(false);
        this.notify.success(`Payroll processed for ${this._month()}/${this._year()}.`);
      });
    });
  }

  viewPayslip(row: PayrollRecord): void {
    this.dialog.open(PayslipViewComponent, {
      width: '820px',
      data: { payslipId: row.id },
    });
  }
}
