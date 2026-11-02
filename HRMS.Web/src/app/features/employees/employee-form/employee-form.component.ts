import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  Optional,
} from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import {
  Employee,
  EmployeeInput,
  EmploymentType,
  Gender,
  EmployeeStatus,
} from '../../../core/models';
import { DepartmentService } from '../../../core/services/department.service';
import { DesignationService } from '../../../core/services/designation.service';

export interface EmployeeFormDialogData {
  employee: Employee | null;
}

/**
 * EmployeeFormComponent — comprehensive Reactive form for creating or
 * editing an employee. Grouped into Personal / Employment sections via
 * MatTabs in the dialog body.
 */
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data?.employee ? 'Edit Employee' : 'Add Employee' }}</h2>

    <mat-dialog-content class="mat-typography">
      <form [formGroup]="form" class="emp-form">
        <mat-tab-group>
          <mat-tab label="Personal">
            <div class="tab-grid">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" />
                @if (c.firstName.hasError('required') && c.firstName.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" />
                @if (c.lastName.hasError('required') && c.lastName.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" />
                @if (c.email.hasError('required') && c.email.touched) {
                  <mat-error>Required</mat-error>
                }
                @if (c.email.hasError('email') && c.email.touched) {
                  <mat-error>Invalid email</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="phone" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date of Birth</mat-label>
                <input matInput [matDatepicker]="dob" formControlName="dateOfBirth" />
                <mat-datepicker-toggle matIconSuffix [for]="dob"></mat-datepicker-toggle>
                <mat-datepicker #dob></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Gender</mat-label>
                <mat-select formControlName="gender">
                  @for (g of genders; track g) {
                    <mat-option [value]="g">{{ g }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="2"></textarea>
              </mat-form-field>
            </div>
          </mat-tab>

          <mat-tab label="Employment">
            <div class="tab-grid">
              <mat-form-field appearance="outline">
                <mat-label>Employee Code</mat-label>
                <input matInput formControlName="employeeCode" />
                @if (c.employeeCode.hasError('required') && c.employeeCode.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Department</mat-label>
                <mat-select formControlName="departmentId" (selectionChange)="onDepartmentChange($event.value)">
                  @for (d of departmentService.departments(); track d.id) {
                    <mat-option [value]="d.id">{{ d.name }}</mat-option>
                  }
                </mat-select>
                @if (c.departmentId.hasError('required') && c.departmentId.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Designation</mat-label>
                <mat-select formControlName="designationId">
                  @for (d of designationService.designations(); track d.id) {
                    <mat-option [value]="d.id">{{ d.title }}</mat-option>
                  }
                </mat-select>
                @if (c.designationId.hasError('required') && c.designationId.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Hire Date</mat-label>
                <input matInput [matDatepicker]="hire" formControlName="hireDate" />
                <mat-datepicker-toggle matIconSuffix [for]="hire"></mat-datepicker-toggle>
                <mat-datepicker #hire></mat-datepicker>
                @if (c.hireDate.hasError('required') && c.hireDate.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Employment Type</mat-label>
                <mat-select formControlName="employmentType">
                  @for (t of employmentTypes; track t) {
                    <mat-option [value]="t">{{ t }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  @for (s of statuses; track s) {
                    <mat-option [value]="s">{{ s }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Basic Salary</mat-label>
                <input matInput type="number" formControlName="basicSalary" min="0" />
                @if (c.basicSalary.hasError('required') && c.basicSalary.touched) {
                  <mat-error>Required</mat-error>
                }
              </mat-form-field>
            </div>
          </mat-tab>
        </mat-tab-group>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="save()" [disabled]="form.invalid">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .emp-form {
        min-width: 560px;
      }
      @media (max-width: 620px) {
        .emp-form {
          min-width: 100%;
        }
      }
      .tab-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-top: 12px;
      }
      .full-width {
        grid-column: span 2;
      }
      @media (max-width: 540px) {
        .tab-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class EmployeeFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<EmployeeFormComponent, EmployeeInput>);

  readonly departmentService = inject(DepartmentService);
  readonly designationService = inject(DesignationService);

  public readonly data: EmployeeFormDialogData | null;

  readonly genders = Object.values(Gender);
  readonly employmentTypes = Object.values(EmploymentType);
  readonly statuses = Object.values(EmployeeStatus);

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) data: EmployeeFormDialogData | null
  ) {
    this.data = data;
    this.departmentService.load();
    this.designationService.load();
    const e = data?.employee;
    this.form.patchValue({
      firstName: e?.firstName ?? '',
      lastName: e?.lastName ?? '',
      email: e?.email ?? '',
      phone: e?.phone ?? '',
      dateOfBirth: e?.dateOfBirth ? new Date(e.dateOfBirth) : (null as unknown as Date),
      gender: e?.gender ?? Gender.Male,
      address: e?.address ?? '',
      employeeCode: e?.employeeCode ?? '',
      departmentId: e?.departmentId ?? '',
      designationId: e?.designationId ?? '',
      hireDate: e?.hireDate ? new Date(e.hireDate) : new Date(),
      employmentType: e?.employmentType ?? EmploymentType.FullTime,
      basicSalary: e?.basicSalary ?? 0,
      status: e?.status ?? EmployeeStatus.Active,
    });
    if (e?.departmentId) {
      this.designationService.loadByDepartment(e.departmentId);
    }
  }

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    dateOfBirth: [null as unknown as Date],
    gender: [Gender.Male, [Validators.required]],
    address: [''],
    employeeCode: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    designationId: ['', [Validators.required]],
    hireDate: [new Date(), [Validators.required]],
    employmentType: [EmploymentType.FullTime, [Validators.required]],
    basicSalary: [0, [Validators.required, Validators.min(0)]],
    status: [EmployeeStatus.Active, [Validators.required]],
  });

  get c() {
    return this.form.controls;
  }

  onDepartmentChange(departmentId: string): void {
    this.designationService.loadByDepartment(departmentId);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    // The form controls hold Date instances (from the datepicker), but the
    // EmployeeInput DTO wants ISO strings. Convert here so the API receives
    // a JSON-serializable payload.
    const value: EmployeeInput = {
      ...raw,
      dateOfBirth:
        raw.dateOfBirth instanceof Date
          ? raw.dateOfBirth.toISOString()
          : (raw.dateOfBirth as string | undefined),
      hireDate:
        raw.hireDate instanceof Date
          ? raw.hireDate.toISOString()
          : (raw.hireDate as string),
    };
    this.ref.close(value);
  }

  cancel(): void {
    this.ref.close();
  }
}
