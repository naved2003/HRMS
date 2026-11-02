import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewChild,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

export interface DataTableColumn<T> {
  /** Property name on the row to display. */
  field: string;
  /** Header label. */
  label: string;
  /** Optional cell formatter: receives the row, returns a string. */
  formatter?: (row: T) => string | number | null | undefined;
  /** Whether this column is sortable (defaults to true). */
  sortable?: boolean;
  /** Width CSS hint. */
  width?: string;
}

/**
 * DataTable<T> — generic, reusable Material table with pagination,
 * sorting, and a row-level action menu (edit / view / delete). Emits
 * typed events consumers can subscribe to.
 *
 * Usage:
 *   <app-data-table
 *     [data]="rows"
 *     [columns]="columns"
 *     [total]="rows.length"
 *     (rowClick)="onRow($event)"
 *     (edit)="onEdit($event)"
 *     (delete)="onDelete($event)"
 *   />
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrapper">
      <table mat-table [dataSource]="data()" matSort (matSortChange)="sortChange.emit($event)">
        @for (col of columns(); track col.field) {
          <ng-container [matColumnDef]="col.field">
            <th
              mat-header-cell
              *matHeaderCellDef
              mat-sort-header
              [disabled]="col.sortable === false"
            >
              {{ col.label }}
            </th>
            <td mat-cell *matCellDef="let row" [style.width]="col.width">
              {{ col.formatter ? col.formatter(row) : row[col.field] }}
            </td>
          </ng-container>
        }

        @if (showActions()) {
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="actions-col">Actions</th>
            <td mat-cell *matCellDef="let row" class="actions-col">
              <button mat-icon-button [matMenuTriggerFor]="rowMenu" aria-label="Row actions"
                (click)="$event.stopPropagation()">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #rowMenu="matMenu">
                <button mat-menu-item (click)="edit.emit(row)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="rowClick.emit(row)">
                  <mat-icon>visibility</mat-icon>
                  <span>View</span>
                </button>
                <button mat-menu-item class="danger" (click)="delete.emit(row)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns()"
          class="data-row"
          (click)="rowClick.emit(row)"
        ></tr>
      </table>
    </div>

    <mat-paginator
      [length]="total()"
      [pageSize]="pageSize()"
      [pageIndex]="pageIndex()"
      [pageSizeOptions]="[10, 25, 50, 100]"
      (page)="pageChange.emit($event)"
    />
  `,
  styles: [
    `
      .table-wrapper {
        overflow-x: auto;
        background: #ffffff;
        border-radius: 8px;
      }
      .actions-col {
        width: 80px;
        text-align: right;
      }
      .data-row {
        cursor: pointer;
      }
      .danger {
        color: #b91c1c;
      }
    `,
  ],
})
export class DataTableComponent<T> {
  readonly data = input.required<T[]>();
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly total = input<number>(0);
  readonly pageSize = input<number>(10);
  readonly pageIndex = input<number>(0);
  readonly showActions = input<boolean>(true);

  readonly rowClick = output<T>();
  readonly edit = output<T>();
  readonly delete = output<T>();
  readonly pageChange = output<PageEvent>();
  readonly sortChange = output<Sort>();

  @ViewChild(MatSort) sort?: MatSort;

  readonly displayedColumns = computed(() => {
    const cols = this.columns() ?? [];
    const fields = cols.map((c) => c.field);
    return this.showActions() ? [...fields, 'actions'] : fields;
  });
}
