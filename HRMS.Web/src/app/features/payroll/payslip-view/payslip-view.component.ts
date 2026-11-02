import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Inject,
  Optional,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { PayrollService } from '../../../core/services/payroll.service';
import { Payslip, PayslipComponent as PayslipLine } from '../../../core/models';

export interface PayslipViewDialogData {
  payslipId: string;
}

/**
 * PayslipViewComponent — read-only payslip dialog. Renders earnings and
 * deductions breakdown and offers a "Print" button that triggers
 * `window.print()` (CSS handles the print layout).
 */
@Component({
  selector: 'app-payslip-view',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payslip-view.component.html',
  styleUrl: './payslip-view.component.css',
})
export class PayslipViewComponent {
  private readonly payrollService = inject(PayrollService);
  private readonly ref = inject(MatDialogRef<PayslipViewComponent>);

  public readonly data: PayslipViewDialogData;

  readonly payslip = this.payrollService.payslip;
  readonly loading = this.payrollService.loading;

  readonly earningsColumns = ['name', 'amount'];
  readonly deductionsColumns = ['name', 'amount'];

  readonly earnings = computed<PayslipLine[]>(() => {
    const slip = this.payslip();
    return (slip?.components ?? []).filter((c) => c.type === 'Earning');
  });

  readonly deductions = computed<PayslipLine[]>(() => {
    const slip = this.payslip();
    return (slip?.components ?? []).filter((c) => c.type === 'Deduction');
  });

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) data: PayslipViewDialogData
  ) {
    this.data = data;
    if (data?.payslipId) {
      this.payrollService.viewPayslip(data.payslipId);
    }
  }

  print(): void {
    window.print();
  }

  close(): void {
    this.ref.close();
  }
}
