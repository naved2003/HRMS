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

import { Department, DepartmentInput } from '../../core/models';

export interface DepartmentFormDialogData {
  department: Department | null;
}

/**
 * DepartmentFormComponent — Reactive form used for both create and edit
 * of a department. Opened via MatDialog from the list page.
 */
@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data?.department ? 'Edit Department' : 'Add Department' }}</h2>

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
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.controls.name.hasError('required') && form.controls.name.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Cancel</button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        (click)="save()"
        [disabled]="form.invalid"
      >
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
        min-width: 460px;
      }
      @media (max-width: 540px) {
        .form-grid {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class DepartmentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<DepartmentFormComponent, DepartmentInput>);

  public readonly data: DepartmentFormDialogData | null;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) data: DepartmentFormDialogData | null
  ) {
    this.data = data;
    const dep = data?.department;
    this.form.patchValue({
      code: dep?.code ?? '',
      name: dep?.name ?? '',
      description: dep?.description ?? '',
      managerId: dep?.managerId ?? '',
    });
  }

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(20)]],
    name: ['', [Validators.required]],
    description: [''],
    managerId: [''],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    // The .NET API's CreateDepartmentDto expects `int? ManagerId` — sending an
    // empty string ("") for it makes ASP.NET Core return 400 with validation
    // error "The value '' is not valid for 'ManagerId'." Convert empty string
    // to undefined so the field is omitted from the JSON payload entirely,
    // which the API deserializes as null (which int? accepts).
    const dto: DepartmentInput = {
      code: raw.code,
      name: raw.name,
      description: raw.description || undefined,
      managerId: raw.managerId || undefined,
    };
    this.ref.close(dto);
  }

  cancel(): void {
    this.ref.close();
  }
}
