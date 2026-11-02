import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  Optional,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Designation, DesignationInput } from '../../core/models';
import { DepartmentService } from '../../core/services/department.service';

export interface DesignationFormDialogData {
  designation: Designation | null;
}

/**
 * DesignationFormComponent — create/edit a Designation. Department
 * choices are loaded from DepartmentService.
 */
@Component({
  selector: 'app-designation-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data?.designation ? 'Edit Designation' : 'Add Designation' }}</h2>

    <mat-dialog-content class="mat-typography">
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" maxlength="20" />
          @if (form.controls.code.hasError('required') && form.controls.code.touched) {
            <mat-error>Code is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
          @if (form.controls.title.hasError('required') && form.controls.title.touched) {
            <mat-error>Title is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Department</mat-label>
          <mat-select formControlName="departmentId" required>
            @for (d of departments(); track d.id) {
              <mat-option [value]="d.id">{{ d.name }}</mat-option>
            }
          </mat-select>
          @if (form.controls.departmentId.hasError('required') && form.controls.departmentId.touched) {
            <mat-error>Department is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Base Salary</mat-label>
          <input matInput type="number" formControlName="baseSalary" min="0" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
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
      .form-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 480px;
      }
      @media (max-width: 540px) {
        .form-grid {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class DesignationFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<DesignationFormComponent, DesignationInput>);
  private readonly departmentService = inject(DepartmentService);

  readonly departments = this.departmentService.departments;

  public readonly data: DesignationFormDialogData | null;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) data: DesignationFormDialogData | null
  ) {
    this.data = data;
    this.departmentService.load();
    const d = data?.designation;
    this.form.patchValue({
      code: d?.code ?? '',
      title: d?.title ?? '',
      departmentId: d?.departmentId ?? '',
      baseSalary: d?.baseSalary ?? 0,
      description: d?.description ?? '',
    });
  }

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    title: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    baseSalary: [0, [Validators.min(0)]],
    description: [''],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.getRawValue() as DesignationInput);
  }

  cancel(): void {
    this.ref.close();
  }
}
