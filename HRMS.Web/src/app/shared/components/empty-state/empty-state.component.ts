import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * EmptyState — friendly "no records" placeholder shown when a list/table
 * is empty or returns no results.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <mat-icon class="empty-icon">{{ icon() }}</mat-icon>
      <p class="empty-message">{{ message() }}</p>
      @if (hint()) {
        <p class="empty-hint">{{ hint() }}</p>
      }
    </div>
  `,
  styles: [
    `
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 48px 16px;
        color: #64748b;
      }
      .empty-icon {
        font-size: 56px;
        width: 56px;
        height: 56px;
        color: #94a3b8;
      }
      .empty-message {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #475569;
      }
      .empty-hint {
        margin: 0;
        font-size: 13px;
        color: #94a3b8;
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly message = input<string>('No records found');
  readonly hint = input<string | undefined>(undefined);
  readonly icon = input<string>('inbox');
}
