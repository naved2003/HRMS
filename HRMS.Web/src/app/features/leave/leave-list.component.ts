import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LeaveService } from '../../core/services/leave.service';
import { LeaveApproval, LeaveRequestInput, LeaveType } from '../../core/models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusChipComponent } from '../../shared/components/status-chip/status-chip.component';

/**
 * LeaveListComponent — three-tab leave management screen:
 * 1. My Leaves — current user's requests + "Apply for Leave" button.
 * 2. Pending Approvals — HR/Manager queue with approve/reject actions.
 * 3. All Leaves — full history table.
 */
@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    StatusChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './leave-list.component.html',
  styleUrl: './leave-list.component.css',
})
export class LeaveListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly leaveService = inject(LeaveService);

  readonly requests = this.leaveService.requests;
  readonly loading = this.leaveService.loading;
  readonly error = this.leaveService.error;

  readonly leaveTypes = Object.values(LeaveType);

  readonly displayedColumns = [
    'employee',
    'leaveType',
    'fromDate',
    'toDate',
    'days',
    'status',
    'actions',
  ];

  private readonly _tab = signal(0);
  readonly tab = this._tab.asReadonly();
  private readonly _loaded = signal<Set<number>>(new Set<number>());

  readonly applyForm = this.fb.nonNullable.group({
    employeeId: ['', [Validators.required]],
    leaveType: [LeaveType.Casual, [Validators.required]],
    fromDate: [new Date(), [Validators.required]],
    toDate: [new Date(), [Validators.required]],
    reason: [''],
  });

  ngOnInit(): void {
    this.loadTab(0);
  }

  onTabChange(index: number): void {
    this._tab.set(index);
    this.loadTab(index);
  }

  private loadTab(index: number): void {
    const loaded = this._loaded();
    if (loaded.has(index)) return;
    switch (index) {
      case 0:
        this.leaveService.loadMine();
        break;
      case 1:
        this.leaveService.loadPending();
        break;
      case 2:
        this.leaveService.loadAll();
        break;
    }
    const next = new Set(loaded);
    next.add(index);
    this._loaded.set(next);
  }

  apply(): void {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      return;
    }
    const value = this.applyForm.getRawValue();
    const dto: LeaveRequestInput = {
      employeeId: value.employeeId,
      leaveType: value.leaveType,
      fromDate: value.fromDate.toISOString(),
      toDate: value.toDate.toISOString(),
      reason: value.reason,
    };
    this.leaveService.apply(dto, () => {
      this.applyForm.reset({ leaveType: LeaveType.Casual });
    });
  }

  approve(id: string): void {
    this.leaveService.approve(id, {});
  }

  reject(id: string): void {
    this.leaveService.reject(id, {});
  }

  cancel(id: string): void {
    this.leaveService.cancel(id);
  }
}
