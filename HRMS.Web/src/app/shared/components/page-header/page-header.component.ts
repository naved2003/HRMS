import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * PageHeader — simple presentational header used at the top of every
 * feature page. Inputs follow the new Angular signal-input API.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div class="text">
        @if (icon()) {
          <mat-icon class="icon">{{ icon() }}</mat-icon>
        }
        <div>
          <h1 class="title">{{ title() }}</h1>
          @if (subtitle()) {
            <p class="subtitle">{{ subtitle() }}</p>
          }
        </div>
      </div>
      <div class="actions">
        <ng-content />
      </div>
    </header>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .text {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: #2563eb;
      }
      .title {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
      }
      .subtitle {
        margin: 2px 0 0;
        color: #64748b;
        font-size: 14px;
      }
      .actions {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ],
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
}
